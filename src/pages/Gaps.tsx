import { Gap, NextAction, ReadinessProfile } from '../types/evidence';
import { GapActionCard } from '../components/GapActionCard';
import { matchApplicationTargets, ApplicationTargetMatch } from '../utils/applicationTargets';
import styles from './Gaps.module.css';

interface Props {
  gaps: Gap[];
  readinessProfile?: ReadinessProfile;
  onBackToDashboard?: () => void;
  onViewCohort: () => void;
  onUpdateEvidence?: () => void;
}

/** Returns the single best "quick win" action: shortest timeline × highest weight */
function findQuickWin(gaps: Gap[]): { gap: Gap; action: NextAction } | null {
  if (gaps.length === 0) return null;

  // Parse minimum hours from "5–8 hours" → 5, or "10–15 hours" → 10
  function minHours(effort: string): number {
    const m = effort.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 99;
  }

  // Parse minimum weeks from "1–2 weeks" → 1
  function minWeeks(timeline: string): number {
    const m = timeline.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 99;
  }

  let best: { gap: Gap; action: NextAction; score: number } | null = null;

  for (const gap of gaps) {
    for (const action of gap.nextActions) {
      // Composite score: lower is better (fewer weeks, fewer hours) but weight matters
      const timeScore = minWeeks(action.timeline) + minHours(action.effort) * 0.1;
      // Divide by dimension weight so high-weight dimensions are preferred
      const composite = timeScore / (gap.dimensionWeight * 10);
      if (!best || composite < best.score) {
        best = { gap, action, score: composite };
      }
    }
  }

  return best ? { gap: best.gap, action: best.action } : null;
}

