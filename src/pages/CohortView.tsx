import { useState, useMemo } from 'react';
import { CohortInsight, ReadinessProfile, StudentProfile } from '../types/evidence';
import { CohortInsightCard } from '../components/CohortInsightCard';
import { submitToCohort } from '../utils/cohortApi';
import styles from './CohortView.module.css';

interface Props {
  cohort: CohortInsight;
  readinessProfile: ReadinessProfile;
  studentProfile: StudentProfile;
  onBack: () => void;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type ViewMode = 'student' | 'university' | 'employer';

function getShortlistDecision(score: number): {
  verdict: string;
  color: string;
  bg: string;
  border: string;
  reasons: string[];
  concern: string;
} {
  if (score >= 70) {
    return {
      verdict: '✅ Shortlist',
      color: 'var(--color-success)',
      bg: 'var(--color-success-light)',
      border: 'var(--color-success)',
      reasons: [
        'Evidence-backed skills — not just a list of buzzwords',
        'Score indicates hands-on project depth',
        'Portfolio/work experience demonstrates initiative',
      ],
      concern: 'Follow up: verify scope of projects in phone screen.',
    };
  }
  if (score >= 50) {
    return {
      verdict: '🟡 Maybe — Phone Screen First',
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-light)',
      border: 'var(--color-warning)',
      reasons: [
        'Decent foundation but gaps in key dimensions',
        'Could be strong with the right mentorship',
        'Promising track record, needs verification',
      ],
      concern: 'Focus screen on: specific technical depth and collaboration style.',
    };
  }
  return {
    verdict: '❌ Not Yet — Encourage Reapply',
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-light)',
    border: 'var(--color-danger)',
    reasons: [
      'Score suggests gaps in core technical dimensions',
      'Limited evidence of real-world project experience',
      'Recommend completing 1–2 more substantial projects',
    ],
    concern: 'Encourage: apply again after building 1 deployed project or internship.',
  };
}

