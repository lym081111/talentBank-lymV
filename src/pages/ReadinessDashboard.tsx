import { useMemo, useState, useEffect } from 'react';
import { ReadinessProfile, Evidence, StudentProfile } from '../types/evidence';
import { DimensionScoreGauge } from '../components/DimensionScoreGauge';
import { SkillProgressionRoad } from '../components/SkillProgressionRoad';
import { AICareerInsight } from '../components/AICareerInsight';
import { RadarChart } from '../components/RadarChart';
import { ATSScoreCard } from '../components/ATSScoreCard';
import { PortfolioQualityCard } from '../components/PortfolioQualityCard';
// pdfExport (~940 KB) is loaded on demand — only when the user clicks Export PDF
type ExportFn = typeof import('../utils/pdfExport').exportProfileToPDF;
import { analyzePortfolioQuality } from '../utils/portfolioQuality';
import { getJobRecommendations, getSkillRecommendations, getInterviewFocusAreas } from '../utils/aiRecommendations';
import { skillTaxonomy } from '../data/skillTaxonomy';
import { getRelevantStory } from '../data/careerSuccessStories';
import styles from './ReadinessDashboard.module.css';

function PortfolioQualitySection({ evidence }: { evidence: Evidence[] }) {
  const portfolioScores = useMemo(() => analyzePortfolioQuality(evidence), [evidence]);
  const averageScore = useMemo(
    () => Math.round(portfolioScores.reduce((sum, score) => sum + score.overallScore, 0) / portfolioScores.length),
    [portfolioScores]
  );

  if (portfolioScores.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
        💼 Your Portfolio Quality: <span style={{ color: 'var(--color-primary)', fontSize: '24px' }}>{averageScore}/100</span>
      </h3>
      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Each project scored on: <strong>Documentation</strong> (how well you explain), <strong>Complexity</strong> (technical depth), <strong>Impact</strong> (real users), and <strong>Deployment</strong> (production readiness).
      </p>
      <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
        Portfolio quality at 75+ helps you compete for internships with 3-5x salary premium. Below 50? Focus on one project with real users and clean deployment.
      </p>
      <div style={{ display: 'grid', gap: '16px' }}>
        {portfolioScores.map(score => (
          <PortfolioQualityCard key={score.itemId} quality={score} />
        ))}
      </div>
    </div>
  );
}

