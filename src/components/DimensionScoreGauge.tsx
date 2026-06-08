import { DimensionScore, Evidence, ExtractedSkill } from '../types/evidence';

interface Props {
  dimension: DimensionScore & { topStrengths?: string[]; improvementAreas?: string[] };
  evidence?: Evidence[];
  extractedSkills?: ExtractedSkill[];
}

const DIMENSION_KEYWORDS: Record<string, string[]> = {
  'Technical Skills': ['Python', 'JavaScript / TypeScript', 'Java', 'C / C++', 'SQL', 'React', 'Node.js / Express', 'Vue.js'],
  'Portfolio Evidence': ['portfolio', 'fyp', 'hackathon', 'certificate', 'internship'],
  'Work Readiness': ['internship', 'team', 'agile', 'collaboration', 'production', 'debug'],
  'Communication & Documentation': ['documentation', 'readme', 'blog', 'presentation', 'stakeholder'],
  'Production Practices': ['test', 'testing', 'ci/cd', 'deployment', 'deploy', 'docker', 'monitoring', 'code review'],
  'Role-Specific Fit (Software Engineer)': ['Python', 'JavaScript / TypeScript', 'Java', 'React', 'Node.js / Express', 'RESTful APIs', 'System Design & Architecture'],
};

function getStatusTone(score: number) {
  if (score >= 75) return 'var(--color-success)';
  if (score >= 55) return 'var(--color-accent)';
  if (score >= 30) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function getDimensionIcon(dim: string) {
  switch (dim) {
    case 'Technical Skills': return 'TS';
    case 'Portfolio Evidence': return 'PF';
    case 'Work Readiness': return 'WR';
    case 'Communication & Documentation': return 'CD';
    case 'Production Practices': return 'PP';
    case 'Role-Specific Fit (Software Engineer)': return 'RF';
    default: return 'RD';
  }
}

function getEvidenceAudit(dimension: DimensionScore, evidence: Evidence[] = [], extractedSkills: ExtractedSkill[] = []) {
  const keywords = DIMENSION_KEYWORDS[dimension.dimension] ?? [];
  const matchedSkill = extractedSkills.find((skill) =>
    keywords.includes(skill.skill) || dimension.topSkills.includes(skill.skill)
  );

  if (matchedSkill) {
    const source = evidence.find((item) => item.id === matchedSkill.sourceEvidenceId);
    return {
      source: source?.title ?? 'Source evidence item',
      signals: [matchedSkill.skill, matchedSkill.sourcePhrase].filter(Boolean).slice(0, 2),
    };
  }

  const matchedEvidence = evidence.find((item) => {
    const text = `${item.type} ${item.title} ${item.description} ${item.technologies ?? ''} ${item.outcome ?? ''}`.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });

  return {
    source: matchedEvidence?.title ?? (evidence[0]?.title ?? 'No evidence source yet'),
    signals: dimension.topSkills.length > 0 ? dimension.topSkills.slice(0, 2) : keywords.slice(0, 2),
  };
}

export function DimensionScoreGauge({ dimension, evidence = [], extractedSkills = [] }: Props) {
  const score = dimension.score;
  const color = getStatusTone(score);
  const percentFill = (score / 100) * 100;
  const audit = getEvidenceAudit(dimension, evidence, extractedSkills);

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '800',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '9px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              fontSize: '10px',
              fontWeight: 900,
            }}>
              {getDimensionIcon(dimension.dimension)}
            </span>
            {dimension.dimension}
          </div>
          <div style={{
            fontSize: '11px',
            color,
            marginTop: '4px',
            textTransform: 'uppercase',
            fontWeight: '800',
            letterSpacing: '0.03em',
          }}>
            Status: {dimension.status}
          </div>
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: '900',
          background: `linear-gradient(135deg, ${color} 0%, var(--color-primary) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {score}/100
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--color-bg)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}>
        <div style={{
          height: '100%',
          width: `${percentFill}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        }} />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontWeight: '600',
        marginBottom: '14px',
      }}>
        <span>0</span>
        <span style={{ color: 'var(--color-accent)', fontWeight: '800' }}>Target: 75+</span>
        <span>100</span>
      </div>

      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '12px',
        display: 'grid',
        gap: '10px',
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.55,
      }}>
        <div>
          <strong style={{ display: 'block', color: 'var(--color-text)', marginBottom: '3px' }}>Why this score</strong>
          {dimension.explanation}
        </div>
        <div>
          <strong style={{ display: 'block', color: 'var(--color-text)', marginBottom: '3px' }}>Evidence source</strong>
          {audit.source}
        </div>
        <div>
          <strong style={{ display: 'block', color: 'var(--color-text)', marginBottom: '3px' }}>Matched signals</strong>
          {audit.signals.length > 0 ? audit.signals.join(' · ') : 'No strong signal detected yet'}
        </div>
      </div>

      {dimension.improvementAreas && dimension.improvementAreas.length > 0 && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontWeight: '700', color: 'var(--color-text)', marginBottom: '4px' }}>
            Next focus
          </div>
          <div>{dimension.improvementAreas[0]}</div>
        </div>
      )}
    </div>
  );
}
