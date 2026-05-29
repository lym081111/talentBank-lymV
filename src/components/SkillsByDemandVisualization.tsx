import { ExtractedSkill } from '../types/evidence';
import { skillTaxonomy } from '../data/skillTaxonomy';

interface Props {
  extractedSkills: ExtractedSkill[];
  evidenceTitle?: string;
}

export function SkillsByDemandVisualization({ extractedSkills, evidenceTitle }: Props) {
  // Group skills by demand level and get unique skills
  const skillMap = new Map<string, { count: number; confidence: 'high' | 'medium' | 'low' }>();

  extractedSkills.forEach(skill => {
    const existing = skillMap.get(skill.skill);
    skillMap.set(skill.skill, {
      count: (existing?.count || 0) + 1,
      confidence: skill.confidence,
    });
  });

  // Group by demand
  const groupedByDemand = {
    high: [] as { name: string; count: number; confidence: string }[],
    medium: [] as { name: string; count: number; confidence: string }[],
    low: [] as { name: string; count: number; confidence: string }[],
  };

  skillMap.forEach((value, skillName) => {
    const entry = skillTaxonomy.find(s => s.name === skillName);
    const demand = entry?.demand || 'medium';

    groupedByDemand[demand as keyof typeof groupedByDemand].push({
      name: skillName,
      count: value.count,
      confidence: value.confidence,
    });
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      {evidenceTitle && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
          {evidenceTitle}
        </h3>
      )}

      {/* High Demand Skills */}
      {groupedByDemand.high.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
              High Demand ({groupedByDemand.high.length})
            </h4>
            <div style={{
              fontSize: '11px',
              background: 'var(--color-success-light)',
              color: 'var(--color-success)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {groupedByDemand.high.length} skills
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {groupedByDemand.high.map(skill => (
              <div
                key={skill.name}
                style={{
                  background: 'var(--color-success-light)',
                  border: '1px solid var(--color-success)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{skill.name}</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>×{skill.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium Demand Skills */}
      {groupedByDemand.medium.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>📈</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
              Growing Demand ({groupedByDemand.medium.length})
            </h4>
            <div style={{
              fontSize: '11px',
              background: 'var(--color-warning-light)',
              color: 'var(--color-warning)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {groupedByDemand.medium.length} skills
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {groupedByDemand.medium.map(skill => (
              <div
                key={skill.name}
                style={{
                  background: 'var(--color-warning-light)',
                  border: '1px solid var(--color-warning)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-warning)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{skill.name}</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>×{skill.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Demand Skills */}
      {groupedByDemand.low.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
              Niche Skills ({groupedByDemand.low.length})
            </h4>
            <div style={{
              fontSize: '11px',
              background: 'var(--color-surface-hover)',
              color: 'var(--color-text-muted)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: '600'
            }}>
              {groupedByDemand.low.length} skills
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {groupedByDemand.low.map(skill => (
              <div
                key={skill.name}
                style={{
                  background: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{skill.name}</span>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>×{skill.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
