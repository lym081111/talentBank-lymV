interface RoadmapSkill {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  weeksToLearn: number;
  salaryImpact: string;
  learningPaths: string[];
  resources: string[];
}

interface Props {
  skills: RoadmapSkill[];
}

export function SkillRoadmap({ skills }: Props) {
  const highPriority = skills.filter(s => s.priority === 'high');
  const mediumPriority = skills.filter(s => s.priority === 'medium');

  const totalHighWeeks = highPriority.reduce((sum, s) => sum + s.weeksToLearn, 0);
  const startMonth = new Date();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', icon: '🔴' };
      case 'medium': return { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', icon: '🟡' };
      default: return { bg: 'var(--color-success-light)', color: 'var(--color-success)', icon: '🟢' };
    }
  };

  const getEndMonth = (weeksFromNow: number) => {
    const date = new Date(startMonth);
    date.setDate(date.getDate() + weeksFromNow * 7);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Roadmap Title & Timeline View */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '28px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '900',
          margin: '0 0 8px 0',
          color: 'var(--color-text)',
          letterSpacing: '-0.5px'
        }}>
          🗺️ Your Learning Roadmap
        </h3>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          margin: '0 0 20px 0',
          fontWeight: '500'
        }}>
          Prioritized skills with realistic timelines. Start with <strong style={{ color: 'var(--color-danger)' }}>High Priority</strong> to unlock maximum salary growth.
        </p>

        {/* Timeline Overview */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)' }}>
              📅 Total Timeline
            </span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-danger)' }}>
              {totalHighWeeks} weeks ({Math.ceil(totalHighWeeks / 4)} months)
            </span>
          </div>
          <div style={{
            height: '6px',
            background: 'var(--color-bg)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-danger), var(--color-accent))',
              width: '100%',
              borderRadius: '3px'
            }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'right' }}>
            Now → {getEndMonth(totalHighWeeks)}
          </div>
        </div>
      </div>

      {/* Phase 1: High Priority Skills */}
      {highPriority.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '900',
            color: 'var(--color-danger)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🔴</span>
            PHASE 1: High Priority (Immediate Impact)
          </div>

          {highPriority.map((skill, idx) => {
            const cumulativeWeeks = highPriority.slice(0, idx + 1).reduce((sum, s) => sum + s.weeksToLearn, 0);
            const endDate = getEndMonth(cumulativeWeeks);
            const colors = getPriorityColor(skill.priority);

            return (
              <div
                key={skill.skill}
                style={{
                  background: 'var(--color-surface)',
                  border: `2px solid ${colors.color}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Step Number */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  width: '40px',
                  height: '40px',
                  background: colors.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '900',
                  fontSize: '18px'
                }}>
                  {idx + 1}
                </div>

                <div style={{ paddingTop: '12px' }}>
                  {/* Skill Title & Timeline */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '16px',
                        fontWeight: '800',
                        color: 'var(--color-text)'
                      }}>
                        {skill.skill}
                      </h4>
                      <div style={{
                        fontSize: '12px',
                        color: colors.color,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>
                        ⏱️ {skill.weeksToLearn} weeks
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      background: 'var(--color-bg)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ fontWeight: '700', color: colors.color }}>Complete by</div>
                      <div>{endDate}</div>
                    </div>
                  </div>

                  {/* Salary Impact */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-success-light) 0%, var(--color-accent-light) 100%)',
                    border: '1px solid var(--color-success)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--color-success)'
                  }}>
                    💰 Salary Impact: {skill.salaryImpact}
                  </div>

                  {/* Learning Paths */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--color-text)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      📚 Learning Paths
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {skill.learningPaths.map((path, pidx) => (
                        <div
                          key={pidx}
                          style={{
                            background: 'var(--color-bg)',
                            border: `1px solid ${colors.color}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '6px 10px',
                            fontSize: '11px',
                            color: colors.color,
                            fontWeight: '600'
                          }}
                        >
                          ✓ {path}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--color-text)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      🔗 Resources
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '16px' }}>
                      {skill.resources.map((resource, ridx) => (
                        <li
                          key={ridx}
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '4px',
                            fontWeight: '500'
                          }}
                        >
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < highPriority.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '40px',
                    bottom: '-18px',
                    width: '2px',
                    height: '18px',
                    background: colors.color,
                    opacity: 0.3
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Phase 2: Medium Priority Skills (Optional) */}
      {mediumPriority.length > 0 && (
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '900',
            color: 'var(--color-warning)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🟡</span>
            PHASE 2: Medium Priority (After Phase 1)
          </div>

          {mediumPriority.map((skill) => (
            <div
              key={skill.skill}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-warning)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                marginBottom: '12px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div>
                  <h5 style={{
                    margin: '0 0 2px 0',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--color-text)'
                  }}>
                    {skill.skill}
                  </h5>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    ⏱️ {skill.weeksToLearn} weeks · 💰 {skill.salaryImpact}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                {skill.learningPaths.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{
        background: 'var(--color-bg)',
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginTop: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
          💡 <strong>Pro Tip:</strong> Master Phase 1 skills first to unlock 25-40% salary growth. Then pursue Phase 2 for specialization.
        </div>
      </div>
    </div>
  );
}
