import { useState, useEffect, useRef, useMemo } from 'react';
import { Evidence, StudentProfile, ExtractedSkill } from '../types/evidence';
import { EvidenceCard } from '../components/EvidenceCard';
import { EvidenceForm } from '../components/EvidenceForm';
import { SkillsByDemandVisualization } from '../components/SkillsByDemandVisualization';
import { exportEvidenceToPDF } from '../utils/pdfExport';
import { exportProfileToJSON } from '../utils/profileExport';
import { aishaPatelProfile, danielLeeProfile, kaiChenProfile, priyaSharmaProfile } from '../data/mockStudent';
// import { extractSkillsFromEvidence } from '../utils/skillExtraction'; // Not currently used
import styles from './ProfileAndEvidence.module.css';

interface Props {
  profile: StudentProfile;
  evidence: Evidence[];
  isDemoMode?: boolean;
  onUpdateProfile?: (updates: Partial<StudentProfile>) => void;
  onAddEvidence: (data: Omit<Evidence, 'id'>) => void;
  onUpdateEvidence: (id: string, data: Omit<Evidence, 'id'>) => void;
  onDeleteEvidence: (id: string) => void;
  onReplaceEvidence: (items: Array<Omit<Evidence, 'id'>>) => void;
  onAnalyze: () => void;
  onClearAndStart?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

type FormMode = 'closed' | 'add' | { editing: Evidence } | { template: Partial<Omit<Evidence, 'id'>> };
type ResumeImportStatus = { type: 'success' | 'error' | 'info'; message: string } | null;
type EvidenceIdentity = Pick<StudentProfile, 'name' | 'major' | 'targetRole'> & Partial<Pick<StudentProfile, 'university' | 'year'>>;

const SAMPLE_PROFILES = [danielLeeProfile, priyaSharmaProfile, kaiChenProfile, aishaPatelProfile];

const KNOWN_RESUME_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Python', 'Django',
  'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD', 'REST API',
  'GraphQL', 'Tailwind', 'Figma', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Kafka', 'Spark', 'Flink', 'ClickHouse',
  'Data Pipeline', 'ETL', 'UI/UX', 'Product Management', 'User Research', 'A/B Testing',
  'PHP', 'C++', 'ESP32', 'Arduino IDE', 'Arduino', 'IoT', 'Blynk', 'MQTT', 'Node-RED',
  'InfluxDB', 'Telegram Bot API', 'Raspberry Pi', 'Rasberry Pi', 'Computer Vision',
  'Cisco Packet Tracer', 'Streamlit',
];

const RESUME_SECTION_TYPES: Record<string, Evidence['type']> = {
  'project experience': 'portfolio',
  experience: 'internship',
  'work experience': 'internship',
  work: 'internship',
  internship: 'internship',
  employment: 'internship',
  'competition experience': 'hackathon',
  projects: 'portfolio',
  project: 'portfolio',
  portfolio: 'portfolio',
  certificates: 'certificate',
  certifications: 'certificate',
  courses: 'certificate',
  capstone: 'fyp',
  hackathon: 'hackathon',
  achievements: 'hackathon',
};

