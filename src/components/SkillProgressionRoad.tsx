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
  const highPriority = skills.filter(s => s.priority === 'high');
  const mediumPriority = skills.filter(s => s.priority === 'medium');

  const getMilestoneColor = (priority: string) => {
    switch (priority) {
      case 'high':   return { bg: '#ef4444', text: '#ffffff', light: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)' };
      case 'medium': return { bg: '#f59e0b', text: '#ffffff', light: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)' };
      default:       return { bg: '#10b981', text: '#ffffff', light: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)' };
    }
  };

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      {/* Road Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h3 style={{
          fontSize: '28px',
          fontWeight: '900',
          margin: '0 0 8px 0',
          color: 'var(--color-text)',
          letterSpacing: '-0.5px'
        }}>
          🛣️ Your Learning Road
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontWeight: '500'
        }}>
          Follow the path from START to MASTERY. Each milestone builds your career.
        </p>
      </div>

      {/* Main Road with Milestones */}
      <div style={{
        position: 'relative',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #0d1a2e 0%, #0a1a14 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(16,185,129,0.25)',
        overflow: 'hidden'
      }}>
        {/* Road background lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.3
          }}
          viewBox={`0 0 1200 ${60 + (highPriority.length + mediumPriority.length) * 120}`}
          preserveAspectRatio="none"
        >
          {/* Road path */}
          <path
            d={`M 600 30 Q 400 ${60 + highPriority.length * 60} 600 ${60 + (highPriority.length + mediumPriority.length) * 120}`}
            stroke="#10b981"
            strokeWidth="60"
            fill="none"
            strokeLinecap="round"
          />
          {/* Road center line (dashed) */}
          <path
            d={`M 600 30 Q 400 ${60 + highPriority.length * 60} 600 ${60 + (highPriority.length + mediumPriority.length) * 120}`}
            stroke="#fbbf24"
            strokeWidth="4"
            fill="none"
            strokeDasharray="20,20"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* START marker */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--color-success)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              🚀 START HERE
            </div>
          </div>

          {/* HIGH PRIORITY Road Milestones */}
          {highPriority.map((skill, idx) => {
            const colors = getMilestoneColor(skill.priority);
            const isLast = idx === highPriority.length - 1;

            return (
              <div key={skill.skill} style={{ marginBottom: '80px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '24px',
                  position: 'relative'
                }}>
                  {/* Milestone Badge */}
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: colors.bg,
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.text,
                      fontWeight: '900',
                      fontSize: '32px',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                      border: '4px solid white'
                    }}>
                      {idx + 1}
                    </div>
                  </div>

                  {/* Milestone Card */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: `2px solid ${colors.border}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    boxShadow: `0 4px 20px ${colors.light}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <h4 style={{
                          margin: '0 0 6px 0',
                          fontSize: '16px',
                          fontWeight: '900',
                          color: '#ffffff',
                          letterSpacing: '-0.3px'
                        }}>
                          {skill.skill}
                        </h4>
                        <div style={{
                          fontSize: '12px',
                          color: colors.bg,
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em'
                        }}>
                          ⏱️ {skill.weeksToLearn} weeks
                        </div>
                      </div>
                      <div style={{
                        background: colors.light,
                        color: colors.bg,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap'
                      }}>
                        💰 {skill.salaryImpact}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.6'
                    }}>
                      {skill.resources.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </div>

                {/* Road segment between milestones */}
                {!isLast && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '40px',
                    margin: '20px 0',
                    position: 'relative',
                    left: '40px'
                  }}>
                    <div style={{
                      width: '3px',
                      background: 'linear-gradient(180deg, var(--color-success), var(--color-accent))',
                      borderRadius: '2px'
                    }} />
                  </div>
                )}
              </div>
            );
          })}

          {/* PHASE 2 Marker - Branch off the road */}
          {mediumPriority.length > 0 && (
            <>
              <div style={{
                margin: '60px 0 40px 0',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'var(--color-warning)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🛣️ NEXT LEVEL (Optional Branch)
                </div>
              </div>

              {/* MEDIUM PRIORITY as side branch */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginLeft: '120px'
              }}>
                {mediumPriority.map((skill) => {
                  const colors = getMilestoneColor(skill.priority);

                  return (
                    <div
                      key={skill.skill}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px',
                        position: 'relative'
                      }}
                    >
                      {/* Branch connector */}
                      <div style={{
                        position: 'absolute',
                        top: '24px',
                        left: '-40px',
                        width: '40px',
                        height: '2px',
                        background: colors.bg,
                        opacity: 0.5
                      }} />

                      <h5 style={{
                        margin: '0 0 6px 0',
                        fontSize: '14px',
                        fontWeight: '800',
                        color: '#ffffff'
                      }}>
                        {skill.skill}
                      </h5>
                      <div style={{
                        fontSize: '11px',
                        color: colors.bg,
                        fontWeight: '600',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                      }}>
                        ⏱️ {skill.weeksToLearn} weeks · 💰 {skill.salaryImpact}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {skill.resources[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* FINISH LINE */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '80px'
          }}>
            <div style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--color-success), var(--color-accent))',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '50px',
              fontWeight: '900',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
            }}>
              🏁 MASTERY ACHIEVED
            </div>
          </div>

          {/* Tip box — inside the road so users can see it in context */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(16,185,129,0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 20px',
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: '600',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
            <div>
              <strong style={{ color: '#ffffff', display: 'block', marginBottom: '2px' }}>How to read this map:</strong>
              Follow the <strong style={{ color: '#ef4444' }}>main road</strong> (numbered milestones) first — high-priority skills with the biggest score impact. Then explore the <strong style={{ color: '#f59e0b' }}>optional branch</strong> for medium-priority specializations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
