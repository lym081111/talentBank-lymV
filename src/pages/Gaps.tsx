import { Gap, NextAction, ReadinessProfile } from '../types/evidence';
import { GapActionCard } from '../components/GapActionCard';
import { matchMarketplaceRoles } from '../utils/marketplaceMatching';
import styles from './Gaps.module.css';

interface Props {
  gaps: Gap[];
  profile: ReadinessProfile;
  onViewCohort: () => void;
  onUpdateEvidence?: () => void;
}

function findQuickWin(gaps: Gap[]): { gap: Gap; action: NextAction } | null {
  if (gaps.length === 0) return null;

  function minHours(effort: string): number {
    const match = effort.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  }

  function minWeeks(timeline: string): number {
    const match = timeline.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  }

  let best: { gap: Gap; action: NextAction; score: number } | null = null;

  for (const gap of gaps) {
    for (const action of gap.nextActions) {
      const timeScore = minWeeks(action.timeline) + minHours(action.effort) * 0.1;
      const composite = timeScore / (gap.dimensionWeight * 10);
      if (!best || composite < best.score) {
        best = { gap, action, score: composite };
      }
    }
  }

  return best ? { gap: best.gap, action: best.action } : null;
}

export function Gaps({ gaps, profile, onViewCohort, onUpdateEvidence }: Props) {
  const quickWin = findQuickWin(gaps);
  const marketplaceMatches = matchMarketplaceRoles(profile, gaps).slice(0, 3);

  return (
    <div className={styles.container} role="main" aria-label="Paths Forward growth opportunities">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Your Paths Forward</h2>
          <p>
            Here is where your landscape has room to grow. Each dimension includes concrete
            actions for the next 30-90 days. Pick one, build evidence, then re-check.
          </p>
        </div>

        {quickWin && (
          <div className={styles.quickWin} role="region" aria-label="Quick win recommendation">
            <div className={styles.quickWinHeader}>
              <strong>Your Quick Win</strong>
              <span>{quickWin.action.timeline} / {quickWin.action.effort}</span>
            </div>
            <div className={styles.quickWinTitle}>{quickWin.action.title}</div>
            <div className={styles.quickWinDescription}>{quickWin.action.description}</div>
            <div className={styles.quickWinMeta}>
              Dimension: <strong>{quickWin.gap.dimension}</strong> - projected impact:{' '}
              <strong>{quickWin.gap.projectedImpact}</strong>
            </div>
          </div>
        )}

        {gaps.length > 0 ? (
          <div className={styles.gapsList} role="list" aria-label={`${gaps.length} growth gaps identified`}>
            {gaps.map((gap, idx) => (
              <GapActionCard key={gap.dimension} gap={gap} index={idx} />
            ))}
          </div>
        ) : (
          <div className={styles.noGaps}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className={styles.noGapsTitle}>Outstanding Readiness!</p>
            <p className={styles.noGapsDesc}>You are in great shape across all dimensions. Keep building and stay curious.</p>
          </div>
        )}

        <div className={styles.reflection}>
          <h3>How to Navigate This</h3>
          <ol>
            <li>
              <strong>Pick one gap.</strong> Start with the highest-impact dimension. Do not try to move everything at once.
            </li>
            <li>
              <strong>Choose an action.</strong> Pick what fits your timeline and adds visible evidence to your profile.
            </li>
            <li>
              <strong>Build and ship it.</strong> Add the result as new evidence: a deployed project, a certificate, or a role description.
            </li>
            <li>
              <strong>Re-check your landscape.</strong> Update evidence to see dimensions, gaps, and marketplace matches shift.
            </li>
          </ol>
        </div>

        <div className={styles.careerOsSection}>
          <div className={styles.careerOsLabel}>Asia's Career OS - What Comes Next</div>
          <p className={styles.careerOsDesc}>
            PathLens does not predict your future. It turns evidence into a readiness profile,
            shows the realistic routes open now, and exposes what blocks stronger internship matches.
          </p>
          <div className={styles.careerOsFlow}>
            <div className={`${styles.careerOsModule} ${styles.careerOsModuleCurrent}`}>
              <div className={styles.careerOsModuleNum}>03</div>
              <div className={styles.careerOsModuleTitle}>Adaptive Readiness Profile</div>
              <div className={styles.careerOsModuleDesc}>Evidence becomes dimensions, gaps, and next actions</div>
              <div className={styles.careerOsModuleYou}>You are here</div>
            </div>

            <div className={styles.careerOsArrow}>→</div>

            <div className={`${styles.careerOsModule} ${styles.careerOsModuleNext}`}>
              <div className={styles.careerOsModuleNum}>04</div>
              <div className={styles.careerOsModuleTitle}>Career Marketplace</div>
              <div className={styles.careerOsModuleDesc}>Roles consume the same skills and readiness thresholds</div>
            </div>

            <div className={styles.careerOsArrow}>→</div>

            <div className={`${styles.careerOsModule} ${styles.careerOsModuleNext}`}>
              <div className={styles.careerOsModuleNum}>05</div>
              <div className={styles.careerOsModuleTitle}>Learning Wallet</div>
              <div className={styles.careerOsModuleDesc}>Evidence snapshots become portable credentials</div>
            </div>
          </div>
        </div>

        <div className={styles.marketplaceSection} aria-label="Career Marketplace preview">
          <div className={styles.marketplaceHeader}>
            <div>
              <div className={styles.marketplaceLabel}>Module 04 Preview</div>
              <h3>Career Marketplace Bridge</h3>
              <p>
                Simulated internship roles show how employers could consume this readiness
                profile. Matches use extracted skills, dimension thresholds, and current gaps.
              </p>
            </div>
            <div className={styles.marketplaceBadge}>Mock data</div>
          </div>

          <div className={styles.matchGrid}>
            {marketplaceMatches.map((match) => (
              <article className={styles.matchCard} key={match.role.id}>
                <div className={styles.matchTopline}>
                  <span className={styles.matchFit}>{match.fit}</span>
                  <span className={styles.matchScore}>{match.score}/100</span>
                </div>
                <h4>{match.role.title}</h4>
                <p className={styles.matchCompany}>{match.role.company} - {match.role.market}</p>
                <p className={styles.matchDescription}>{match.role.description}</p>

                <div className={styles.matchList}>
                  <strong>Why matched</strong>
                  <ul>
                    {match.whyMatched.slice(0, 3).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.matchList}>
                  <strong>What blocks stronger fit</strong>
                  <ul>
                    {match.blockers.slice(0, 3).map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.matchNext}>
                  <strong>Next move:</strong> {match.nextStep}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.buttonRow}>
          {onUpdateEvidence && (
            <button className={styles.updateButton} onClick={onUpdateEvidence}>
              Update Evidence & Re-check
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
