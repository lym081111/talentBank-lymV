import { PortfolioQualityScore } from '../utils/portfolioQuality';
import styles from './PortfolioQualityCard.module.css';

interface Props {
  quality: PortfolioQualityScore;
}

export function PortfolioQualityCard({ quality }: Props) {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Excellent': return 'var(--color-success)';
      case 'Good':      return 'var(--color-primary)';
      case 'Fair':      return 'var(--color-warning)';
      case 'Needs Work':return 'var(--color-danger)';
      default:          return 'var(--color-text-muted)';
    }
  };

  const getCategoryBg = (category: string): string => {
    switch (category) {
      case 'Excellent': return 'var(--color-success-light)';
      case 'Good':      return 'var(--color-primary-light)';
      case 'Fair':      return 'var(--color-warning-light)';
      case 'Needs Work':return 'var(--color-danger-light)';
      default:          return 'var(--color-surface-hover)';
    }
  };

  const getMetricColor = (score: number): string => {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 55) return 'var(--color-primary)';
    if (score >= 35) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <article className={styles.card} aria-label={`Portfolio item: ${quality.title} — ${quality.overallScore}/100 — ${quality.category}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{quality.title}</h4>
          <span className={styles.type}>Portfolio Item</span>
        </div>
        <div
          className={styles.scoreCircle}
          style={{ borderColor: getCategoryColor(quality.category) }}
          role="meter"
          aria-valuenow={quality.overallScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Portfolio quality score: ${quality.overallScore} out of 100`}
        >
          <div className={styles.scoreValue}>{quality.overallScore}</div>
          <div className={styles.scoreMax} aria-hidden="true">/100</div>
        </div>
      </div>

      <div
        className={styles.categoryBadge}
        style={{ backgroundColor: getCategoryBg(quality.category), color: getCategoryColor(quality.category), borderColor: getCategoryColor(quality.category) }}
        aria-label={`Quality category: ${quality.category}`}
      >
        {quality.category}
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.label}>Documentation</span>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{
                width: `${quality.metrics.documentation}%`,
                backgroundColor: getMetricColor(quality.metrics.documentation),
              }}
            />
          </div>
          <span className={styles.value}>{quality.metrics.documentation}</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Complexity</span>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{
                width: `${quality.metrics.complexity}%`,
                backgroundColor: getMetricColor(quality.metrics.complexity),
              }}
            />
          </div>
          <span className={styles.value}>{quality.metrics.complexity}</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Impact</span>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{
                width: `${quality.metrics.impact}%`,
                backgroundColor: getMetricColor(quality.metrics.impact),
              }}
            />
          </div>
          <span className={styles.value}>{quality.metrics.impact}</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.label}>Deployment</span>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{
                width: `${quality.metrics.deployment}%`,
                backgroundColor: getMetricColor(quality.metrics.deployment),
              }}
            />
          </div>
          <span className={styles.value}>{quality.metrics.deployment}</span>
        </div>
      </div>

      {quality.strengths.length > 0 && (
        <div className={styles.strengths}>
          <h5 className={styles.sectionTitle}>✨ Strengths</h5>
          <ul>
            {quality.strengths.map((strength, idx) => (
              <li key={idx}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      {quality.improvements.length > 0 && (
        <div className={styles.improvements}>
          <h5 className={styles.sectionTitle}>🎯 Ways to Improve</h5>
          <ul>
            {quality.improvements.map((improvement, idx) => (
              <li key={idx}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.productionChecklist}>
        <h5 className={styles.sectionTitle}>📋 Production-Ready Checklist</h5>
        <div className={styles.checklistItems}>
          <div className={styles.checklistItem}>
            <span className={quality.productionReadiness.hasGitHubLink ? '✓' : '○'}>
              GitHub repo linked
            </span>
          </div>
          <div className={styles.checklistItem}>
            <span className={quality.productionReadiness.hasLiveDemo ? '✓' : '○'}>
              Live demo/deployment
            </span>
          </div>
          <div className={styles.checklistItem}>
            <span className={quality.productionReadiness.hasDocumentation ? '✓' : '○'}>
              Documentation present
            </span>
          </div>
          <div className={styles.checklistItem}>
            <span className={quality.productionReadiness.hasMeasurableOutcome ? '✓' : '○'}>
              Measurable outcomes
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
