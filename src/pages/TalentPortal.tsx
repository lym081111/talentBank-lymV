import { useMemo, useState } from 'react';
import { StudentProfile, Evidence } from '../types/evidence';
import { danielLeeProfile, priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
  onBack: () => void;
}

type CandidatePage = 'snapshot' | 'resume' | 'skills' | 'trajectory' | 'matches';

const DEMO_PERSONAS = [
  {
    profile: danielLeeProfile,
    label: 'Daniel Lee',
    role: 'CS Student → SWE',
    location: 'Universiti Malaya, KL',
    accent: 'from-cyan-300 to-sky-400',
    type: 'student' as const,
    summary:
      'Year 4 CS student with FYP, one internship, and a hackathon finalist result — strong foundation, clear production-practice gap to close before application season.',
  },
  {
    profile: priyaSharmaProfile,
    label: 'Priya Sharma',
    role: 'Platform SWE',
    location: 'Grab, Singapore',
    accent: 'from-cyan-400 to-emerald-300',
    type: 'alumni' as const,
    summary:
      'Backend engineer with repeated proof of production ownership, distributed systems depth, and senior-level platform responsibility.',
  },
  {
    profile: kaiChenProfile,
    label: 'Kai Chen',
    role: 'Data Engineer',
    location: 'ByteDance, Singapore',
    accent: 'from-violet-400 to-cyan-300',
    type: 'alumni' as const,
    summary:
      'Data infrastructure candidate with a clear analyst-to-engineer transition and hard evidence in real-time streaming systems.',
  },
  {
    profile: aishaPatelProfile,
    label: 'Aisha Patel',
    role: 'Product Manager',
    location: 'Lazada, Southeast Asia',
    accent: 'from-amber-300 to-rose-300',
    type: 'alumni' as const,
    summary:
      'Product operator with market-entry evidence, commercial thinking, and cross-functional delivery across India and Southeast Asia.',
  },
];

const PAGE_NAV: { id: CandidatePage; title: string; helper: string }[] = [
  { id: 'snapshot', title: 'Profile', helper: 'what the resume says' },
  { id: 'resume', title: 'Evidence', helper: 'proof, not claims' },
  { id: 'skills', title: 'Skills', helper: 'extracted from work' },
  { id: 'trajectory', title: 'Trajectory', helper: 'career movement' },
  { id: 'matches', title: 'Applications', helper: 'turn evidence into applications' },
];

function splitTechnologies(profile: StudentProfile) {
  const skills = profile.evidence.flatMap(item =>
    (item.technologies ?? '')
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean)
  );

  return Array.from(new Set(skills)).slice(0, 14);
}

function getSalarySignals(profile: StudentProfile) {
  const text = profile.evidence.map(item => item.outcome ?? '').join(' ');
  const matches = text.match(/MYR\s?[\d,.]+[KkLl]?(?:\/month|\/year)?/g);
  return matches ? Array.from(new Set(matches)).slice(0, 4) : [];
}

function getImpactSignals(profile: StudentProfile) {
  const text = profile.evidence.map(item => `${item.description} ${item.outcome ?? ''}`).join(' ');
  const matches = text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})?\+?\s?(?:users|events\/day|requests\/day|transactions|stakeholders|PRs|countries|sellers|GMV|QPS)/gi);
  return matches ? Array.from(new Set(matches)).slice(0, 6) : [];
}

function getEvidenceKind(item: Evidence) {
  if (item.title.toLowerCase().includes('skill') || item.type === 'certificate') return 'Skill proof';
  if (item.title.toLowerCase().includes('senior')) return 'Senior proof';
  if (item.title.toLowerCase().includes('intern')) return 'Early proof';
  return 'Role proof';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, keywords: string[]) {
  const usefulKeywords = keywords.filter(keyword => keyword.length > 1).slice(0, 14);
  const moneyAndMetrics = /MYR\s?[\d,.]+[KkLl]?(?:\/month|\/year)?|\d+(?:\.\d+)?%|\d+(?:,\d{3})?\+?\s?(?:users|events\/day|requests\/day|transactions|stakeholders|PRs|countries|sellers|GMV|QPS)/gi;
  const keywordPattern = usefulKeywords.length ? usefulKeywords.map(escapeRegExp).join('|') : '$^';
  const pattern = new RegExp(`(${keywordPattern}|${moneyAndMetrics.source})`, 'gi');
  return text.split(pattern).filter(Boolean).map((part, index) => {
    const isKeyword = usefulKeywords.some(keyword => keyword.toLowerCase() === part.toLowerCase());
    const isMetric = /^MYR|\d/.test(part);
    if (!isKeyword && !isMetric) return <span key={index}>{part}</span>;
    return (
      <strong
        key={index}
        className={`font-black ${isMetric ? 'text-emerald-200 text-[1.08em]' : 'text-cyan-100 text-[1.05em]'}`}
      >
        {part}
      </strong>
    );
  });
}