function cleanResumeLine(line: string) {
  return line
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€“|â€”/g, '-')
    .replace(/Â°/g, 'deg')
    .replace(/^[\s\-*•\u2022]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferTargetRole(text: string) {
  const lower = text.toLowerCase();
  const explicit = text.match(/(?:target role|desired role|applying for|seeking|objective)\s*[:\-]\s*([^\n\r]+)/i)?.[1]?.trim();
  if (explicit) return explicit.slice(0, 80);
  if (/data engineer|etl|pipeline|spark|kafka|clickhouse/.test(lower)) return 'Data Engineer';
  if (/product manager|roadmap|stakeholder|user research|a\/b testing/.test(lower)) return 'Product Manager';
  if (/ui\/ux|figma|prototype|wireframe|user journey/.test(lower)) return 'UI/UX Designer';
  if (/frontend|react|next\.js|typescript|tailwind/.test(lower)) return 'Frontend Engineer';
  if (/backend|node\.js|api|spring boot|database/.test(lower)) return 'Backend Engineer';
  if (/software engineer|full stack|full-stack/.test(lower)) return 'Software Engineer';
  return '';
}

function extractResumeSkills(text: string) {
  const lower = text.toLowerCase();
  return KNOWN_RESUME_SKILLS.filter((skill) => {
    const normalizedSkill = skill.toLowerCase();
    if (/^[a-z0-9+#. /-]+$/i.test(skill)) {
      return new RegExp(`(^|[^a-z0-9])${escapeResumeRegExp(normalizedSkill)}([^a-z0-9]|$)`, 'i').test(lower);
    }
    return lower.includes(normalizedSkill);
  });
}

function escapeResumeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function evidenceSignature(items: Evidence[]) {
  return items.map((item) => item.id).sort().join('|');
}

function matchSampleProfileFromEvidence(items: Evidence[]): EvidenceIdentity | undefined {
  if (items.length === 0) return undefined;
  const currentSignature = evidenceSignature(items);
  return SAMPLE_PROFILES.find((sample) => evidenceSignature(sample.evidence) === currentSignature);
}

function inferProfileFallbackFromEvidence(items: Evidence[]): EvidenceIdentity {
  const evidenceText = items
    .map((item) => `${item.title} ${item.description} ${item.technologies ?? ''} ${item.outcome ?? ''}`)
    .join('\n');
  const targetRole = inferTargetRole(evidenceText);
  const skills = extractResumeSkills(evidenceText);
  const major = skills.some((skill) => /figma|ui\/ux|product/i.test(skill))
    ? 'Design / Product'
    : skills.some((skill) => /sql|python|kafka|spark|tableau|power bi/i.test(skill))
      ? 'Data / Computer Science'
      : skills.length > 0
        ? 'Computer Science / Software'
        : '';

  return {
    name: 'Imported Candidate',
    major,
    targetRole,
  };
}

function extractProfileFromResume(text: string): Partial<StudentProfile> {
  const lines = text.split(/\r?\n/).map(cleanResumeLine).filter(Boolean);
  const name = lines.find((line) =>
    line.length >= 2 &&
    line.length <= 60 &&
    !/@|https?:|www\.|linkedin|github|resume|curriculum vitae|phone|email|\d{3,}/i.test(line)
  ) || '';
  const university = lines.find((line) => /university|college|institute|politeknik|monash|nottingham|apu|taylors|taylor's|um|utm|utar|sunway/i.test(line)) || '';
  const major =
    text.match(/(?:major|degree|programme|program)\s*[:\-]\s*([^\n\r]+)/i)?.[1]?.trim() ||
    lines.find((line) => /computer science|software engineering|information systems|data science|business analytics|information technology|cybersecurity/i.test(line)) ||
    '';
  const yearMatch = text.match(/(?:year|yr)\s*([1-5])|final\s*year/i);
  const year = yearMatch?.[1] ? Number(yearMatch[1]) : /final\s*year/i.test(text) ? 4 : undefined;
  const targetRole = inferTargetRole(text);

  return {
    ...(name ? { name } : {}),
    ...(university ? { university } : {}),
    ...(major ? { major: major.slice(0, 90) } : {}),
    ...(year ? { year } : {}),
    ...(targetRole ? { targetRole } : {}),
  };
}

function getResumeSectionMatch(line: string): { section: string; remainder: string } | null {
  const key = line.toLowerCase().replace(/[:\-]/g, '').trim();
  const ignoredHeadings = [
    'summary',
    'profile',
    'self introduction',
    'objective',
    'technical skills',
    'skills',
    'education',
  ];
  const allHeadings = [
    ...ignoredHeadings,
    ...Object.keys(RESUME_SECTION_TYPES).sort((a, b) => b.length - a.length),
  ].sort((a, b) => b.length - a.length);

  const heading = allHeadings.find((section) => key === section || key.startsWith(`${section} `));
  if (!heading) return null;

  const remainder = line
    .replace(new RegExp(`^${escapeResumeRegExp(heading)}\\b\\s*[:\\-]?\\s*`, 'i'), '')
    .trim();

  return { section: heading, remainder };
}

function normalizeResumeTextForParsing(text: string) {
  const sectionHeadings = [
    'SELF-INTRODUCTION',
    'SUMMARY',
    'PROFILE',
    'OBJECTIVE',
    'PROJECTS',
    'PROJECT EXPERIENCE',
    'COMPETITION EXPERIENCE',
    'WORK EXPERIENCE',
    'INTERNSHIP',
    'CERTIFICATES',
    'CERTIFICATIONS',
    'ACHIEVEMENTS',
    'SKILLS',
    'EDUCATION',
  ];

  let normalized = text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+(?=SELF-INTRODUCTION|SUMMARY|PROFILE|OBJECTIVE|PROJECTS|PROJECT EXPERIENCE|COMPETITION EXPERIENCE|WORK EXPERIENCE|INTERNSHIP|CERTIFICATES|CERTIFICATIONS|ACHIEVEMENTS|SKILLS|EDUCATION\b)/gi, '\n')
    .replace(/\s+(?=Technologies Used\s*:|Technologies\s*:|Tech Stack\s*:|Tools\s*:)/gi, '\n')
    .replace(/\s+(?=[•\u2022*]\s+)/g, '\n')
    .replace(/\s+(?=Participant\s*\|)/gi, '\n');

  normalized = normalized.replace(
    /([.!?])\s+([A-Z][A-Za-z0-9&: /()'’.-]{8,140}?)\s+(?=Technologies Used\s*:|Technologies\s*:|Tech Stack\s*:|Tools\s*:)/g,
    '$1\n$2\n'
  );

  for (const heading of sectionHeadings) {
    normalized = normalized.replace(
      new RegExp(`\\b${escapeResumeRegExp(heading)}\\b\\s+([^\\n])`, 'gi'),
      (match, nextChar, offset, source) => {
        const before = source[offset - 1];
        if (before && before !== '\n') return match;
        return `${heading}\n${nextChar}`;
      }
    );
  }

  return normalized
    .split('\n')
    .map(cleanResumeLine)
    .filter(Boolean)
    .join('\n');
}

function extractOutcome(text: string) {
  const metrics = text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})?\+?\s?(?:users|requests|transactions|prs|projects|stakeholders|customers|events|features)|MYR\s?[\d,.]+[Kk]?/gi);
  if (metrics?.length) return `Quantified signals: ${Array.from(new Set(metrics)).slice(0, 4).join(', ')}`;
  const resultLine = text.split(/\r?\n/).map(cleanResumeLine).find((line) => /improved|reduced|increased|shipped|deployed|launched|built|led|finalist|won|promoted/i.test(line));
  return resultLine ? resultLine.slice(0, 120) : undefined;
}

export function parseResumeIntoEvidence(text: string): Omit<Evidence, 'id'>[] {
  const normalizedText = normalizeResumeTextForParsing(text);
  const lines = normalizedText.split(/\r?\n/).map(cleanResumeLine).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let currentSection = 'summary';

  for (const line of lines) {
    const detected = getResumeSectionMatch(line);
    if (detected) {
      currentSection = detected.section;
      sections[currentSection] ??= [];
      if (detected.remainder) sections[currentSection].push(detected.remainder);
      continue;
    }
    sections[currentSection] ??= [];
    sections[currentSection].push(line);
  }

  const resumeSkills = extractResumeSkills(text);
  const evidenceItems = Object.entries(sections)
    .flatMap(([section, sectionLines]) => {
      const type = RESUME_SECTION_TYPES[section];
      if (!type || sectionLines.join(' ').length < 80) return [];

      return splitResumeSectionIntoEntries(sectionLines)
        .map((entry) => {
          const sectionText = entry.descriptionLines.join(' ');
          const combinedText = `${entry.title} ${sectionText} ${entry.technologies}`;
          const sectionSkills = extractResumeSkills(combinedText);
          const technologies = normalizeTechnologyList(entry.technologies || sectionSkills.join(', '));

          return {
            type,
            title: entry.title.replace(/[:|]+$/g, '').slice(0, 120),
            description: sectionText.length >= 50
              ? sectionText.slice(0, 900)
              : `${sectionText || entry.title} This resume block needs more detail, but it gives PathLens a starting point for evidence extraction.`,
            technologies: technologies || undefined,
            outcome: extractOutcome(sectionText || entry.title),
            verified: false,
          };
        });
    })
    .slice(0, 10);

  if (evidenceItems.length > 0) return evidenceItems;

  return [{
    type: 'portfolio',
    title: 'Imported resume summary',
    description: text.slice(0, 700),
    technologies: resumeSkills.slice(0, 10).join(', ') || undefined,
    outcome: extractOutcome(text),
    verified: false,
  }];
}

interface ResumeEntryDraft {
  title: string;
  descriptionLines: string[];
  technologies: string;
}

function splitResumeSectionIntoEntries(lines: string[]): ResumeEntryDraft[] {
  const entries: ResumeEntryDraft[] = [];
  let current: ResumeEntryDraft | null = null;

  const pushCurrent = () => {
    if (!current) return;
    const description = current.descriptionLines.join(' ');
    if (current.title.length >= 4 && (description.length >= 40 || current.technologies)) {
      entries.push(current);
    }
  };

  for (const line of lines) {
    const technologies = extractTechnologiesFromLine(line);
    if (technologies) {
      current ??= { title: 'Imported resume item', descriptionLines: [], technologies: '' };
      current.technologies = normalizeTechnologyList([current.technologies, technologies].filter(Boolean).join(', '));
      continue;
    }

    if (isLikelyResumeItemTitle(line, current)) {
      pushCurrent();
      current = { title: stripResumeDate(line), descriptionLines: [], technologies: '' };
      continue;
    }

    current ??= { title: stripResumeDate(line), descriptionLines: [], technologies: '' };
    if (current.title === line && current.descriptionLines.length === 0) continue;
    if (
      !current.technologies &&
      current.descriptionLines.length === 0 &&
      line.length <= 80 &&
      !/^(?:built|implemented|designed|integrated|developed|configured|programmed|deployed|created|collaborated|pitched|used|wrote|fixed|attended|learned|conducted|reduced|increased|optimized|automated)\b/i.test(line)
    ) {
      current.title = `${current.title} ${stripResumeDate(line)}`.slice(0, 150);
      continue;
    }
    current.descriptionLines.push(line);
  }

  pushCurrent();
  return entries.length > 0 ? entries : [{
    title: lines.find((line) => line.length >= 4 && line.length <= 120) || 'Imported resume item',
    descriptionLines: lines.slice(1),
    technologies: '',
  }];
}

function extractTechnologiesFromLine(line: string) {
  return line.match(/^(?:technologies used|technologies|tech stack|tools|skills)\s*:\s*(.+)$/i)?.[1]?.trim() ?? '';
}

function normalizeTechnologyList(value: string) {
  const seen = new Set<string>();
  return value
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12)
    .join(', ');
}