function CareerGuidanceSection({ profile }: { profile: ReadinessProfile }) {
  const jobRecs = useMemo(() => getJobRecommendations(profile), [profile]);
  const skillRecs = useMemo(() => getSkillRecommendations(profile), [profile]);
  const interviewAreas = useMemo(() => getInterviewFocusAreas(profile), [profile]);

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '900', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
        🧭 Your Career Path Forward
      </h3>
      <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: '1.7', fontWeight: '500' }}>
        Personalized career roadmap based on <strong style={{ color: 'var(--color-accent)' }}>10,000+ real career progressions</strong>. See which roles fit your score, which high-ROI skills to develop next, and how to ace interviews.
      </p>

      {jobRecs.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💼 Role Matches
          </h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            {jobRecs.map((job, idx) => (
              <div key={idx} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text)' }}>{job.title}</strong>
                  <span style={{
                    fontSize: '12px', fontWeight: '800',
                    background: 'var(--color-success-light)', color: 'var(--color-success)',
                    padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.03em'
                  }}>{Math.round(job.matchPercentage)}% match</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{job.description}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                  ✓ <strong>Why you qualify:</strong> {job.whyYouQualify}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillRecs.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <SkillProgressionRoad
            skills={skillRecs.map(skill => ({
              skill: skill.skill,
              priority: skill.priority as 'high' | 'medium' | 'low',
              weeksToLearn: skill.estimatedWeeksToLearn,
              salaryImpact: `+${skill.impactOnScore} points`,
              resources: [
                'Build real projects',
                'Practice with code challenges',
                'Learn from industry leaders',
                'GitHub repositories with examples'
              ]
            }))}
          />
        </div>
      )}

      {interviewAreas.length > 0 && (
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🎤 Interview Success Plan
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', fontStyle: 'italic' }}>
            Practice scenarios and key talking points for your weak dimensions. Be ready to discuss specific projects.
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {interviewAreas.slice(0, 2).map((area, idx) => (
              <div key={idx} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text)' }}>{area.dimension}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {area.currentScore} → <strong style={{ color: 'var(--color-accent)', fontSize: '12px' }}>{area.targetScore}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '10px', fontWeight: '500', background: 'var(--color-primary-light)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                  💡 {area.practiceScenario}
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {area.topTips.slice(0, 2).map((tip, tidx) => (
                    <li key={tidx} style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '5px', lineHeight: '1.5', fontWeight: '500' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type OSModuleId = 'navigator' | 'portfolio' | 'coach' | 'pay' | 'life';

const OS_MODULES: Array<{ id: OSModuleId; label: string; helper: string }> = [
  { id: 'navigator', label: 'Path Navigator', helper: 'career routes' },
  { id: 'portfolio', label: 'Living Portfolio', helper: 'resume proof' },
  { id: 'coach', label: 'AI Coach', helper: 'next move' },
  { id: 'pay', label: 'Fair Pay Engine', helper: 'MYR signal' },
  { id: 'life', label: 'Life Designer', helper: 'career timing' },
];

function getUniqueSkills(profile: ReadinessProfile) {
  return [...new Map(profile.allExtractedSkills.map(skill => [skill.skill, skill])).values()];
}

function getRoleTrack(targetRole: string) {
  const role = targetRole.toLowerCase();
  if (role.includes('data')) {
    return {
      current: 'Data platform track',
      stretch: 'AI infrastructure track',
      currentPay: 'MYR 9,000-14,000/mo',
      stretchPay: 'MYR 16,000-24,000/mo',
      pivotSkill: 'production ML pipelines',
    };
  }
  if (role.includes('product')) {
    return {
      current: 'Marketplace product track',
      stretch: 'Regional growth lead track',
      currentPay: 'MYR 10,000-16,000/mo',
      stretchPay: 'MYR 18,000-28,000/mo',
      pivotSkill: 'pricing, funnel analysis, and technical discovery',
    };
  }
  if (role.includes('design') || role.includes('ux')) {
    return {
      current: 'Product design track',
      stretch: 'AI product experience track',
      currentPay: 'MYR 7,000-12,000/mo',
      stretchPay: 'MYR 14,000-22,000/mo',
      pivotSkill: 'research-backed prototyping with AI workflows',
    };
  }
  return {
    current: 'Software engineering track',
    stretch: 'Platform / AI systems track',
    currentPay: 'MYR 8,000-14,000/mo',
    stretchPay: 'MYR 16,000-26,000/mo',
    pivotSkill: 'system design, cloud reliability, and LLM integration',
  };
}

function getPaySignal(overall: number, targetRole: string) {
  const role = targetRole.toLowerCase();
  const base = role.includes('product') ? 7200 : role.includes('data') ? 7800 : role.includes('design') || role.includes('ux') ? 6200 : 7600;
  const yourBase = Math.round((base + overall * 78) / 100) * 100;
  const market75 = Math.round((base + 3300 + overall * 92) / 100) * 100;
  return {
    yourBase,
    market75,
    gap: Math.max(0, market75 - yourBase),
  };
}

function DynamicOSModules({
  profile,
  studentProfile,
  evidence,
  onViewGaps,
  onBackToProfile,
  onViewTrajectory,
}: {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  evidence: Evidence[];
  onViewGaps: () => void;
  onBackToProfile: () => void;
  onViewTrajectory?: () => void;
}) {
  const [activeModule, setActiveModule] = useState<OSModuleId>('navigator');
  const uniqueSkills = useMemo(() => getUniqueSkills(profile), [profile]);
  const weakDimension = useMemo(
    () => [...profile.dimensions].sort((a, b) => a.score - b.score)[0],
    [profile.dimensions]
  );
  const strongDimension = useMemo(
    () => [...profile.dimensions].sort((a, b) => b.score - a.score)[0],
    [profile.dimensions]
  );
  const roleTrack = useMemo(() => getRoleTrack(studentProfile.targetRole), [studentProfile.targetRole]);
  const paySignal = useMemo(() => getPaySignal(profile.overall, studentProfile.targetRole), [profile.overall, studentProfile.targetRole]);
  const verifiedCount = evidence.filter(item => item.verified).length;
  const linkedCount = evidence.filter(item => Boolean(item.link)).length;
  const evidenceBlocks = evidence;
  const topSkills = uniqueSkills.slice(0, 6).map(skill => skill.skill);

  const moduleSummary: Record<OSModuleId, {
    headline: string;
    body: string;
    metrics: Array<{ label: string; value: string; note: string }>;
    action: string;
    onAction?: () => void;
    blocks: Array<{ title: string; body: string; tone: 'good' | 'warn' | 'info' }>;
  }> = {
    navigator: {
      headline: `${studentProfile.name || 'This candidate'} has a ${studentProfile.targetRole || 'target role'} profile, but the route depends on proof depth.`,
      body: `${strongDimension?.dimension ?? 'Strongest evidence'} is currently the strongest signal. ${weakDimension?.dimension ?? 'one readiness area'} is the first place the route can break.`,
      metrics: [
        { label: 'Current route', value: roleTrack.current, note: roleTrack.currentPay },
        { label: 'Stretch route', value: roleTrack.stretch, note: roleTrack.stretchPay },
        { label: 'Route blocker', value: `${weakDimension?.score ?? 0}/100`, note: weakDimension?.dimension ?? 'Missing readiness evidence' },
      ],
      action: 'Simulate trajectory',
      onAction: onViewTrajectory,
      blocks: [
        {
          title: 'Route A: stay close to current proof',
          body: `Use ${topSkills.slice(0, 3).join(', ') || 'current project evidence'} to pursue ${roleTrack.current}. Lower risk, but slower salary expansion if the weak dimension stays unresolved.`,
          tone: 'good',
        },
        {
          title: 'Route B: stretch into higher-liquidity work',
          body: `Add ${roleTrack.pivotSkill}. This is the path to ${roleTrack.stretch}, but only after the profile shows one project or role with measurable ownership.`,
          tone: 'info',
        },
      ],
    },
    portfolio: {
      headline: `${studentProfile.name || 'The candidate'} has ${evidence.length} evidence blocks. The portfolio is only as strong as what can be verified.`,
      body: `The system reads resume content, links, outcomes, and technologies. It does not reward generic claims without source evidence.`,
      metrics: [
        { label: 'Evidence blocks', value: String(evidence.length), note: `${verifiedCount} verified` },
        { label: 'Linked proof', value: String(linkedCount), note: `${Math.max(0, evidence.length - linkedCount)} items need a URL or artifact` },
        { label: 'Skills detected', value: String(uniqueSkills.length), note: topSkills.slice(0, 3).join(', ') || 'No skills yet' },
      ],
      action: 'Update evidence',
      onAction: onBackToProfile,
      blocks: evidenceBlocks.map((item, index) => ({
        title: `${String(index + 1).padStart(2, '0')} ${item.title}`,
        body: `${item.technologies || 'No stack listed'} · ${item.outcome || item.description}`,
        tone: item.link || item.verified ? 'good' : 'warn',
      })),
    },
    coach: {
      headline: `The next coaching move is not motivational. It is to fix ${weakDimension?.dimension ?? 'the weakest signal'}.`,
      body: weakDimension?.explanation ?? 'Add clearer evidence before asking the system for high-confidence coaching.',
      metrics: [
        { label: 'Weakest signal', value: weakDimension?.dimension ?? 'Unknown', note: `${weakDimension?.score ?? 0}/100` },
        { label: 'Strongest signal', value: strongDimension?.dimension ?? 'Unknown', note: `${strongDimension?.score ?? 0}/100` },
        { label: 'Coach confidence', value: profile.overall >= 70 ? 'High' : profile.overall >= 50 ? 'Medium' : 'Low', note: `${evidence.length} evidence inputs used` },
      ],
      action: 'View paths forward',
      onAction: onViewGaps,
      blocks: [
        {
          title: 'What AI uses',
          body: `Profile target, ${evidence.length} evidence items, ${uniqueSkills.length} extracted skills, and readiness scores. No hidden personality score.`,
          tone: 'info',
        },
        {
          title: 'What AI should say next',
          body: `Create one new proof item that raises ${weakDimension?.dimension ?? 'the weakest dimension'} above 75. The explanation must cite the exact evidence it used.`,
          tone: 'warn',
        },
      ],
    },
    pay: {
      headline: `The pay view is inferred from readiness, target role, and proof strength. It changes when the evidence changes.`,
      body: `${studentProfile.targetRole || 'Target role'} profiles with stronger proof can defend higher MYR bands because the negotiation has evidence attached.`,
      metrics: [
        { label: 'Profile base', value: `MYR ${paySignal.yourBase.toLocaleString()}`, note: 'inferred current defendable base' },
        { label: 'Market 75th', value: `MYR ${paySignal.market75.toLocaleString()}`, note: 'target band after proof gap closes' },
        { label: 'Gap', value: `MYR ${paySignal.gap.toLocaleString()}`, note: 'not a promise, a negotiation signal' },
      ],
      action: 'Fix pay blockers',
      onAction: onViewGaps,
      blocks: [
        {
          title: 'Negotiation proof',
          body: evidenceBlocks[0]?.outcome || evidenceBlocks[0]?.description || 'Add one quantified project outcome before using this in a salary conversation.',
          tone: evidenceBlocks[0]?.outcome ? 'good' : 'warn',
        },
        {
          title: 'What blocks the higher band',
          body: `${weakDimension?.dimension ?? 'Weak evidence'} is still under market-ready level. Close it before claiming the 75th percentile band.`,
          tone: 'warn',
        },
      ],
    },
    life: {
      headline: `Career planning should allow breaks, pivots, and skill sprints without treating them as failure.`,
      body: `For ${studentProfile.name || 'this profile'}, the highest-leverage break is a focused sprint on ${roleTrack.pivotSkill}.`,
      metrics: [
        { label: 'Sprint length', value: '3 months', note: 'bootcamp, project sprint, or structured portfolio rebuild' },
        { label: 'Short-term cost', value: 'MYR 12K-18K', note: 'estimated opportunity cost' },
        { label: 'Long-term upside', value: '+35-60%', note: 'if new evidence raises weak dimensions above 75' },
      ],
      action: 'Simulate life route',
      onAction: onViewTrajectory,
      blocks: [
        {
          title: 'Recommended sprint',
          body: `Build one artifact that proves ${roleTrack.pivotSkill} and explicitly improves ${weakDimension?.dimension ?? 'the weakest readiness area'}.`,
          tone: 'info',
        },
        {
          title: 'Resume narrative',
          body: `The break becomes defensible when it produces evidence: shipped demo, write-up, benchmark, user result, or verified certificate.`,
          tone: 'good',
        },
      ],
    },
  };

  const active = moduleSummary[activeModule];

  return (
    <section className={styles.osWorkspace}>
      <div className={styles.osWorkspaceHeader}>
        <div>
          <p className={styles.osEyebrow}>Full OS demo · dynamic modules</p>
          <h3>Five modules, generated from this candidate's evidence.</h3>
          <p>
            Click a module. The workspace changes based on the profile name, target role, evidence, extracted skills, readiness scores, and gaps.
          </p>
        </div>
        <div className={styles.osScorePill}>
          <span>{profile.overall}</span>
          <small>readiness</small>
        </div>
      </div>

      <div className={styles.osModuleShell}>
        <div className={styles.osModuleNav} aria-label="Career OS modules">
          {OS_MODULES.map(module => (
            <button
              key={module.id}
              type="button"
              onClick={() => setActiveModule(module.id)}
              className={activeModule === module.id ? styles.osModuleActive : ''}
            >
              <strong>{module.label}</strong>
              <span>{module.helper}</span>
            </button>
          ))}
        </div>

        <div className={styles.osModuleCanvas}>
          <p className={styles.osCanvasLabel}>{OS_MODULES.find(module => module.id === activeModule)?.label}</p>
          <h4>{active.headline}</h4>
          <p>{active.body}</p>

          <div className={styles.osMetricGrid}>
            {active.metrics.map(metric => (
              <div key={metric.label} className={styles.osMetric}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.note}</small>
              </div>
            ))}
          </div>

          <div className={styles.osInsightGrid}>
            {active.blocks.map(block => (
              <div key={block.title} className={`${styles.osInsightCard} ${styles[block.tone]}`}>
                <strong>{block.title}</strong>
                <p>{block.body}</p>
              </div>
            ))}
          </div>

          {active.onAction && (
            <button type="button" className={styles.osActionButton} onClick={active.onAction}>
              {active.action}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

interface Props {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  studentName: string;
  hasEvidence: boolean;
  evidence: Evidence[];
  onViewGaps: () => void;
  onBackToProfile: () => void;
  onViewTrajectory?: () => void;
}

export function ReadinessDashboard({ profile, studentProfile, studentName, hasEvidence, evidence, onViewGaps, onBackToProfile, onViewTrajectory }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [scoreDone, setScoreDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayScore(0);
    setScoreDone(false);
    const target = profile.overall;
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(target);
        setScoreDone(true);
      }
    }

    requestAnimationFrame(animate);
  }, [profile.overall]);

  if (!hasEvidence) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'linear-gradient(135deg, var(--color-warning-light) 0%, var(--color-primary-light) 100%)',
            borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warning)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>No Evidence Yet</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              You need to add evidence items before we can calculate your readiness profile.
            </p>
            <button onClick={onBackToProfile} style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
              color: 'white', border: 'none', borderRadius: 'var(--radius-lg)',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}>
              ← Back to Add Evidence
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    // Dynamically import the heavy pdfExport module (~940 KB) only when user triggers the export
    const { exportProfileToPDF } = await import('../utils/pdfExport') as { exportProfileToPDF: ExportFn };
    exportProfileToPDF(profile, studentName, new Date().toISOString());
  };

  const handleCopyProfile = async () => {
    const summary = `${studentName} — Career Readiness Profile
Overall: ${profile.overall}/100 (${profile.level})

${profile.interpretation}

Dimension Scores:
${profile.dimensions.map(d => `  ${d.dimension}: ${d.score}/100 (${d.status})`).join('\n')}

Target: Score 75+ in each dimension for strong internship competitiveness.
Generated by PathLens · https://path-lens-wine.vercel.app`.trim();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open mailto
      const mailtoLink = `mailto:?subject=${encodeURIComponent(studentName + "'s PathLens Profile")}&body=${encodeURIComponent(summary)}`;
      window.location.href = mailtoLink;
    }
  };

  const handleShareWithCareerServices = () => {
    const subject = `${studentName}'s PathLens Career Readiness Profile`;
    const profileSummary = `${studentName}'s Career Landscape Summary
Overall Score: ${profile.overall}/100 (${profile.level})

${profile.interpretation}

Dimension Breakdown:
${profile.dimensions.map(d => `- ${d.dimension}: ${d.score}/100 (${d.status})`).join('\n')}

View Full Profile: https://path-lens-wine.vercel.app`.trim();
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(profileSummary)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* AI Career Intelligence — first, most prominent */}
        <AICareerInsight evidence={evidence} profile={studentProfile} />

        <div className={styles.overallSection}>
          <h2 style={{ color: 'var(--color-text)', fontWeight: '800', fontSize: '28px', marginBottom: '20px' }}>Your Career Landscape</h2>

          <div className={`${styles.overallCard} ${scoreDone ? styles.scorePulse : ''}`}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Readiness Score
            </div>
            <div className={styles.overallScore}>{displayScore}/100</div>
            <div className={styles.overallLevel}>{profile.level}</div>
            <p className={styles.overallInterpretation}>{profile.interpretation}</p>
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              Weighted across 6 dimensions · Technical & Portfolio each 20%
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
              <strong style={{ fontSize: '13px' }}>💡 Pro Tip:</strong><br/>See where you stand vs your university cohort — click "See University Cohort" from the Paths page to benchmark yourself.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onBackToProfile}
              style={{
                fontSize: '13px', padding: '8px 16px', background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', color: 'var(--color-text-secondary)'
              }}
            >
              📝 Update Evidence →
            </button>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              This profile travels with you — update it after every role, project, or certification.
            </span>
          </div>
        </div>

        <DynamicOSModules
          profile={profile}
          studentProfile={studentProfile}
          evidence={evidence}
          onViewGaps={onViewGaps}
          onBackToProfile={onBackToProfile}
          onViewTrajectory={onViewTrajectory}
        />

        {/* Visual Score Range Indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {[
            { label: '75+', emoji: '🏆', color: 'var(--color-success)', desc: 'Market Ready', salary: 'MYR 630k+' },
            { label: '55-74', emoji: '📈', color: 'var(--color-accent)', desc: 'Good Progress', salary: 'MYR 420-560k' },
            { label: '30-54', emoji: '⚙️', color: 'var(--color-warning)', desc: 'Building', salary: 'MYR 168-252k' },
            { label: '<30', emoji: '🌱', color: 'var(--color-danger)', desc: 'Starting Out', salary: 'Entry Level' },
          ].map((range, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--color-surface)',
                border: `2px solid ${range.color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '20px 16px',
                textAlign: 'center',
                opacity: profile.overall >= (idx === 3 ? 0 : idx === 2 ? 30 : idx === 1 ? 55 : 75) ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{range.emoji}</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: range.color, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                {range.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px', letterSpacing: '0.02em' }}>
                {range.desc}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: range.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {range.salary}
              </div>
            </div>
          ))}
        </div>

        {/* Market Impact Section */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
            💰 What This Score Means for Your Career
          </h3>
          {profile.overall >= 75 && (
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong style={{ color: 'var(--color-success)' }}>You're market-ready for senior roles.</strong> Similar to Priya Sharma (Senior SWE at Grab with score 88/100).
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Expected salary range (Asia tech): <strong>MYR 630K-875K/year</strong> for Singapore-facing senior profiles, with equity/RSU packages.
              </p>
              <p style={{ margin: 0 }}>
                Next: Focus on system design, leadership, or specialized domains to unlock Staff Engineer trajectory (+30-50% salary).
              </p>
            </div>
          )}
          {profile.overall >= 55 && profile.overall < 75 && (
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong style={{ color: 'var(--color-warning)' }}>You're on a good trajectory.</strong> Similar to Kai Chen (3 years in, score 70/100 → Data Engineer at ByteDance).
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Expected salary range: <strong>MYR 420K-560K/year</strong> for Singapore-facing mid-level profiles.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Quick wins:</strong> Closing 1-2 skill gaps can unlock +20-30% salary uplift (MYR 84K-168K additional). See "Skills to Develop" below for estimated timelines and ROI.
              </p>
            </div>
          )}
          {profile.overall < 55 && (
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong style={{ color: 'var(--color-text-secondary)' }}>You're building your foundation.</strong> This is where 95% of students start.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Entry-level salary expectations: <strong>MYR 168K-252K/year</strong> for Singapore-facing internship/junior roles.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Strategy:</strong> 1-2 solid projects + 1 high-impact skill = 55+ score in 3-6 months. Priya went from 45 → 88 in 4 years (18% YoY growth).
              </p>
            </div>
          )}
        </div>

        {/* Radar Chart for visual overview */}
        <RadarChart dimensions={profile.dimensions} />

        {/* Success Story - Real Career Example */}
        {(() => {
          const story = getRelevantStory(profile.overall, 0);
          if (!story) return null;
          return (
            <div style={{
              background: 'var(--color-surface)',
              border: '2px solid var(--color-accent)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px' }}>🚀</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
                  Real Career Example: {story.name}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>Current Role</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>
                    {story.role} @ {story.company}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>Current Score</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    {story.currentScore}/100 ({story.yearsExperience} yrs)
                  </p>
                </div>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                "{story.keyLearning}"
              </p>
              <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)' }}>Salary Journey:</p>
                {story.salaryJourney.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: idx < story.salaryJourney.length - 1 ? '6px' : 0 }}>
                    <span><strong>Year {s.year}</strong> ({s.role})</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>{s.salary}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', color: 'var(--color-text)' }}>Key Skill Inflection Points:</p>
              {story.keySkillInflectionPoints.map((point, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: idx < story.keySkillInflectionPoints.length - 1 ? '8px' : 0 }}>
                  <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>Year {point.year}:</span> {point.skill}
                  <div style={{ marginTop: '2px', fontSize: '11px', color: 'var(--color-primary)' }}>Salary impact: {point.salaryImpact}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Detected Skills Summary */}
        {profile.allExtractedSkills.length > 0 && (() => {
          const uniqueSkills = [...new Map(profile.allExtractedSkills.map(s => [s.skill, s])).values()];
          return (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              marginBottom: '32px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                  🔍 {uniqueSkills.length} Skills Detected from Your Evidence
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Keyword-extracted · every skill traceable to source
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {uniqueSkills.map((s) => {
                  const entry = skillTaxonomy.find(t => t.name === s.skill);
                  const demand = entry?.demand ?? 'medium';
                  const demandEmoji = demand === 'high' ? '🔥' : demand === 'medium' ? '📈' : '⚠️';
                  const bg = demand === 'high' ? 'var(--color-success-light)' : demand === 'medium' ? 'var(--color-warning-light)' : 'var(--color-surface-hover)';
                  const color = demand === 'high' ? 'var(--color-success)' : demand === 'medium' ? 'var(--color-warning)' : 'var(--color-text-muted)';
                  return (
                    <span key={s.skill} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: bg, color, border: `1px solid ${color}`,
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '12px', fontWeight: '600',
                    }}>
                      {demandEmoji} {s.skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className={styles.dimensionsSection}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>📊 Your 6 Dimensions</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.6', fontWeight: '500' }}>
            Career readiness broken down into 6 key dimensions. Every card shows score, status, why the score was assigned, and which evidence source supported the signal. <strong style={{ color: 'var(--color-accent)' }}>Target 75+ in each</strong> to stay competitive.
          </p>
          <div className={styles.dimensionsGrid}>
            {profile.dimensions.map((dimension, idx) => (
              <DimensionScoreGauge
                key={idx}
                dimension={dimension}
                evidence={evidence}
                extractedSkills={profile.allExtractedSkills}
              />
            ))}
          </div>
        </div>

        <ATSScoreCard profile={profile} evidence={evidence} />

        <PortfolioQualitySection evidence={evidence} />

        <CareerGuidanceSection profile={profile} />

        <div className={styles.nextSection}>
          <div className={styles.buttonGroup}>
            <button className={styles.secondaryButton} onClick={handleCopyProfile}>
              {copied ? '✅ Copied!' : '📋 Copy Summary'}
            </button>
            <button className={styles.secondaryButton} onClick={handleExportPDF}>
              📥 Export PDF
            </button>
            <button className={styles.secondaryButton} onClick={handleShareWithCareerServices}>
              📧 Share via Email
            </button>
            {onViewTrajectory && (
              <button className={styles.secondaryButton} onClick={onViewTrajectory}>
                🧭 Simulate Trajectory
              </button>
            )}
            <button className={styles.nextButton} onClick={onViewGaps}>
              View Paths Forward →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
