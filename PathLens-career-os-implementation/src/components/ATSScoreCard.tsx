import { ReadinessProfile, Evidence } from '../types/evidence';
import { scoreATSCompatibility } from '../utils/atsScoring';
import styles from './ATSScoreCard.module.css';

interface Props {
  profile: ReadinessProfile;
  evidence: Evidence[];
}

export function ATSScoreCard({ profile, evidence }: Props) {
  const atsScore = scoreATSCompatibility(profile, evidence);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Excellent': return 'var(--color-success)';
      case 'Good': return 'var(--color-primary)';
      case 'Fair': return 'var(--color-warning)';
      case 'Poor': return 'var(--color-danger)';
      default: return 'var(--color-text-muted)';
    }
  };

  const getStatusMessage = (score: number): string => {
    if (score >= 80) {
      return 'Your resume will likely survive ATS filtering and reach recruiters';
    } else if (score >= 65) {
      return 'Your resume is on track but has room for improvement';
    } else if (score >= 50) {
      return 'Your resume needs improvements to pass ATS systems';
    } else {
      return 'Your resume needs significant updates to be ATS-compatible';
    }
  };

  return (
    <section className={styles.card} aria-label={`ATS Compatibility Score: ${atsScore.overallScore}/100 — ${atsScore.status}`}>
      <div className={styles.header}>
        <h3>🤖 ATS Resume Compatibility</h3>
        <p>How recruiters' Applicant Tracking Systems will see your profile</p>
      </div>

      <div className={styles.scoreDisplay}>
        <div
          className={styles.scoreCircle}
          style={{ borderColor: getStatusColor(atsScore.status) }}
          role="meter"
          aria-valuenow={atsScore.overallScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`ATS score: ${atsScore.overallScore} out of 100`}
        >
          <div className={styles.scoreValue}>{atsScore.overallScore}</div>
          <div className={styles.scoreMax} aria-hidden="true">/100</div>
        </div>

        <div className={styles.scoreInfo}>
          <div className={styles.status} style={{ color: getStatusColor(atsScore.status) }} aria-label={`Status: ${atsScore.status} Compatibility`}>
            {atsScore.status} Compatibility
          </div>
          <p className={styles.message}>{getStatusMessage(atsScore.overallScore)}</p>
        </div>
      </div>

      <div className={styles.breakdown}>
        <h4>Score Breakdown</h4>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <span className={styles.label}>Technical Keywords</span>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{
                  width: `${Math.min(100, (atsScore.sections.keywords / 15) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--color-accent) 0%, var(--color-primary) 100%)',
                }}
              />
            </div>
            <span className={styles.value}>{atsScore.sections.keywords} found</span>
          </div>

          <div className={styles.metric}>
            <span className={styles.label}>Action Verbs</span>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{
                  width: `${Math.min(100, (atsScore.sections.actionVerbs / 10) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                }}
              />
            </div>
            <span className={styles.value}>{atsScore.sections.actionVerbs} found</span>
          </div>

          <div className={styles.metric}>
            <span className={styles.label}>Quantified Achievements</span>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{
                  width: `${Math.min(100, (atsScore.sections.measurements / 5) * 100)}%`,
                  background: 'var(--color-success)',
                }}
              />
            </div>
            <span className={styles.value}>{atsScore.sections.measurements} found</span>
          </div>

          <div className={styles.metric}>
            <span className={styles.label}>Formatting Quality</span>
            <div className={styles.bar}>
              <div
                className={styles.fill}
                style={{
                  width: `${atsScore.sections.formatting}%`,
                  background: 'var(--color-accent)',
                }}
              />
            </div>
            <span className={styles.value}>{atsScore.sections.formatting}/100</span>
          </div>
        </div>
      </div>

      {/* Missing keyword suggestions — most actionable ATS improvement */}
      {atsScore.missingKeywords.length > 0 && (
        <div className={styles.improvements}>
          <h4>🔍 Add These Keywords to Boost Your ATS Score</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            These high-value terms are absent from your evidence. Adding them to your descriptions (with real context) can significantly increase your ATS ranking.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {atsScore.missingKeywords.map((kw, idx) => (
              <span key={idx} style={{
                background: 'var(--color-warning-light)',
                color: 'var(--color-warning)',
                border: '1px solid var(--color-warning)',
                borderRadius: '12px',
                padding: '3px 10px',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {atsScore.improvement.length > 0 && (
        <div className={styles.improvements}>
          <h4>🎯 How to Improve Your ATS Score</h4>
          <ul>
            {atsScore.improvement.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {atsScore.recommendations.length > 0 && (
        <div className={styles.recommendations}>
          <h4>💡 Specific Recommendations</h4>
          <ul>
            {atsScore.recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.note}>
        <strong>Note:</strong> This ATS score simulates major tracking systems like Applicant Tracking
        Systems (Workday, Taleo, iCIMS). Different systems may weight factors differently. Always
        review job descriptions for specific keywords to incorporate.
      </div>
    </section>
  );
}