function buildApplicationTargets(profile: StudentProfile, skills: string[]) {
  const lowerRole = profile.targetRole.toLowerCase();

  if (lowerRole.includes('data')) {
    return [
      {
        title: 'Senior Data Engineer - Streaming Platform',
        fit: '91%',
        why: 'Kafka, Flink, Spark, ClickHouse, and 500M events/day evidence already sit in the resume.',
        blocker: 'Needs one public architecture write-up to make the system design proof easier for recruiters to verify.',
      },
      {
        title: 'Analytics Platform Lead',
        fit: '84%',
        why: 'The DBS analyst foundation plus ByteDance infrastructure work explains both business metrics and pipeline execution.',
        blocker: 'Leadership proof is present, but team size is still small. Add mentorship outcomes.',
      },
    ];
  }

  if (lowerRole.includes('product')) {
    return [
      {
        title: 'Senior Product Manager - Regional Expansion',
        fit: '88%',
        why: 'Cross-border commerce, seller onboarding, P&L modeling, and multi-country research are directly aligned.',
        blocker: 'Engineering fluency is implied through collaboration. Add more technical decision examples.',
      },
      {
        title: 'Growth PM - Search and Discovery',
        fit: '82%',
        why: 'Search redesign, conversion lift, and category analysis are strong proof for discovery-led growth work.',
        blocker: 'Needs clearer before/after funnel metrics for every launch.',
      },
    ];
  }

  return [
    {
      title: 'Senior Backend Engineer - Transaction Systems',
      fit: '93%',
      why: `The resume shows ${skills.slice(0, 4).join(', ')} plus ownership of high-scale matching and payment systems.`,
      blocker: 'Strong private-company evidence. Add one sanitized public design case study for external trust.',
    },
    {
      title: 'Platform Engineer - Reliability and Distributed Systems',
      fit: '86%',
      why: '99.99% reliability work, microservices ownership, and distributed systems training support the match.',
      blocker: 'ML exposure exists, but the resume should separate production ML work from backend platform work.',
    },
  ];
}

function CandidateSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (profile: StudentProfile) => void;
}) {
  const renderCard = (candidate: typeof DEMO_PERSONAS[0]) => {
    const active = candidate.profile.id === selectedId;
    return (
      <button
        key={candidate.profile.id}
        onClick={() => onSelect(candidate.profile)}
        className={`relative overflow-hidden text-left rounded-3xl border p-5 min-h-[218px] transition-all duration-300 hover:-translate-y-1 ${
          active
            ? 'border-cyan-300/70 bg-cyan-300/12 shadow-[0_0_34px_rgba(34,211,238,0.22)] animate-[activeProfile_1.8s_ease-in-out_infinite]'
            : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
        }`}
      >
        <div className={`h-1.5 rounded-full bg-gradient-to-r ${candidate.accent} mb-4`} />
        <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
          {active && (
            <div className="rounded-full border border-cyan-200/35 bg-cyan-200/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
              Viewing
            </div>
          )}
          <div className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] ${
            candidate.type === 'student'
              ? 'border-sky-300/40 bg-sky-300/10 text-sky-200'
              : 'border-white/15 bg-white/[0.04] text-white/35'
          }`}>
            {candidate.type === 'student' ? 'Student' : 'Alumni'}
          </div>
        </div>
        <div className="text-white font-black text-2xl leading-tight pr-20">{candidate.label}</div>
        <div className="text-white/45 text-xs mt-1">{candidate.role}</div>
        <div className="text-white/30 text-xs mt-1">{candidate.location}</div>
        <p className="text-white/45 text-xs leading-relaxed mt-4">{candidate.summary}</p>
      </button>
    );
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-4">
      <div className="flex flex-col gap-1 px-1 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300/70">
            Choose a profile
          </div>
          <p className="mt-1 text-sm text-white/40">
            Daniel shows the student readiness case. Alumni profiles show where stronger evidence can lead.
          </p>
        </div>
        <div className="text-xs font-bold text-white/25">Click a card to switch the workspace</div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DEMO_PERSONAS.map(renderCard)}
      </div>
    </div>
  );
}

function CurrentProfileBanner({
  profile,
  page,
}: {
  profile: StudentProfile;
  page: CandidatePage;
}) {
  const pageTitle = PAGE_NAV.find(item => item.id === page)?.title ?? 'Profile';
  return (
    <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between shadow-[0_0_28px_rgba(34,211,238,0.09)]">
      <div>
        <div className="text-cyan-100 text-xs font-black uppercase tracking-[0.2em]">Currently viewing</div>
        <div className="text-white font-black text-3xl mt-1">{profile.name}</div>
        <div className="text-white/45 text-sm mt-1">
          {pageTitle} page · {profile.targetRole} · {profile.evidence.length} evidence blocks
        </div>
      </div>
    </div>
  );
}

function CandidateDemoShortcut({ profile, onViewDemo }: { profile: StudentProfile; onViewDemo: () => void }) {
  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center">
        <div>
          <div className="text-xs text-cyan-200 font-black uppercase tracking-[0.22em]">What the full OS demo shows</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-2">
            Analyze {profile.name}'s evidence into a 6-dimension readiness profile, priority gaps, and a 30-day action sprint.
          </h2>
          <p className="text-white/45 text-sm mt-3 max-w-3xl">
            Opens the full Career OS demo for this candidate — evidence → skill extraction → readiness score → blocker → sprint → application pack.
          </p>
        </div>
        <button
          onClick={onViewDemo}
          className="rounded-2xl bg-cyan-300 px-7 py-5 text-sm font-black text-slate-950 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(34,211,238,0.2)]"
        >
          Open full OS demo for {profile.name}
        </button>
      </div>
    </section>
  );
}

function PageTabs({
  page,
  onChange,
}: {
  page: CandidatePage;
  onChange: (page: CandidatePage) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
      {PAGE_NAV.map(item => {
        const active = item.id === page;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`rounded-xl px-3 py-3 text-left transition-all duration-300 ${
              active
                ? 'bg-white text-slate-950 shadow-lg'
                : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="text-sm font-black">{item.title}</div>
            <div className={`text-[11px] mt-0.5 ${active ? 'text-slate-500' : 'text-white/25'}`}>{item.helper}</div>
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="text-white/35 text-xs uppercase tracking-[0.18em] font-black">{label}</div>
      <div className="text-3xl font-black text-white mt-3">{value}</div>
      <div className="text-white/45 text-sm mt-2 leading-relaxed">{note}</div>
    </div>
  );
}

function EvidenceCard({ item, index }: { item: Evidence; index: number }) {
  const keywords = (item.technologies ?? '')
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean);
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_22px_rgba(34,211,238,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.18em]">
            {String(index + 1).padStart(2, '0')} / {getEvidenceKind(item)}
          </div>
          <h3 className="text-white font-black text-lg mt-2">{item.title}</h3>
        </div>
        {item.verified && (
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200">
            verified
          </span>
        )}
      </div>
      <p className="text-white/55 text-sm leading-relaxed mt-4">{highlightText(item.description, keywords)}</p>
      {item.technologies && (
        <div className="flex flex-wrap gap-2 mt-4">
          {keywords.map(skill => (
            <span key={skill} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">
              {skill}
            </span>
          ))}
        </div>
      )}
      {item.outcome && (
        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
          {highlightText(item.outcome, keywords)}
        </div>
      )}
    </article>
  );
}

