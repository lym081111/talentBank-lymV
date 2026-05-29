import { Gap } from '../types/evidence';
import styles from './GapActionCard.module.css';

interface Props {
  gap: Gap;
  index: number;
}

export function GapActionCard({ gap, index }: Props) {
  return (
    <article className={styles.card} aria-label={`Gap ${index + 1}: ${gap.dimension}, score ${gap.score}/100`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.number} aria-hidden="true">#{index + 1}</span>
          <h3>{gap.dimension}</h3>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.score} aria-label={`Current score: ${gap.score} out of 100`}>{gap.score}/100</div>
          <div
            className={styles.impactBadge}
            title="Estimated overall readiness gain if this gap is closed"
            aria-label={`Projected impact: ${gap.projectedImpact} to overall score if this gap is closed`}
          >
            {gap.projectedImpact}
            <span className={styles.impactLabel}>overall if closed</span>
          </div>
        </div>
      </div>

      <div className={styles.explanation}>
        <strong>What's Missing:</strong>
        <p>{gap.explanation}</p>
      </div>

      <div className={styles.matters}>
        <strong>Why This Matters:</strong>
        <p>{gap.whyMatters}</p>
      </div>

      {gap.cohortInsights && (
        <div
          className={styles.cohortInsight}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '14px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <strong style={{ color: 'var(--color-primary)' }}>Data-Driven Priority</strong>
          </div>
          <p style={{ margin: 0, lineHeight: '1.5' }}>
            {gap.cohortInsights.priorityReasoning}
          </p>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                height: '4px',
                flex: 1,
                background: 'var(--color-border)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(gap.cohortInsights.gapFrequencyPercentage, 100)}%`,
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                  borderRadius: '2px',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>
              {gap.cohortInsights.gapFrequencyPercentage}%
            </span>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <strong>Your Recommended Actions:</strong>
        <div className={styles.actionsList} role="list" aria-label={`Actions for ${gap.dimension}`}>
          {gap.nextActions.map((action, idx) => {
            const isRecommended = gap.cohortInsights && idx === gap.cohortInsights.recommendedActionIndex;
            return (
            <div
              key={idx}
              className={styles.action}
              role="listitem"
              style={
                isRecommended
                  ? {
                      background: 'linear-gradient(135deg, var(--color-success-light) 0%, var(--color-primary-light) 100%)',
                      border: '1.5px solid var(--color-success)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      position: 'relative',
                    }
                  : {}
              }
            >
              <div
                className={styles.actionTitle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'space-between',
                }}
              >
                <span>{action.title}</span>
                {isRecommended && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      background: 'var(--color-success)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    🎯 RECOMMENDED
                  </span>
                )}
              </div>
              <p className={styles.actionDescription}>{action.description}</p>
              <div className={styles.actionMeta}>
                <span className={styles.timeline} aria-label={`Timeline: ${action.timeline}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {action.timeline}
                </span>
                <span className={styles.effort} aria-label={`Effort: ${action.effort}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  {action.effort}
                </span>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
