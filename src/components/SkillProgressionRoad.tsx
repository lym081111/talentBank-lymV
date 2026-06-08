interface Milestone {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  weeksToLearn: number;
  salaryImpact: string;
  resources: string[];
}

interface Props {
  skills: Milestone[];
}

export function SkillProgressionRoad({ skills }: Props) {
  const highPriority = skills.filter((s) => s.priority === 'high');
  const mediumPriority = skills.filter((s) => s.priority === 'medium');
  const orderedSkills = [
    ...highPriority,
    ...mediumPriority,
    ...skills.filter((s) => s.priority === 'low'),
  ].slice(0, 5);

  const totalWeeks = orderedSkills.reduce((sum, skill) => sum + skill.weeksToLearn, 0);
  const totalImpact = orderedSkills.reduce((sum, skill) => {
    const match = skill.salaryImpact.match(/\+(\d+)/);
    return sum + (match ? Number(match[1]) : 0);
  }, 0);

  const marketSignals = [
    {
      label: 'Malaysia SWE 75th',
      value: 'MYR 119K',
      note: 'Levels.fyi annual total comp benchmark',
    },
    {
      label: 'Digital pay pressure',
      value: '+10.81%',
      note: 'PIKOM 2026 advertised salary outlook',
    },
    {
      label: 'IT readiness constraint',
      value: 'AI confidence -7pp',
      note: 'Manpower Malaysia IT Talent Snapshot',
    },
  ];

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '26px' }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: 900,
          margin: '0 0 8px 0',
          color: 'var(--color-text)',
          letterSpacing: '-0.5px',
        }}>
          Readiness Route Map
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontWeight: 500,
        }}>
          A visual sprint from current evidence to a stronger application story. The route uses gaps from this profile, not a generic roadmap.
        </p>
      </div>

      <div style={{
        position: 'relative',
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.96) 0%, rgba(15, 23, 42, 0.96) 58%, rgba(8, 47, 73, 0.82) 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(103, 232, 249, 0.24)',
        boxShadow: '0 24px 70px rgba(2, 6, 23, 0.28)',
        overflow: 'hidden',
      }}>
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.42,
          }}
          viewBox="0 0 1200 620"
          preserveAspectRatio="none"
        >
          <path
            d="M 90 520 C 250 280, 360 360, 510 210 S 800 100, 1085 82"
            stroke="#22d3ee"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 90 520 C 250 280, 360 360, 510 210 S 800 100, 1085 82"
            stroke="#fef08a"
            strokeWidth="5"
            fill="none"
            strokeDasharray="18,24"
            strokeLinecap="round"
          />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#bbf7d0',
                padding: '10px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Start: current evidence profile
              </div>

              <div style={{ display: 'grid', gap: '14px', marginTop: '28px' }}>
                {orderedSkills.map((skill, idx) => {
                  const isHigh = skill.priority === 'high';
                  const color = isHigh ? '#fb7185' : skill.priority === 'medium' ? '#fbbf24' : '#34d399';

                  return (
                    <div
                      key={`${skill.skill}-${idx}`}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '14px',
                        alignItems: 'center',
                        border: `1px solid ${color}55`,
                        background: isHigh ? 'rgba(251, 113, 133, 0.10)' : 'rgba(255, 255, 255, 0.055)',
                        borderRadius: '18px',
                        padding: '14px',
                        boxShadow: isHigh ? '0 18px 45px rgba(251, 113, 133, 0.12)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '16px',
                        background: `${color}22`,
                        border: `1px solid ${color}66`,
                        color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '18px',
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: '1 1 230px', minWidth: 0 }}>
                        <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 900, lineHeight: 1.2 }}>
                          {skill.skill}
                        </div>
                        <div style={{ marginTop: '6px', color: 'rgba(255,255,255,0.52)', fontSize: '12px', lineHeight: 1.45 }}>
                          {skill.resources.slice(0, 2).join(' | ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                        <div style={{ color, fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {skill.priority} priority
                        </div>
                        <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 800, marginTop: '5px' }}>
                          {skill.weeksToLearn} weeks | {skill.salaryImpact}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                marginTop: '22px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(103, 232, 249, 0.34)',
                background: 'linear-gradient(135deg, rgba(103, 232, 249, 0.18), rgba(167, 139, 250, 0.16))',
                color: '#e0f2fe',
                padding: '12px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 900,
              }}>
                Finish line: +{totalImpact || 20} readiness points in about {totalWeeks || 8} weeks
              </div>
            </div>

            <aside style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(2, 6, 23, 0.64)',
              borderRadius: '22px',
              padding: '18px',
            }}>
              <div style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Market context
              </div>
              <div style={{ display: 'grid', gap: '12px', marginTop: '14px' }}>
                {marketSignals.map((signal) => (
                  <div key={signal.label} style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.045)',
                    borderRadius: '16px',
                    padding: '13px',
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {signal.label}
                    </div>
                    <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 900, marginTop: '5px' }}>
                      {signal.value}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', lineHeight: 1.4, marginTop: '5px' }}>
                      {signal.note}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', lineHeight: 1.55, margin: '14px 0 0 0' }}>
                These are external market signals. PathLens still scores only the candidate evidence you entered.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(103, 232, 249, 0.06)',
        border: '1px dashed rgba(103, 232, 249, 0.38)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        fontWeight: 500,
      }}>
        Follow high-priority gaps first. Optional branches become useful only after the weak evidence no longer blocks applications.
      </div>
    </div>
  );
}