function isLikelyResumeItemTitle(line: string, current: ResumeEntryDraft | null) {
  if (line.length < 4 || line.length > 150) return false;
  if (/^(?:cgpa|spm|foundation|bachelor|universiti|university|college|programming languages|databases|tools|iot & networking)\b/i.test(line)) return false;
  if (/^(?:built|implemented|designed|integrated|developed|configured|programmed|deployed|created|collaborated|pitched|used|wrote|fixed|attended|learned|conducted|reduced|increased|optimized|automated)\b/i.test(line)) return false;
  if (!current) return true;
  return current.descriptionLines.length > 0 || Boolean(current.technologies);
}

function stripResumeDate(line: string) {
  return line
    .replace(/\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+\d{4}.*$/i, '')
    .replace(/\s+\d{4}\s*-\s*(?:present|\d{4}).*$/i, '')
    .trim();
}

function isSupportedResumeFile(file: File) {
  const lowerName = file.name.toLowerCase();
  return (
    /\.(txt|md|csv|rtf|pdf|docx)$/i.test(lowerName) ||
    file.type.startsWith('text/') ||
    file.type === 'application/pdf' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}

async function extractTextFromResumeFile(file: File): Promise<string> {
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
    return extractPdfText(file);
  }

  if (
    lowerName.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractDocxText(file);
  }

  if (file.type.startsWith('text/') || /\.(txt|md|csv|rtf)$/i.test(lowerName)) {
    return file.text();
  }

  throw new Error('Unsupported resume format.');
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const spans = (content.items as Array<{ str?: unknown; transform?: number[]; width?: number; height?: number }>)
      .map((item) => ({
        text: String(item.str ?? '').trim(),
        x: Number(item.transform?.[4] ?? 0),
        y: Number(item.transform?.[5] ?? 0),
        height: Number(item.height ?? 0),
      }))
      .filter((item) => item.text);

    const lines: Array<{ y: number; height: number; spans: typeof spans }> = [];
    const sortedSpans = [...spans].sort((a, b) => b.y - a.y || a.x - b.x);

    for (const span of sortedSpans) {
      const tolerance = Math.max(2.5, span.height * 0.45);
      const line = lines.find((candidate) => Math.abs(candidate.y - span.y) <= tolerance);

      if (line) {
        line.spans.push(span);
        line.y = (line.y * (line.spans.length - 1) + span.y) / line.spans.length;
        line.height = Math.max(line.height, span.height);
      } else {
        lines.push({ y: span.y, height: span.height, spans: [span] });
      }
    }

    const pageText = lines
      .sort((a, b) => b.y - a.y)
      .map((line) =>
        line.spans
          .sort((a, b) => a.x - b.x)
          .map((span) => span.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter(Boolean)
      .join('\n');

    pages.push(pageText);
  }

  return pages.join('\n');
}

const EVIDENCE_TEMPLATES: Array<{
  emoji: string;
  label: string;
  hint: string;
  data: Partial<Omit<Evidence, 'id'>>;
}> = [
  {
    emoji: '💻',
    label: 'Portfolio Project',
    hint: 'A web, mobile, or software project you built',
    data: {
      type: 'portfolio',
      description: 'I built [project name], a [web/mobile app] that [describe what it does]. I used [technologies] to implement [key feature]. The main challenge was [challenge] and I solved it by [approach]. The project is [deployed/used by X users/open source on GitHub].',
      technologies: 'e.g. React, Node.js, PostgreSQL',
    },
  },
  {
    emoji: '🏢',
    label: 'Internship',
    hint: 'Work experience at a company',
    data: {
      type: 'internship',
      description: 'I interned at [Company] as a [Role] for [duration]. My main task was building/improving [feature or system] using [technologies]. I collaborated with a team of [X] engineers. Key achievement: [measurable impact, e.g. reduced load time by 30%, shipped feature used by 1000 users].',
      technologies: 'e.g. Python, Django, AWS',
    },
  },
  {
    emoji: '🏆',
    label: 'Hackathon',
    hint: 'A competition or time-limited build event',
    data: {
      type: 'hackathon',
      description: 'Competed in [Hackathon Name] over [24/48 hours] with a team of [X]. We built [project name] to solve [problem]. Used [technologies] to implement [core feature]. We [won/placed/were finalists]. My specific contribution: [what you built or led].',
      technologies: 'e.g. Python, Firebase, React',
    },
  },
  {
    emoji: '📜',
    label: 'Certificate / Course',
    hint: 'Online learning or certification',
    data: {
      type: 'certificate',
      description: 'Completed [Course Name] by [Provider, e.g. Coursera, AWS, Google] covering [key topics]. Applied the knowledge by building [project or exercise]. Skills verified: [skills]. Earned [certificate/badge] demonstrating [what the certification proves].',
      technologies: 'e.g. TensorFlow, Python, SQL',
    },
  },
  {
    emoji: '🎓',
    label: 'Final Year Project',
    hint: 'University capstone or research project',
    data: {
      type: 'fyp',
      description: 'Final year project: [project title]. I built [describe the system or research] using [technologies]. The core technical challenge was [challenge] which I addressed by [approach]. Supervised by [Prof/supervisor]. Outcome: [grade/published/deployed/presented at conference].',
      technologies: 'e.g. Python, Machine Learning, PostgreSQL',
    },
  },
];

export function ProfileAndEvidence({
  profile,
  evidence,
  isDemoMode = false,
  onUpdateProfile,
  onAddEvidence,
  onUpdateEvidence,
  onDeleteEvidence,
  onReplaceEvidence,
  onAnalyze,
  onClearAndStart,
  onBack,
  backLabel = 'Back',
}: Props) {
  const [formMode, setFormMode] = useState<FormMode>('closed');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(!isDemoMode && evidence.length === 0);
  const [editForm, setEditForm] = useState(profile);
  const [resumeText, setResumeText] = useState('');
  const [resumeImportStatus, setResumeImportStatus] = useState<ResumeImportStatus>(null);
  const [isImportingResume, setIsImportingResume] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const evidenceIdentity = useMemo(() => {
    return matchSampleProfileFromEvidence(evidence) ?? inferProfileFallbackFromEvidence(evidence);
  }, [evidence]);
  const displayName = profile.name.trim() || evidenceIdentity?.name || 'New Candidate';
  const displayUniversity = profile.university?.trim() || (evidenceIdentity && 'university' in evidenceIdentity ? evidenceIdentity.university : '') || '';
  const displayYear = profile.year || (evidenceIdentity && 'year' in evidenceIdentity ? evidenceIdentity.year : 1);
  const displayMajor = profile.major.trim() || evidenceIdentity?.major || 'Major to confirm';
  const displayTargetRole = profile.targetRole.trim() || evidenceIdentity?.targetRole || 'Target role to confirm';
  const allExtractedSkills = useMemo(() => {
    const skills: ExtractedSkill[] = [];
    evidence.forEach(item => {
      if (item.technologies) {
        item.technologies.split(',').forEach(tech => {
          const trimmed = tech.trim();
          if (trimmed) {
            skills.push({
              skill: trimmed,
              confidence: 'high',
              sourceEvidenceId: item.id,
              sourcePhrase: item.technologies || '',
            });
          }
        });
      }
    });
    return skills;
  }, [evidence]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  useEffect(() => {
    setEditForm(profile);
    if (!isDemoMode && evidence.length === 0) {
      setIsEditingProfile(true);
      setFormMode('closed');
    }
  }, [profile, isDemoMode, evidence.length]);

  useEffect(() => {
    if (!onUpdateProfile || profile.name.trim() || evidence.length === 0) return;

    const sampleProfile = matchSampleProfileFromEvidence(evidence);
    if (sampleProfile) {
      onUpdateProfile({
        name: sampleProfile.name,
        university: sampleProfile.university,
        year: sampleProfile.year,
        major: sampleProfile.major,
        targetRole: sampleProfile.targetRole,
      });
      return;
    }

    const fallback = inferProfileFallbackFromEvidence(evidence);
    onUpdateProfile({
      name: fallback.name,
      major: profile.major || fallback.major || 'Major to confirm',
      targetRole: profile.targetRole || fallback.targetRole || 'Target role to confirm',
      year: profile.year || 1,
    });
  }, [evidence, onUpdateProfile, profile.major, profile.name, profile.targetRole, profile.year]);


  function handleSave(data: Omit<Evidence, 'id'>) {
    if (formMode === 'add' || (typeof formMode === 'object' && 'template' in formMode)) {
      onAddEvidence(data);
      setShowSuccess(true);
    } else if (typeof formMode === 'object' && 'editing' in formMode) {
      onUpdateEvidence(formMode.editing.id, data);
    }
    setFormMode('closed');
  }

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editForm.name,
        year: editForm.year,
        major: editForm.major,
        targetRole: editForm.targetRole,
        university: editForm.university,
      });
    }
    setIsEditingProfile(false);
  };

  const handleExportEvidence = () => {
    exportEvidenceToPDF(displayName, evidence);
  };

  const handleResumeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedResumeFile(file)) {
      setResumeImportStatus({
        type: 'error',
        message: 'Upload a TXT, MD, PDF, or DOCX resume. Legacy .doc files need to be saved as DOCX or PDF first.',
      });
      event.target.value = '';
      return;
    }

    setIsImportingResume(true);
    setResumeImportStatus({
      type: 'info',
      message: `Reading ${file.name}...`,
    });

    try {
      const text = await extractTextFromResumeFile(file);
      if (text.trim().length < 80) {
        setResumeImportStatus({
          type: 'error',
          message: `I could not extract enough text from ${file.name}. Try exporting it as a text-based PDF or paste the resume text directly.`,
        });
        return;
      }

      setResumeText(text);
      setResumeImportStatus({
        type: 'info',
        message: `Loaded ${file.name}. Review the extracted text, then import and scan.`,
      });
    } catch {
      setResumeImportStatus({
        type: 'error',
        message: `Could not read ${file.name}. Try a text-based PDF, DOCX, TXT, or paste the resume text directly.`,
      });
    } finally {
      setIsImportingResume(false);
      event.target.value = '';
    }
  };

  const handleImportResume = (analyzeAfter = false) => {
    const text = resumeText.trim();
    if (text.length < 80) {
      setResumeImportStatus({
        type: 'error',
        message: 'Paste or upload more resume text so PathLens has enough evidence to extract.',
      });
      return;
    }

    const profileUpdates = extractProfileFromResume(text);
    const importedEvidence = parseResumeIntoEvidence(text);

    if (onUpdateProfile && Object.keys(profileUpdates).length > 0) {
      onUpdateProfile(profileUpdates);
    }

    onReplaceEvidence(importedEvidence);
    setResumeText('');
    setIsEditingProfile(false);
    setFormMode('closed');
    setShowSuccess(true);
    setResumeImportStatus({
      type: 'success',
      message: analyzeAfter
        ? `Imported ${importedEvidence.length} evidence block${importedEvidence.length === 1 ? '' : 's'} from your resume. Running Lens Scan...`
        : `Imported ${importedEvidence.length} evidence block${importedEvidence.length === 1 ? '' : 's'} from your resume. Review them below, then run the Lens Scan.`,
    });

    if (analyzeAfter) {
      onAnalyze();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← {backLabel}
          </button>
        )}

        {isDemoMode && (
          <div style={{
            background: 'linear-gradient(135deg, #06111f 0%, #0f172a 55%, #172554 100%)',
            border: '1px solid rgba(34, 211, 238, 0.28)',
            borderRadius: '22px',
            padding: '22px',
            marginBottom: '24px',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '18px',
              flexWrap: 'wrap',
            }}>
              <div style={{ maxWidth: '540px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#67e8f9',
                  marginBottom: '8px',
                }}>
                  Career OS — Evidence Bank
                </div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.04em' }}>
                  {displayName}'s resume is now a Proof Passport.
                </h2>
                <p style={{ margin: '10px 0 0 0', color: 'rgba(255,255,255,0.62)', fontSize: '14px', lineHeight: 1.7 }}>
                  Inspect each proof block, then follow the same flow a student would use: evidence, lens scan, readiness map, blockers, sprint, and university insight.
                </p>
              </div>
              {onClearAndStart && (
                <button
                  onClick={onClearAndStart}
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    padding: '11px 18px',
                    background: 'white',
                    color: '#020617',
                    border: 'none',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Start a blank profile
                </button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
              marginTop: '18px',
            }}>
              {[
                ['1', 'Proof Passport', 'Resume content is split into inspectable evidence blocks.'],
                ['2', 'Lens Scan', 'Tools and capabilities cite the source phrase.'],
                ['3', 'Career Signal Map', 'Scores explain blockers and next actions.'],
              ].map(([num, title, body]) => (
                <div key={num} style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.045)',
                  borderRadius: '14px',
                  padding: '13px',
                }}>
                  <div style={{ color: '#67e8f9', fontSize: '12px', fontWeight: 900 }}>{num}</div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: 800, marginTop: '4px' }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '4px', lineHeight: 1.45 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.profileCard}>
          {isEditingProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Edit Your Profile</h3>
              <div>
                <label htmlFor="profile-name" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label htmlFor="profile-university" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>University</label>
                <input
                  id="profile-university"
                  type="text"
                  value={editForm.university || ''}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  placeholder="e.g., National University of Singapore"
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label htmlFor="profile-year" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Year</label>
                  <input
                    id="profile-year"
                    type="number"
                    min="1"
                    max="5"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="profile-major" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Major</label>
                  <input
                    id="profile-major"
                    type="text"
                    value={editForm.major}
                    onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                    placeholder="e.g., Computer Science"
                    style={{
                      width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profile-role" style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Target Role</label>
                <input
                  id="profile-role"
                  type="text"
                  value={editForm.targetRole}
                  onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  style={{
                    width: '100%', padding: '10px', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    flex: 1, padding: '10px', background: 'var(--color-primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setEditForm(profile);
                  }}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent', color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>{displayName}</h2>
                <button
                  onClick={() => {
                    setEditForm(profile);
                    setIsEditingProfile(true);
                  }}
                  style={{
                    fontSize: '12px', padding: '6px 12px', background: 'transparent',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: '600'
                  }}
                >
                  ✏️ Edit
                </button>
              </div>
              <div className={styles.profileDetails}>
                {displayUniversity && (
                  <div className={styles.detail}>
                    <strong>University:</strong> {displayUniversity}
                  </div>
                )}
                <div className={styles.detail}>
                  <strong>Year:</strong> {displayYear}
                </div>
                <div className={styles.detail}>
                  <strong>Major:</strong> {displayMajor}
                </div>
                <div className={styles.detail}>
                  <strong>Target Role:</strong> {displayTargetRole}
                </div>
                <div className={styles.detail}>
                  <strong>Evidence Items:</strong> {evidence.length}
                </div>
              </div>
              <p className={styles.subtitle}>Your Proof Passport: evidence first, claims second. Keep adding source-backed work as your career changes.</p>
            </>
          )}

          <div className={styles.progressBar}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>
                Evidence collected: <strong>{evidence.length}/5</strong>
              </span>
              <span className={styles.progressHint}>
                {evidence.length === 0 ? 'Add at least 3 proof blocks for the clearest scan' : evidence.length < 3 ? 'Keep adding - 3+ proof blocks recommended' : evidence.length >= 5 ? 'Strong proof passport. Ready to scan.' : 'Good start. You can continue adding more proof.'}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${Math.min((evidence.length / 5) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <section className={styles.resumeImportSection}>
          <div className={styles.resumeImportHeader}>
            <div>
              <span className={styles.resumeImportEyebrow}>Resume Autopilot</span>
              <h3>Upload your resume text and let PathLens build the first draft.</h3>
              <p>
                Paste a resume or upload a PDF, DOCX, TXT, or MD file. PathLens will prefill profile fields,
                detect skills, and convert resume sections into editable evidence blocks.
              </p>
            </div>
            <label className={styles.resumeUploadButton}>
              Upload resume
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv,.rtf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv"
                onChange={handleResumeFile}
              />
            </label>
          </div>

          <textarea
            className={styles.resumeTextarea}
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume here. Include education, projects, internships, technologies, outcomes, links, and target role if you have one."
            disabled={isImportingResume}
            rows={8}
          />

          <div className={styles.resumeImportActions}>
            <button
              type="button"
              className={styles.resumePrimaryButton}
              onClick={() => handleImportResume(true)}
              disabled={resumeText.trim().length < 80 || isImportingResume}
            >
              Import resume and scan
            </button>
            <button
              type="button"
              className={styles.resumeSecondaryButton}
              onClick={() => handleImportResume(false)}
              disabled={resumeText.trim().length < 80 || isImportingResume}
            >
              Import only
            </button>
            <button
              type="button"
              className={styles.resumeSecondaryButton}
              onClick={() => {
                setResumeText('');
                setResumeImportStatus(null);
              }}
              disabled={isImportingResume || (!resumeText && !resumeImportStatus)}
            >
              Clear resume text
            </button>
          </div>

          {resumeImportStatus && (
            <div className={`${styles.resumeStatus} ${styles[resumeImportStatus.type]}`}>
              {resumeImportStatus.message}
            </div>
          )}
        </section>

        <div className={styles.evidenceSection}>
          {showSuccess && (
            <div className={styles.successMessage}>
              ✓ Evidence added! We'll analyze it when you're ready.
            </div>
          )}
          <div className={styles.evidenceHeader}>
            <div>
              <h3>Build Your Proof Passport</h3>
              <p className={styles.evidenceIntro}>
                Add projects, internships, certificates, and outcomes. PathLens scans the evidence for skill signals, missing proof, and readiness blockers before it shows any score.
              </p>
            </div>
          </div>

          {formMode !== 'closed' && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '90%',
                maxWidth: '600px',
                padding: '32px',
              }} ref={formRef}>
                <EvidenceForm
                  initial={typeof formMode === 'object' && 'editing' in formMode ? formMode.editing : undefined}
                  startWith={typeof formMode === 'object' && 'template' in formMode ? formMode.template : undefined}
                  onSave={handleSave}
                  onCancel={() => setFormMode('closed')}
                />
              </div>
            </div>
          )}

          {evidence.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Ready to show what your resume actually proves?</p>
              <p className={styles.emptyHint}>
                Choose a template below. The form asks for source-backed evidence, not polished claims.
              </p>
              <div className={styles.templateGrid}>
                {EVIDENCE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.data.type}
                    className={styles.templateCard}
                    onClick={() => setFormMode({ template: tmpl.data })}
                  >
                    <span className={styles.templateEmoji}>{tmpl.emoji}</span>
                    <span className={styles.templateLabel}>{tmpl.label}</span>
                    <span className={styles.templateHint}>{tmpl.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.evidenceList}>
                {evidence.map(item => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    onEdit={e => setFormMode({ editing: e })}
                    onDelete={onDeleteEvidence}
                  />
                ))}
              </div>

              {/* Skills Grouped by Demand */}
              {allExtractedSkills.length > 0 && (
                  <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    marginTop: '32px',
                    marginBottom: '20px',
                  }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                      Proof Signals Summary by Market Demand
                    </h3>
                    <SkillsByDemandVisualization extractedSkills={allExtractedSkills} />
                  </div>
              )}
            </>
          )}

          <div className={styles.actionButtons}>
            {evidence.length > 0 && formMode === 'closed' && (
              <button
                className={styles.exportButton}
                onClick={() => setFormMode('add')}
              >
                + Add More Evidence
              </button>
            )}
            {evidence.length > 0 && (
              <>
                <button
                  className={styles.exportButton}
                  onClick={handleExportEvidence}
                  title="Export evidence as PDF report"
                >
                  📥 Export Evidence
                </button>
                <button
                  className={styles.exportButton}
                  onClick={() => exportProfileToJSON(profile, evidence)}
                  title="Export profile and evidence as JSON"
                  style={{ fontSize: '13px' }}
                >
                  💾 Export as JSON
                </button>
              </>
            )}
            <button
              className={styles.analyzeButton}
              onClick={onAnalyze}
              disabled={evidence.length === 0}
            >
              Run Lens Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
