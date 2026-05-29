import { CohortInsight } from '../types/evidence';
import styles from './CohortInsightCard.module.css';

interface Props {
  cohort: CohortInsight;
}

export function CohortInsightCard({ cohort }: Props) {
  const internshipReadyPct = Math.round((cohort.readinessDistribution.internshipReady / cohort.totalStudents) * 100);
  const developingPct = Math.round((cohort.readinessDistribution.developing / cohort.totalStudents) * 100);
  const emergingPct = Math.round((cohort.readinessDistribution.emerging / cohort.totalStudents) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>Cohort Readiness Overview</h3>
        <p className={styles.subtitle}>{cohort.totalStudents} students analyzed</p>

        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--color-success)' }}>
              {internshipReadyPct}%
            </div>
            <div className={styles.statLabel}>
              Internship-Ready
              <br />
              ({cohort.readinessDistribution.internshipReady} students)
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--color-warning)' }}>
              {developingPct}%
            </div>
            <div className={styles.statLabel}>
              Developing
              <br />
              ({cohort.readinessDistribution.developing} students)
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statValue} style={{ color: 'var(--color-danger)' }}>
              {emergingPct}%
            </div>
            <div className={styles.statLabel}>
              Emerging
              <br />
              ({cohort.readinessDistribution.emerging} students)
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Top Skill Gaps Across Cohort</h3>

        {cohort.topGaps.map((gap, idx) => (
          <div key={idx} className={styles.gapItem}>
            <div className={styles.gapName}>{gap.dimension}</div>
            <div className={styles.gapBar}>
              <div
                className={styles.gapFill}
                style={{
                  width: `${gap.percentage}%`,
                  backgroundColor: gap.percentage > 50 ? 'var(--color-danger)' : gap.percentage > 30 ? 'var(--color-warning)' : 'var(--color-success)',
                }}
              ></div>
            </div>
            <div className={styles.gapStat}>
              {gap.studentCount} students ({gap.percentage}%)
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3>Suggested University Interventions</h3>

        {cohort.suggestedInterventions.map((intervention, idx) => (
          <div key={idx} className={styles.intervention}>
            <div className={styles.interventionHeader}>
              <h4>{intervention.title}</h4>
              <span className={styles.interventionTarget}>Target: {intervention.targetStudents} students</span>
            </div>
            <p className={styles.interventionDescription}>{intervention.description}</p>
            <div className={styles.interventionImpact}>
              <strong>Impact:</strong> {intervention.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
