import { useState, useMemo } from 'react';
import { ReadinessProfile } from '../types/evidence';
import { DIMENSION_WEIGHTS } from '../utils/readinessScoring';
import styles from './TrajectorySimulator.module.css';

interface Props {
  profile: ReadinessProfile;
  onBack: () => void;
}

const ROLE_PROFILES: Record<string, { description: string; required: Record<string, number> }> = {
  'Software Engineer': {
    description: 'Backend, full-stack, or systems roles at tech companies',
    required: {
      'Technical Skills': 70,
      'Portfolio Evidence': 65,
      'Work Readiness': 60,
      'Communication & Documentation': 55,
      'Production Practices': 55,
      'Role-Specific Fit (Software Engineer)': 70,
    },
  },
  'Data Engineer / Analyst': {
    description: 'Data pipelines, analytics, BI roles across industries',
    required: {
      'Technical Skills': 65,
      'Portfolio Evidence': 60,
      'Work Readiness': 55,
      'Communication & Documentation': 65,
      'Production Practices': 50,
      'Role-Specific Fit (Software Engineer)': 55,
    },
  },
  'Product Manager (Technical)': {
    description: 'PM roles that require technical credibility',
    required: {
      'Technical Skills': 55,
      'Portfolio Evidence': 60,
      'Work Readiness': 70,
      'Communication & Documentation': 80,
      'Production Practices': 45,
      'Role-Specific Fit (Software Engineer)': 50,
    },
  },
};

const IMPROVEMENT_ACTIONS: Record<string, { title: string; weeks: number; scoreDelta: number }[]> = {
  'Technical Skills': [
    { title: 'Complete a LeetCode 30-day challenge', weeks: 4, scoreDelta: 8 },
    { title: 'Build a side project in a new framework', weeks: 6, scoreDelta: 12 },
    { title: 'Earn a relevant certification (AWS/GCP/Azure)', weeks: 8, scoreDelta: 10 },
  ],
  'Portfolio Evidence': [
    { title: 'Deploy one existing project to a live URL', weeks: 1, scoreDelta: 10 },
    { title: 'Build a capstone project with a clear problem statement', weeks: 6, scoreDelta: 15 },
    { title: 'Write detailed README files for top 3 projects', weeks: 1, scoreDelta: 6 },
  ],
  'Work Readiness': [
    { title: 'Apply for a part-time or freelance engagement', weeks: 2, scoreDelta: 12 },
    { title: 'Join an open-source project', weeks: 3, scoreDelta: 8 },
    { title: 'Complete a virtual internship programme', weeks: 6, scoreDelta: 15 },
  ],
  'Communication & Documentation': [
    { title: 'Write a project post-mortem blog post', weeks: 1, scoreDelta: 8 },
    { title: 'Record a 3-min demo walkthrough of your best project', weeks: 1, scoreDelta: 6 },
    { title: 'Create a technical README with architecture diagrams', weeks: 2, scoreDelta: 10 },
  ],
  'Production Practices': [
    { title: 'Add GitHub Actions CI to one project (run tests on push)', weeks: 1, scoreDelta: 12 },
    { title: 'Add unit tests reaching 70%+ coverage on one project', weeks: 2, scoreDelta: 10 },
    { title: 'Containerise a project with Docker + docker-compose', weeks: 2, scoreDelta: 8 },
  ],
  'Role-Specific Fit (Software Engineer)': [
    { title: 'Build a system-design mini project (queue, cache, API)', weeks: 4, scoreDelta: 10 },
    { title: 'Contribute to an open-source TypeScript/Python project', weeks: 3, scoreDelta: 8 },
    { title: 'Complete a backend-focused project with a live API', weeks: 5, scoreDelta: 12 },
  ],
};

