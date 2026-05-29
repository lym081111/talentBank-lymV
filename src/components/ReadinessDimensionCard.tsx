import { DimensionScore } from '../types/evidence';
import styles from './ReadinessDimensionCard.module.css';

interface Props {
  dimension: DimensionScore;
  index?: number;
}

const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  'Technical Skills': 'Proficiency in programming languages, frameworks, and core CS concepts',
  'Portfolio Evidence': 'Quality and completeness of projects and work samples you\'ve shared',
  'Work Readiness': 'Experience with real-world work practices, teamwork, and collaboration',
  'Communication & Documentation': 'Ability to explain your work, write clear documentation, and articulate technical concepts',
  'Production Practices': 'Experience with testing, deployment, monitoring, and production engineering',
  'Role-Specific Fit (Software Engineer)': 'How well your skills align with your target role and company needs',
};

export function ReadinessDimensionCard({ dimension, index = 0 }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Strong':
        return 'var(--color-success)';
      case 'Internship-Ready':
        return 'var(--color-primary)';
      case 'Developing':
        return 'var(--color-warning)';
      case 'Emerging':
        return 'var(--color-danger)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Strong': return 'var(--color-success-light)';
      case 'Internship-Ready': return 'var(--color-primary-light)';
      case 'Developing': return 'var(--color-warning-light)';
      case 'Emerging': return 'var(--color-danger-light)';
      default: return 'var(--color-surface-hover)';
    }
  };

  const percentage = (dimension.score / 100) * 100;

  const description = DIMENSION_DESCRIPTIONS[dimension.dimension];

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={`${dimension.dimension}: ${dimension.score}/100 — ${dimension.status}`}
    >
      <div className={styles.header}>
        <h3 title={description}>{dimension.dimension}</h3>
        <div className={styles.score} aria-label={`Score: ${dimension.score} out of 100`}>{dimension.score}/100</div>
      </div>

      <div
        className={styles.status}
        role="status"
        aria-label={`Status: ${dimension.status}`}
        style={{
          color: getStatusColor(dimension.status),
          background: getStatusBg(dimension.status),
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: '12px',
          border: `1px solid ${getStatusColor(dimension.status)}`,
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {dimension.status}
      </div>

      <div
        className={styles.progressBar}
        style={{ position: 'relative' }}
        role="progressbar"
        aria-valuenow={dimension.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${dimension.dimension} progress: ${dimension.score}%`}
      >
        <div
          className={styles.progressFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatusColor(dimension.status),
          }}
        ></div>
        {/* Target threshold at 75 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '75%',
          width: '2px',
          height: '100%',
          background: 'var(--color-text-muted)',
          opacity: 0.5,
        }} title="Target: 75+ for internship readiness" aria-hidden="true" />
      </div>
      {dimension.score < 75 && (
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px', textAlign: 'right' }}>
          {75 - dimension.score} pts to target (75)
        </div>
      )}

      <p className={styles.explanation}>{dimension.explanation}</p>

      {dimension.topSkills && dimension.topSkills.length > 0 && (
        <div className={styles.topSkills}>
          <strong>Top Skills:</strong>
          <ul aria-label={`Top skills in ${dimension.dimension}`}>
            {dimension.topSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