export function Gaps({ gaps, readinessProfile, onBackToDashboard, onViewCohort, onUpdateEvidence }: Props) {
  const quickWin = findQuickWin(gaps);
  const topBlockers = gaps.slice(0, 3);
  const applicationTargetMatches: ApplicationTargetMatch[] = readinessProfile
    ? matchApplicationTargets(readinessProfile, gaps).slice(0, 3)
    : [];

  return (
    <div className={styles.container} role="main" aria-label="3 blockers before you apply">
      <div className={styles.inner}>
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              padding: '10px 18px',
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
          >
            Back to Career Signal Map
          </button>
        )}

        <div className={styles.header}>
          <h2>3 Blockers Before You Apply</h2>
          <p>These are the weakest readiness signals visible from your evidence. Fixing them matters more than polishing another generic resume sentence.</p>
        </div>

        {topBlockers.length > 0 && (
          <div role="region" aria-label="30-day readiness sprint" style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            marginBottom: '28px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '8px' }}>
              30-Day Readiness Sprint
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-text)', fontSize: '20px', fontWeight: 900 }}>
              Turn blockers into new proof blocks.
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {topBlockers.map((gap, index) => (
                <div key={gap.dimension} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  background: 'var(--color-surface-hover)',
                }}>
                  <div style={{ color: 'var(--color-accent)', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Sprint focus {index + 1}
                  </div>
                  <strong style={{ display: 'block', marginTop: '8px', color: 'var(--color-text)' }}>{gap.dimension}</strong>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
                    {gap.nextActions[0]?.title || 'Add source-backed evidence'} - {gap.projectedImpact} if improved.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Win Highlight */}
        {quickWin && (
          <div role="region" aria-label="Quick win recommendation" style={{
            background: 'linear-gradient(135deg, var(--color-success-light) 0%, var(--color-primary-light) 100%)',
            border: '1.5px solid var(--color-success)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 24px',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px' }}>🚀</span>
              <strong style={{ fontSize: '14px', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Quick Win
              </strong>
              <span style={{
                fontSize: '11px', fontWeight: '700',
                background: 'var(--color-success)', color: 'white',
                padding: '2px 8px', borderRadius: '10px', marginLeft: 'auto',
              }}>
                {quickWin.action.timeline} · {quickWin.action.effort}
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px' }}>
              {quickWin.action.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {quickWin.action.description}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Dimension: <strong style={{ color: 'var(--color-text)' }}>{quickWin.gap.dimension}</strong>
              {' '}— projected impact: <strong style={{ color: 'var(--color-success)' }}>{quickWin.gap.projectedImpact}</strong>
            </div>
          </div>
        )}

        {gaps.length > 0 ? (
          <div className={styles.gapsList} role="list" aria-label={`${topBlockers.length} application blocker${topBlockers.length !== 1 ? 's' : ''} identified`}>
            {topBlockers.map((gap, idx) => (
              <GapActionCard key={idx} gap={gap} index={idx} />
            ))}
          </div>
        ) : (
          <div className={styles.noGaps}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p className={styles.noGapsTitle}>Outstanding Readiness!</p>
            <p className={styles.noGapsDesc}>You're in great shape across all dimensions. Keep building and stay curious.</p>
          </div>
        )}

        <div className={styles.reflection}>
          <h3>How to Use This Before Applying</h3>
          <ol>
            <li>
              <strong>Pick one blocker.</strong> Start with the highest-impact dimension. Do not try to fix every signal at once.
            </li>
            <li>
              <strong>Choose an action.</strong> Pick what fits your timeline and excites you. <em style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>(Timelines are estimates; some actions can run in parallel)</em>
            </li>
            <li>
              <strong>Build and ship it.</strong> Add the result as new evidence: a deployed project, a certificate, or a role description with outcomes.
            </li>
            <li>
              <strong>Re-check your map.</strong> Go back to "Update Evidence" and add your new items to see your dimensions shift.
            </li>
          </ol>
        </div>

        {/* Application target guidance */}
        {applicationTargetMatches.length > 0 && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            marginBottom: '28px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '6px' }}>
              Application Targets
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: 'var(--color-text)', fontSize: '18px', fontWeight: 900 }}>
              How your evidence can support real applications
            </h3>
            <p style={{ margin: '0 0 18px 0', color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              These are mock application targets matched against your readiness profile. They show what you can credibly claim now and what still blocks a stronger application.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {applicationTargetMatches.map((match) => {
                const fitColor =
                  match.fit === 'Strong match' ? 'var(--color-success)' :
                  match.fit === 'Stretch match' ? 'var(--color-accent)' :
                  'var(--color-text-secondary)';
                return (
                  <div key={match.role.id} style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    background: 'var(--color-surface-hover)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 900, color: 'var(--color-text)', fontSize: '14px', marginBottom: '2px' }}>{match.role.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{match.role.company} - {match.role.market}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 900, fontSize: '20px', color: fitColor }}>{match.score}%</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: fitColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{match.fit}</div>
                      </div>
                    </div>
                    {match.whyMatched.length > 0 && (
                      <div style={{ fontSize: '12px', color: 'var(--color-success)', marginBottom: '6px' }}>
                        OK: {match.whyMatched[0]}
                      </div>
                    )}
                    {match.blockers.length > 0 && (
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                        Check: {match.blockers[0]}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                      Next: {match.nextStep}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shared evidence view connections */}
        <div className={styles.careerOsSection}>
          <div className={styles.careerOsLabel}>Career OS — What Comes Next</div>
          <p className={styles.careerOsDesc}>
            Your PathLens profile powers three focused readouts. Close your gaps here, then reuse the same evidence for applications, hiring briefs, and university support.
          </p>
          <div className={styles.careerOsFlow}>
            <div className={`${styles.careerOsModule} ${styles.careerOsModuleCurrent}`}>
              <div className={styles.careerOsModuleNum}>03</div>
              <div className={styles.careerOsModuleTitle}>Adaptive Readiness Profile</div>
              <div className={styles.careerOsModuleDesc}>You are here - close the highest-impact blockers first</div>
              <div className={styles.careerOsModuleYou}>You are here</div>
            </div>

            <div className={styles.careerOsArrow}>-&gt;</div>

            <div className={`${styles.careerOsModule} ${styles.careerOsModuleNext}`}>
              <div className={styles.careerOsModuleNum}>A</div>
              <div className={styles.careerOsModuleTitle}>Application Targets</div>
              <div className={styles.careerOsModuleDesc}>Turn the same evidence into role-specific claims, blockers, and next steps</div>
            </div>

            <div className={styles.careerOsArrow}>-&gt;</div>

            <div className={`${styles.careerOsModule} ${styles.careerOsModuleNext}`}>
              <div className={styles.careerOsModuleNum}>U</div>
              <div className={styles.careerOsModuleTitle}>University Intervention</div>
              <div className={styles.careerOsModuleDesc}>Aggregate recurring blockers into cohort actions, owners, and measures</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              style={{
                padding: '12px 28px',
                background: 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-text)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              Back to Career Signal Map
            </button>
          )}
          {onUpdateEvidence && (
            <button
              onClick={onUpdateEvidence}
              style={{
                padding: '12px 28px',
                background: 'transparent',
                border: '2px solid var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-primary)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              📝 Update Evidence & Re-check
            </button>
          )}
          <button className={styles.cohortButton} onClick={onViewCohort}>
            See University Cohort View →
          </button>
        </div>
      </div>
    </div>
  );
}