function SnapshotPage({
  profile,
  skills,
  salarySignals,
  impactSignals,
}: {
  profile: StudentProfile;
  skills: string[];
  salarySignals: string[];
  impactSignals: string[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-[fadeIn_0.25s_ease-out]">
      <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.22em]">Resume interpretation</div>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
          {profile.name} is not a template profile. The evidence tells a specific story.
        </h2>
        <p className="text-white/55 text-base leading-relaxed mt-5">
          {DEMO_PERSONAS.find(item => item.profile.id === profile.id)?.summary}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-7">
          <MetricCard label="Evidence" value={String(profile.evidence.length)} note="resume items parsed into proof blocks" />
          <MetricCard label="Skills" value={String(skills.length)} note="unique tools and capabilities extracted" />
          <MetricCard label="Target" value={profile.targetRole} note="current role direction from the resume" />
        </div>
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Candidate record</div>
        <div className="mt-5 space-y-4">
          <div>
            <div className="text-white/35 text-xs">Education</div>
            <div className="text-white font-bold mt-1">{profile.university ?? 'Not provided'}</div>
          </div>
          <div>
            <div className="text-white/35 text-xs">Major</div>
            <div className="text-white font-bold mt-1">{profile.major}</div>
          </div>
          <div>
            <div className="text-white/35 text-xs">Salary signals</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(salarySignals.length ? salarySignals : ['No explicit salary evidence']).map(signal => (
                <span key={signal} className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white/35 text-xs">Hard impact signals</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(impactSignals.length ? impactSignals : ['Impact not quantified yet']).map(signal => (
                <span key={signal} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ResumePage({ profile }: { profile: StudentProfile }) {
  return (
    <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.22em]">Resume evidence pages</div>
        <h2 className="text-3xl font-black text-white mt-3">Every page is built from what the candidate actually wrote.</h2>
        <p className="text-white/50 mt-3 max-w-3xl">
          This is where the Career OS should start: parse each role, project, certification, and outcome, then turn it into a readable candidate story.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {profile.evidence.map((item, index) => (
          <EvidenceCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function SkillsPage({ skills, profile }: { skills: string[]; profile: StudentProfile }) {
  const primary = skills.slice(0, 6);
  const secondary = skills.slice(6);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
        <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.22em]">Skill extraction</div>
        <h2 className="text-3xl font-black text-white mt-3">Skills are pulled from evidence, not typed into a checklist.</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {primary.map(skill => (
            <div key={skill} className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-white font-black">{skill}</div>
              <div className="text-cyan-100/55 text-xs mt-2">Appears in resume evidence</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-7">
        <div className="text-white/35 text-xs font-black uppercase tracking-[0.18em]">Skill coverage</div>
        <div className="mt-5 space-y-3">
          {profile.evidence.map(item => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-white font-bold text-sm">{item.title}</div>
              <div className="text-white/35 text-xs mt-2">{item.technologies || 'No stack listed. Candidate should add tools used.'}</div>
            </div>
          ))}
        </div>
        {secondary.length > 0 && (
          <div className="mt-5">
            <div className="text-white/35 text-xs mb-2">More extracted skills</div>
            <div className="flex flex-wrap gap-2">
              {secondary.map(skill => (
                <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrajectoryPage({ profile, salarySignals }: { profile: StudentProfile; salarySignals: string[] }) {
  const latestFirst = [...profile.evidence].reverse();
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 animate-[fadeIn_0.25s_ease-out]">
      <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.22em]">Career movement</div>
      <h2 className="text-3xl font-black text-white mt-3">The resume becomes a career timeline, not a wall of text.</h2>
      <div className="mt-8 relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-5">
          {latestFirst.map((item, index) => (
            <div key={item.id} className="relative pl-12">
              <div className="absolute left-0 top-1 h-8 w-8 rounded-full border border-cyan-300/40 bg-cyan-300/10 flex items-center justify-center text-xs font-black text-cyan-100">
                {index + 1}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-white font-black">{item.title}</div>
                  {index === 0 && (
                    <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-950">
                      Latest
                    </span>
                  )}
                </div>
                {item.duration && <div className="text-white/35 text-xs mt-1">{item.duration}</div>}
                <div className="text-white/55 text-sm leading-relaxed mt-3">{item.outcome ?? item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
          <div className="text-emerald-100 font-black">Compensation movement detected</div>
        <p className="text-emerald-100/65 text-sm mt-2">
          {salarySignals.length
            ? [...salarySignals].reverse().join(' <- ')
            : 'No explicit salary movement detected. Add salary range or level changes to surface compensation signals.'}
        </p>
      </div>
    </div>
  );
}

function ApplicationsPage({ profile, skills }: { profile: StudentProfile; skills: string[] }) {
  const targets = buildApplicationTargets(profile, skills);
  return (
    <div className="space-y-4 animate-[fadeIn_0.25s_ease-out]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="text-cyan-200 text-xs font-black uppercase tracking-[0.22em]">Application targets</div>
        <h2 className="text-3xl font-black text-white mt-3">Turn evidence into application stories.</h2>
        <p className="text-white/50 mt-3 max-w-3xl">
          These are mock application targets generated from the resume evidence. They show what the candidate can credibly claim and what to improve before applying.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {targets.map(target => (
          <div key={target.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/35">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white font-black text-xl">{target.title}</div>
                <div className="text-white/35 text-sm mt-1">Target role: {profile.targetRole}</div>
              </div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-emerald-100 font-black">
                {target.fit}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="text-cyan-100 font-black text-sm">Application story</div>
                <p className="text-cyan-100/65 text-sm mt-2">{target.why}</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <div className="text-amber-100 font-black text-sm">What to improve before applying</div>
                <p className="text-amber-100/70 text-sm mt-2">{target.blocker}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TalentPortal({ onViewDemo, onBuildOwn, onBack }: Props) {
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile>(danielLeeProfile);
  const [page, setPage] = useState<CandidatePage>('snapshot');

  const skills = useMemo(() => splitTechnologies(selectedProfile), [selectedProfile]);
  const salarySignals = useMemo(() => getSalarySignals(selectedProfile), [selectedProfile]);
  const impactSignals = useMemo(() => getImpactSignals(selectedProfile), [selectedProfile]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b13] text-white">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes activeProfile {
            0%, 100% { box-shadow: 0 0 34px rgba(34,211,238,0.18); }
            50% { box-shadow: 0 0 46px rgba(34,211,238,0.34); }
          }
        `}
      </style>

      <div className="border-b border-white/10 bg-[#050810]/95">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center gap-5">
          <button
            onClick={onBack}
            className="text-white/45 hover:text-white text-sm font-bold transition-colors"
          >
            Back to home
          </button>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="text-xs text-cyan-300 font-black uppercase tracking-[0.22em]">Career OS — Talent View</div>
            <div className="text-white font-black text-sm">Evidence-driven readiness profile</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onBuildOwn}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-black text-white/70 transition-all hover:border-cyan-300/50 hover:text-white hover:bg-white/[0.05]"
            >
              Build my own profile
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="space-y-8">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-xs font-black text-sky-100 uppercase tracking-[0.18em]">
              Universities Module 03 — student readiness + alumni trajectory
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[0.95] mt-5">
              From student evidence to career proof.
            </h1>
            <p className="text-white/55 text-lg leading-relaxed mt-5 max-w-2xl">
              Start with Daniel — a Year 4 student whose profile shows the typical readiness gap universities need to close. Then explore the alumni track to see where graduates land when they do.
            </p>
          </div>
          <CandidateSelector selectedId={selectedProfile.id} onSelect={profile => {
            setSelectedProfile(profile);
            setPage('snapshot');
          }} />
        </section>

        <CurrentProfileBanner
          profile={selectedProfile}
          page={page}
        />

        <section className="mt-8">
          <PageTabs page={page} onChange={setPage} />
        </section>

        <CandidateDemoShortcut profile={selectedProfile} onViewDemo={() => onViewDemo(selectedProfile)} />

        <section className="mt-8">
          {page === 'snapshot' && (
            <SnapshotPage
              profile={selectedProfile}
              skills={skills}
              salarySignals={salarySignals}
              impactSignals={impactSignals}
            />
          )}
          {page === 'resume' && <ResumePage profile={selectedProfile} />}
          {page === 'skills' && <SkillsPage profile={selectedProfile} skills={skills} />}
          {page === 'trajectory' && <TrajectoryPage profile={selectedProfile} salarySignals={salarySignals} />}
          {page === 'matches' && <ApplicationsPage profile={selectedProfile} skills={skills} />}
        </section>
      </main>
    </div>
  );
}