export function CohortView({ cohort, readinessProfile, studentProfile, onBack }: Props) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [viewMode, setViewMode] = useState<ViewMode>('student');

  const shortlist = useMemo(() => getShortlistDecision(readinessProfile.overall), [readinessProfile.overall]);

  // Stable cohort benchmark averages per dimension (not random)
  const cohortBenchmarks = useMemo<Record<string, number>>(() => ({
    'Technical Skills': 52,
    'Portfolio Evidence': 48,
    'Work Readiness': 44,
    'Communication & Documentation': 50,
    'Production Practices': 41,
    'Role-Specific Fit (Software Engineer)': 55,
  }), []);

  // Top 3 strong dimensions for recruiter card
  const topDimensions = useMemo(
    () => [...readinessProfile.dimensions].sort((a, b) => b.score - a.score).slice(0, 3),
    [readinessProfile.dimensions]
  );

  // Weak dimension to flag
  const weakDimension = useMemo(
    () => [...readinessProfile.dimensions].sort((a, b) => a.score - b.score)[0],
    [readinessProfile.dimensions]
  );

  async function handleSubmit() {
    setSubmitState('loading');
    const ok = await submitToCohort(readinessProfile);
    setSubmitState(ok ? 'success' : 'error');
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>University Cohort Dashboard</h2>
          <p>See how your readiness compares across student, university, and employer views.</p>
        </div>

        {/* Perspective Toggle */}
        <div className={styles.toggleRow} role="tablist" aria-label="Cohort view perspective">
          <button
            className={viewMode === 'student' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewMode('student')}
            role="tab"
            aria-selected={viewMode === 'student'}
            aria-controls="cohort-panel"
          >
            🎓 Student View
          </button>
          <button
            className={viewMode === 'university' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewMode('university')}
            role="tab"
            aria-selected={viewMode === 'university'}
            aria-controls="cohort-panel"
          >
            🏫 University View
          </button>
          <button
            className={viewMode === 'employer' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewMode('employer')}
            role="tab"
            aria-selected={viewMode === 'employer'}
            aria-controls="cohort-panel"
          >
            🏢 Employer View
          </button>
        </div>

        {/* ── STUDENT VIEW ── */}
        {viewMode === 'student' && (
          <div id="cohort-panel" role="tabpanel" aria-label="Student perspective">
            {/* Your score in context */}
            <div className={styles.studentContext}>
              <h3>📍 Where You Stand</h3>
              <div className={styles.scoreRow}>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreValue}>{readinessProfile.overall}/100</div>
                  <div className={styles.scoreLabel}>Your Overall Score</div>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreValue} style={{ color: 'var(--color-success)' }}>
                    {cohort.readinessDistribution.internshipReady}%
                  </div>
                  <div className={styles.scoreLabel}>Cohort Internship-Ready</div>
                </div>
                <div className={styles.scoreCard}>
                  <div className={styles.scoreValue} style={{ color: 'var(--color-warning)' }}>
                    {cohort.readinessDistribution.developing}%
                  </div>
                  <div className={styles.scoreLabel}>Still Developing</div>
                </div>
              </div>

              <div className={styles.dimensionCompare}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
                  Your Dimensions vs Cohort Average
                </h4>
                {readinessProfile.dimensions.map((dim) => {
                  const cohortAvg = cohortBenchmarks[dim.dimension] ?? 48;
                  const diff = dim.score - cohortAvg;
                  return (
                    <div key={dim.dimension} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>{dim.dimension}</span>
                        <span style={{ color: diff >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '700' }}>
                          You: {dim.score} &nbsp;
                          <span style={{ opacity: 0.6, fontWeight: '400' }}>Cohort avg: {cohortAvg}</span>
                          &nbsp; ({diff >= 0 ? '+' : ''}{diff})
                        </span>
                      </div>
                      <div style={{ background: 'var(--color-surface-hover)', borderRadius: '4px', height: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${cohortAvg}%`, background: 'var(--color-border)', borderRadius: '4px' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${dim.score}%`, background: 'linear-gradient(90deg, var(--color-accent), var(--color-primary))', borderRadius: '4px', opacity: 0.85 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <CohortInsightCard cohort={cohort} />

            <div className={styles.submitSection}>
              <h3>Contribute Your Score</h3>
              <p>Share anonymous dimension scores to help future students benchmark realistically.</p>
              {submitState === 'idle' && (
                <button className={styles.submitBtn} onClick={handleSubmit}>
                  Submit to Cohort (Anonymous)
                </button>
              )}
              {submitState === 'loading' && (
                <button className={styles.submitBtn} disabled>Submitting…</button>
              )}
              {submitState === 'success' && (
                <p className={styles.submitSuccess}>✓ Submitted! Your profile has been added. Thank you.</p>
              )}
              {submitState === 'error' && (
                <p className={styles.submitError}>Something went wrong — please try again.</p>
              )}
            </div>
          </div>
        )}

        {/* ── UNIVERSITY VIEW ── */}
        {viewMode === 'university' && (
          <div id="cohort-panel" role="tabpanel" aria-label="University perspective">
            <div className={styles.context}>
              <h3>Why Universities Care About Readiness</h3>
              <p>PathLens surfaces readiness gaps at Year 2–3 — early enough to act, not after the first rejection.</p>
            </div>

            <CohortInsightCard cohort={cohort} />

            <div className={styles.actionList}>
              <h3>What Universities Do With This Data</h3>
              <div className={styles.actionGrid}>
                {[
                  {
                    n: '1',
                    title: 'Identify Priority Gaps',
                    body: '64% lack Production Practices? That\'s a curriculum signal, not a student problem.',
                  },
                  {
                    n: '2',
                    title: 'Targeted Interventions',
                    body: 'Offer specific workshops (e.g. "GitHub Actions for Year 3s") based on cohort data.',
                  },
                  {
                    n: '3',
                    title: 'Track Impact Over Time',
                    body: 'Re-run after an intervention — prove the workshop worked with dimension score shifts.',
                  },
                  {
                    n: '4',
                    title: 'Early Proactive Support',
                    body: 'Reach out to Year 2s with low Portfolio scores before internship season begins.',
                  },
                ].map((item) => (
                  <div key={item.n} className={styles.action}>
                    <div className={styles.actionNum}>{item.n}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.endSection}>
              <h3>PathLens as a Career OS</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                <span style={{ padding: '6px 14px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>🎓 Students — see & close gaps</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>🏫 Universities — intervene early</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>🏢 Employers — evidence-backed hiring</span>
              </div>
            </div>
          </div>
        )}

        {/* ── EMPLOYER VIEW ── */}
        {viewMode === 'employer' && (
          <div id="cohort-panel" role="tabpanel" aria-label="Employer perspective" className={styles.employerView}>
            <div className={styles.employerIntro}>
              <p>Evidence-backed, score-verified — not a self-rated skills list.</p>
            </div>

            {/* Recruiter Card */}
            <div className={styles.recruiterCard}>
              <div className={styles.recruiterCardHeader}>
                <div className={styles.recruiterAvatar}>
                  {studentProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.recruiterCardInfo}>
                  <h3 className={styles.recruiterName}>{studentProfile.name}</h3>
                  <p className={styles.recruiterMeta}>
                    {studentProfile.major} · Year {studentProfile.year}
                    {studentProfile.university ? ` · ${studentProfile.university}` : ''}
                  </p>
                  <p className={styles.recruiterTarget}>
                    Targeting: <strong>{studentProfile.targetRole}</strong>
                  </p>
                </div>
                <div className={styles.recruiterScore}>
                  <div className={styles.recruiterScoreNum}>{readinessProfile.overall}</div>
                  <div className={styles.recruiterScoreLabel}>PathLens Score</div>
                  <div className={styles.recruiterScoreLevel}>{readinessProfile.level}</div>
                </div>
              </div>

              <div className={styles.recruiterDivider} />

              {/* Top strengths */}
              <div className={styles.recruiterSection}>
                <div className={styles.recruiterSectionLabel}>🏆 Top Strengths (Evidence-Backed)</div>
                <div className={styles.recruiterStrengths}>
                  {topDimensions.map((dim) => (
                    <div key={dim.dimension} className={styles.recruiterStrengthItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className={styles.recruiterStrengthName}>{dim.dimension}</span>
                        <span className={styles.recruiterStrengthScore}
                          style={{ color: dim.score >= 70 ? 'var(--color-success)' : dim.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                          {dim.score}/100
                        </span>
                      </div>
                      <div style={{ background: 'var(--color-border)', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${dim.score}%`,
                          background: dim.score >= 70 ? 'var(--color-success)' : dim.score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)',
                          borderRadius: '4px',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gap flag */}
              {weakDimension && weakDimension.score < 60 && (
                <div className={styles.recruiterSection}>
                  <div className={styles.recruiterSectionLabel}>⚠️ Area to Probe in Interview</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <strong>{weakDimension.dimension}</strong> — Score {weakDimension.score}/100 ({weakDimension.status}).
                    {' '}Consider asking about specific projects related to this area.
                  </div>
                </div>
              )}
            </div>

            {/* Shortlist Decision Panel */}
            <div
              className={styles.shortlistPanel}
              style={{ borderColor: shortlist.border, background: shortlist.bg }}
            >
              <div className={styles.shortlistVerdict} style={{ color: shortlist.color }}>
                {shortlist.verdict}
              </div>
              <ul className={styles.shortlistReasons}>
                {shortlist.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className={styles.shortlistConcern}>
                <strong>Note:</strong> {shortlist.concern}
              </div>
            </div>

            {/* Why PathLens beats resume */}
            <div className={styles.employerWhy}>
              <h4>Why recruiters prefer PathLens profiles over resumes</h4>
              <div className={styles.employerWhyGrid}>
                <div className={styles.employerWhyItem}>
                  <strong>📋 Resume says:</strong> "Proficient in Python, React, Docker"
                </div>
                <div className={styles.employerWhyItem}>
                  <strong>✅ PathLens shows:</strong> Python extracted from 3 verified projects; Docker used in a deployed CI/CD pipeline
                </div>
                <div className={styles.employerWhyItem}>
                  <strong>📋 Resume says:</strong> "Team player with strong communication"
                </div>
                <div className={styles.employerWhyItem}>
                  <strong>✅ PathLens shows:</strong> Communication dimension scored {readinessProfile.dimensions.find(d => d.dimension.includes('Communication'))?.score ?? 'N/A'}/100 from code review, documentation, and presentation evidence
                </div>
              </div>
            </div>

            <div className={styles.employerDisclaimer}>
              Simulation of employer view. Module 04 integrates this directly into job matching.
            </div>
          </div>
        )}

        <div className={styles.buttons}>
          <button className={styles.backButton} onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