function getStatusColor(score: number) {
  if (score >= 75) return 'var(--color-success)';
  if (score >= 55) return 'var(--color-primary)';
  if (score >= 35) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export function TrajectorySimulator({ profile, onBack }: Props) {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  const roleTarget = ROLE_PROFILES[targetRole];

  // Compute projected scores
  const projectedScores = useMemo(() => {
    const deltas: Record<string, number> = {};
    for (const dim of profile.dimensions) {
      let total = 0;
      const actions = IMPROVEMENT_ACTIONS[dim.dimension] || [];
      for (const action of actions) {
        if (selectedActions.has(`${dim.dimension}::${action.title}`)) {
          total += action.scoreDelta;
        }
      }
      deltas[dim.dimension] = total;
    }
    return deltas;
  }, [profile.dimensions, selectedActions]);

  // Use same weighted formula as readinessScoring.ts for consistency
  const projectedOverall = useMemo(() => {
    return Math.round(
      profile.dimensions.reduce((acc, d) => {
        const projected = Math.min(100, d.score + (projectedScores[d.dimension] || 0));
        const weight = DIMENSION_WEIGHTS[d.dimension] ?? (1 / profile.dimensions.length);
        return acc + projected * weight;
      }, 0)
    );
  }, [profile.dimensions, projectedScores]);

  const totalWeeks = useMemo(() => {
    let max = 0;
    for (const dim of profile.dimensions) {
      const actions = IMPROVEMENT_ACTIONS[dim.dimension] || [];
      for (const action of actions) {
        if (selectedActions.has(`${dim.dimension}::${action.title}`)) {
          max = Math.max(max, action.weeks);
        }
      }
    }
    return max;
  }, [profile.dimensions, selectedActions]);

  function toggleAction(dim: string, title: string) {
    const key = `${dim}::${title}`;
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const roleGaps = profile.dimensions.filter(
    (d) => d.score < (roleTarget.required[d.dimension] || 60)
  );

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <button className={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>

        <div className={styles.headerBlock}>
          <h2>🧭 Trajectory Simulator</h2>
          <p>Select actions you plan to take, and see how your readiness score projects forward — before you commit.</p>
        </div>

        {/* Role Selector */}
        <div className={styles.roleSelector}>
          <label className={styles.roleLabel}>Target Role:</label>
          <div className={styles.roleButtons}>
            {Object.keys(ROLE_PROFILES).map((role) => (
              <button
                key={role}
                className={targetRole === role ? styles.roleActive : styles.roleBtn}
                onClick={() => setTargetRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
          <p className={styles.roleDesc}>{roleTarget.description}</p>
        </div>

        {/* Score projection header */}
        <div className={styles.projectionBar}>
          <div className={styles.projScore}>
            <span className={styles.projLabel}>Current</span>
            <span className={styles.projValue}>{profile.overall}</span>
          </div>
          <div className={styles.projArrow}>→</div>
          <div className={styles.projScore}>
            <span className={styles.projLabel}>Projected</span>
            <span className={styles.projValueBig} style={{ color: projectedOverall > profile.overall ? 'var(--color-success)' : 'var(--color-text)' }}>
              {projectedOverall}
            </span>
          </div>
          <div className={styles.projArrow} />
          <div className={styles.projScore}>
            <span className={styles.projLabel}>Est. Timeline</span>
            <span className={styles.projValue}>{totalWeeks > 0 ? `~${totalWeeks}w` : '—'}</span>
          </div>
        </div>

        {roleGaps.length > 0 && (
          <div className={styles.gapAlert}>
            <strong>⚠️ Gaps vs {targetRole}:</strong>{' '}
            {roleGaps.map((d) => `${d.dimension} (need ${roleTarget.required[d.dimension]}, have ${d.score})`).join(' · ')}
          </div>
        )}

        {/* Dimension action pickers */}
        <div className={styles.dimensions}>
          {profile.dimensions.map((dim) => {
            const projected = Math.min(100, dim.score + (projectedScores[dim.dimension] || 0));
            const required = roleTarget.required[dim.dimension] || 60;
            const actions = IMPROVEMENT_ACTIONS[dim.dimension] || [];

            return (
              <div key={dim.dimension} className={styles.dimCard}>
                <div className={styles.dimHeader}>
                  <span className={styles.dimName}>{dim.dimension}</span>
                  <span className={styles.dimScores}>
                    <span style={{ color: getStatusColor(dim.score) }}>{dim.score}</span>
                    {projectedScores[dim.dimension] ? (
                      <span style={{ color: 'var(--color-success)', fontWeight: '700' }}>
                        {' '}→ {projected} (+{projectedScores[dim.dimension]})
                      </span>
                    ) : null}
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: '400' }}> / target {required}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${dim.score}%`, background: getStatusColor(dim.score) }} />
                  {projected > dim.score && (
                    <div className={styles.barProjected} style={{ left: `${dim.score}%`, width: `${projected - dim.score}%` }} />
                  )}
                  <div className={styles.barTarget} style={{ left: `${Math.min(required, 100)}%` }} title={`Role target: ${required}`} />
                </div>

                <div className={styles.actionList}>
                  {actions.map((action) => {
                    const key = `${dim.dimension}::${action.title}`;
                    const checked = selectedActions.has(key);
                    return (
                      <label key={action.title} className={`${styles.actionItem} ${checked ? styles.actionChecked : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAction(dim.dimension, action.title)}
                          className={styles.actionCheckbox}
                        />
                        <span className={styles.actionText}>{action.title}</span>
                        <span className={styles.actionMeta}>{action.weeks}w · +{action.scoreDelta}pts</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedActions.size > 0 && (
          <div className={styles.summary}>
            <h3>📋 Your Selected Path</h3>
            <p>
              By completing <strong>{selectedActions.size} action{selectedActions.size > 1 ? 's' : ''}</strong> over
              approximately <strong>~{totalWeeks} weeks</strong>, your projected score moves from{' '}
              <strong>{profile.overall}</strong> → <strong style={{ color: 'var(--color-success)' }}>{projectedOverall}/100</strong>.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
              Note: projections are estimates based on evidence patterns. Actual improvement depends on depth of execution.
            </p>
          </div>
        )}

        <div style={{ paddingTop: '28px', borderTop: '1px solid var(--color-divider)', textAlign: 'center' }}>
          <button className={styles.backBtn} onClick={onBack}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
