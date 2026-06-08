import { useMemo, useState } from 'react';
import { ReadinessProfile } from '../types/evidence';
import { DIMENSION_WEIGHTS } from '../utils/readinessScoring';
import styles from './TrajectorySimulator.module.css';

interface Props {
  profile: ReadinessProfile;
  onBack: () => void;
}

type RouteId = 'safe' | 'stretch' | 'repair';

interface RoleProfile {
  title: string;
  description: string;
  marketSignal: string;
  required: Record<string, number>;
  beforeClaim: string;
  afterClaim: string;
}

interface ImprovementAction {
  title: string;
  weeks: number;
  scoreDelta: number;
  evidenceProduced: string;
  applicationClaim: string;
}

const ROLE_PROFILES: Record<string, RoleProfile> = {
  'Software Engineer': {
    title: 'Software Engineer',
    description: 'Backend, full-stack, or systems roles where production proof matters.',
    marketSignal: 'Best when the profile shows deployed projects, tests, APIs, and clear ownership.',
    required: {
      'Technical Skills': 70,
      'Portfolio Evidence': 65,
      'Work Readiness': 60,
      'Communication & Documentation': 55,
      'Production Practices': 55,
      'Role-Specific Fit (Software Engineer)': 70,
    },
    beforeClaim: 'I know React and Python.',
    afterClaim: 'Built, documented, tested, and deployed a working full-stack system with a visible source trail.',
  },
  'Data Engineer': {
    title: 'Data Engineer',
    description: 'Pipeline, warehouse, streaming, analytics, and data platform roles.',
    marketSignal: 'Best when the profile proves SQL/Python depth, pipeline ownership, and data quality controls.',
    required: {
      'Technical Skills': 68,
      'Portfolio Evidence': 62,
      'Work Readiness': 58,
      'Communication & Documentation': 62,
      'Production Practices': 56,
      'Role-Specific Fit (Software Engineer)': 58,
    },
    beforeClaim: 'I can work with data.',
    afterClaim: 'Built a reproducible data pipeline with validation checks, dashboard output, and documented business impact.',
  },
  'Technical Product Manager': {
    title: 'Technical Product Manager',
    description: 'Product roles that need technical judgment, stakeholder clarity, and market evidence.',
    marketSignal: 'Best when the profile proves user research, trade-off decisions, delivery ownership, and metrics.',
    required: {
      'Technical Skills': 55,
      'Portfolio Evidence': 62,
      'Work Readiness': 70,
      'Communication & Documentation': 80,
      'Production Practices': 45,
      'Role-Specific Fit (Software Engineer)': 52,
    },
    beforeClaim: 'I am interested in product.',
    afterClaim: 'Led a product decision from user evidence to shipped scope, with technical trade-offs and measurable outcome.',
  },
  'AI Platform Engineer': {
    title: 'AI Platform Engineer',
    description: 'AI tooling, LLM app, model deployment, and infrastructure-adjacent roles.',
    marketSignal: 'Best when AI work is not a demo only: evaluation, deployment, guardrails, and reliability proof matter.',
    required: {
      'Technical Skills': 76,
      'Portfolio Evidence': 68,
      'Work Readiness': 62,
      'Communication & Documentation': 60,
      'Production Practices': 68,
      'Role-Specific Fit (Software Engineer)': 72,
    },
    beforeClaim: 'I built an AI project.',
    afterClaim: 'Built an AI workflow with evaluation metrics, deployment notes, failure cases, and governance documentation.',
  },
};

const IMPROVEMENT_ACTIONS: Record<string, ImprovementAction[]> = {
  'Technical Skills': [
    {
      title: 'Build one role-specific technical artifact',
      weeks: 4,
      scoreDelta: 10,
      evidenceProduced: 'GitHub repo with implementation notes',
      applicationClaim: 'Implemented the core system myself and can explain the main technical trade-offs.',
    },
    {
      title: 'Complete a focused 30-day coding sprint',
      weeks: 4,
      scoreDelta: 8,
      evidenceProduced: 'Public practice log plus solved problem set',
      applicationClaim: 'Maintained a consistent technical practice loop and can show the progression.',
    },
  ],
  'Portfolio Evidence': [
    {
      title: 'Deploy one existing project to a live URL',
      weeks: 1,
      scoreDelta: 10,
      evidenceProduced: 'Live URL, README, screenshots, source link',
      applicationClaim: 'Converted a local project into a reviewable application artifact.',
    },
    {
      title: 'Write a proof-first portfolio case study',
      weeks: 1,
      scoreDelta: 8,
      evidenceProduced: 'Case study with problem, stack, role, result, and proof links',
      applicationClaim: 'Documented what I owned, what changed, and where the reviewer can verify it.',
    },
  ],
  'Work Readiness': [
    {
      title: 'Complete a team or client-style delivery sprint',
      weeks: 3,
      scoreDelta: 12,
      evidenceProduced: 'Sprint board, review notes, merged work, and feedback',
      applicationClaim: 'Worked through scope, feedback, delivery, and review instead of only solo building.',
    },
    {
      title: 'Contribute to one open-source issue',
      weeks: 3,
      scoreDelta: 8,
      evidenceProduced: 'Issue link, pull request, reviewer comments',
      applicationClaim: 'Collaborated inside an existing codebase and responded to review feedback.',
    },
  ],
  'Communication & Documentation': [
    {
      title: 'Create architecture README plus demo walkthrough',
      weeks: 2,
      scoreDelta: 10,
      evidenceProduced: 'Architecture diagram, README, 3-minute walkthrough',
      applicationClaim: 'Can explain system decisions clearly to engineers and non-engineers.',
    },
    {
      title: 'Write a post-mortem for one failed or unstable demo',
      weeks: 1,
      scoreDelta: 8,
      evidenceProduced: 'Failure analysis, fix list, and prevention plan',
      applicationClaim: 'Can reflect on production failure and explain how I would prevent it next time.',
    },
  ],
  'Production Practices': [
    {
      title: 'Add CI, tests, and deployment checks',
      weeks: 2,
      scoreDelta: 14,
      evidenceProduced: 'GitHub Actions run, test report, deployment checklist',
      applicationClaim: 'Added automated checks so the project is not just a local demo.',
    },
    {
      title: 'Add monitoring and failure notes to one project',
      weeks: 2,
      scoreDelta: 10,
      evidenceProduced: 'Error handling notes, uptime screenshot, known limitations',
      applicationClaim: 'Documented how the system behaves when something breaks.',
    },
  ],
  'Role-Specific Fit (Software Engineer)': [
    {
      title: 'Build a target-role mini project',
      weeks: 5,
      scoreDelta: 12,
      evidenceProduced: 'Role-aligned artifact with source, demo, and decision log',
      applicationClaim: 'Built proof that directly matches the target role instead of listing generic skills.',
    },
    {
      title: 'Map one job description into evidence claims',
      weeks: 1,
      scoreDelta: 6,
      evidenceProduced: 'JD-to-evidence claim table',
      applicationClaim: 'Can connect my evidence to the role requirements without exaggerating.',
    },
  ],
};

function getStatusColor(score: number) {
  if (score >= 75) return '#34d399';
  if (score >= 55) return '#60a5fa';
  if (score >= 35) return '#fbbf24';
  return '#fb7185';
}

function getActionKey(dimension: string, title: string) {
  return `${dimension}::${title}`;
}

export function TrajectorySimulator({ profile, onBack }: Props) {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [selectedRoute, setSelectedRoute] = useState<RouteId>('repair');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  const roleTarget = ROLE_PROFILES[targetRole];

  const projectedScores = useMemo(() => {
    const deltas: Record<string, number> = {};

    for (const dim of profile.dimensions) {
      const actions = IMPROVEMENT_ACTIONS[dim.dimension] || [];
      deltas[dim.dimension] = actions.reduce((sum, action) => {
        return selectedActions.has(getActionKey(dim.dimension, action.title)) ? sum + action.scoreDelta : sum;
      }, 0);
    }

    return deltas;
  }, [profile.dimensions, selectedActions]);

  const projectedOverall = useMemo(() => {
    return Math.round(
      profile.dimensions.reduce((acc, dim) => {
        const projected = Math.min(100, dim.score + (projectedScores[dim.dimension] || 0));
        const weight = DIMENSION_WEIGHTS[dim.dimension] ?? (1 / profile.dimensions.length);
        return acc + projected * weight;
      }, 0)
    );
  }, [profile.dimensions, projectedScores]);

  const selectedActionDetails = useMemo(() => {
    return profile.dimensions.flatMap((dim) => {
      return (IMPROVEMENT_ACTIONS[dim.dimension] || [])
        .filter((action) => selectedActions.has(getActionKey(dim.dimension, action.title)))
        .map((action) => ({ dimension: dim.dimension, ...action }));
    });
  }, [profile.dimensions, selectedActions]);

  const totalWeeks = selectedActionDetails.reduce((max, action) => Math.max(max, action.weeks), 0);

  const roleGaps = useMemo(() => {
    return profile.dimensions
      .map((dim) => {
        const required = roleTarget.required[dim.dimension] || 60;
        const projected = Math.min(100, dim.score + (projectedScores[dim.dimension] || 0));
        return { ...dim, required, gap: Math.max(0, required - dim.score), projected };
      })
      .filter((dim) => dim.gap > 0)
      .sort((a, b) => b.gap - a.gap);
  }, [profile.dimensions, projectedScores, roleTarget.required]);

  const primaryGap = roleGaps[0] ?? [...profile.dimensions].sort((a, b) => a.score - b.score)[0];
  const primaryRequired = primaryGap ? roleTarget.required[primaryGap.dimension] || 60 : 60;
  const primaryProjected = primaryGap ? Math.min(100, primaryGap.score + (projectedScores[primaryGap.dimension] || 0)) : profile.overall;
  const gateUnlocked = primaryProjected >= primaryRequired;

  const routeOptions = [
    {
      id: 'repair' as const,
      title: 'Repair Route',
      label: 'Fix the blocker first',
      weeks: '2-4 weeks',
      payoff: '+10-18 readiness',
      summary: `Start with ${primaryGap?.dimension || 'the weakest signal'} so the profile stops leaking trust.`,
    },
    {
      id: 'safe' as const,
      title: 'Safe Route',
      label: 'Fastest application-ready path',
      weeks: '1-3 weeks',
      payoff: '+6-12 readiness',
      summary: 'Polish proof you already have: live links, README, source trail, and interview story.',
    },
    {
      id: 'stretch' as const,
      title: 'Stretch Route',
      label: 'Higher ceiling, more proof needed',
      weeks: '5-8 weeks',
      payoff: '+15-25 readiness',
      summary: `Build a stronger artifact for ${roleTarget.title} and defend the harder role requirements.`,
    },
  ];

  const recommendedKeys = useMemo(() => {
    const gapAction = primaryGap ? (IMPROVEMENT_ACTIONS[primaryGap.dimension] || [])[0] : undefined;
    const portfolioAction = (IMPROVEMENT_ACTIONS['Portfolio Evidence'] || [])[0];
    const commsAction = (IMPROVEMENT_ACTIONS['Communication & Documentation'] || [])[0];
    return [gapAction && primaryGap ? getActionKey(primaryGap.dimension, gapAction.title) : '', getActionKey('Portfolio Evidence', portfolioAction.title), getActionKey('Communication & Documentation', commsAction.title)].filter(Boolean);
  }, [primaryGap]);

  function toggleAction(dim: string, title: string) {
    const key = getActionKey(dim, title);
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function applyRecommendedSprint() {
    setSelectedActions(new Set(recommendedKeys));
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <button className={styles.backBtn} onClick={onBack}>Back to Dashboard</button>

        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Paths page</p>
            <h2>Career Route Board</h2>
            <p>
              Pick a destination role. PathLens turns the readiness profile into a route: blocker gate,
              proof sprint, application claim, and interview story.
            </p>
          </div>
          <div className={styles.scoreDial}>
            <span>{profile.overall}</span>
            <small>current</small>
          </div>
        </section>

        <section className={styles.destinationGrid} aria-label="Destination roles">
          {Object.values(ROLE_PROFILES).map((role) => {
            const active = targetRole === role.title;
            return (
              <button
                key={role.title}
                type="button"
                className={`${styles.destinationCard} ${active ? styles.destinationActive : ''}`}
                onClick={() => setTargetRole(role.title)}
              >
                <span>Destination</span>
                <strong>{role.title}</strong>
                <small>{role.description}</small>
              </button>
            );
          })}
        </section>

        <section className={styles.routeMap}>
          <div className={styles.mapHeader}>
            <div>
              <p className={styles.eyebrow}>Selected destination</p>
              <h3>{roleTarget.title}</h3>
              <p>{roleTarget.marketSignal}</p>
            </div>
            <div className={styles.projectionCard}>
              <span>{profile.overall}</span>
              <b>to</b>
              <strong>{projectedOverall}</strong>
              <small>{totalWeeks > 0 ? `about ${totalWeeks} weeks` : 'choose sprint cards'}</small>
            </div>
          </div>

          <div className={styles.routeLine} aria-label="Career route map">
            {[
              ['Current Evidence', `${profile.allExtractedSkills.length} skill signals`],
              ['Blocker Gate', primaryGap ? `${primaryGap.dimension}: ${primaryGap.score}/${primaryRequired}` : 'No blocker'],
              ['Proof Sprint', `${selectedActions.size || 0} selected actions`],
              ['Portfolio Artifact', selectedActionDetails[0]?.evidenceProduced || 'No artifact selected'],
              ['Interview Story', selectedActionDetails[0]?.applicationClaim || 'Story appears after sprint selection'],
              ['Application Ready', gateUnlocked ? 'Gate unlocked' : 'Still blocked'],
            ].map(([title, subtitle], index) => (
              <div key={title} className={`${styles.routeStop} ${index === 1 && !gateUnlocked ? styles.routeBlocked : ''}`}>
                <div className={styles.routeDot}>{index + 1}</div>
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.twoColumn}>
          <div className={`${styles.panel} ${gateUnlocked ? styles.gateOpen : styles.gateClosed}`}>
            <p className={styles.eyebrow}>Blocker gate</p>
            <h3>{gateUnlocked ? 'Gate unlocked.' : `Blocked by ${primaryGap?.dimension || 'missing proof'}.`}</h3>
            <p>
              Current: <strong>{primaryGap?.score ?? profile.overall}/100</strong>. Required for {roleTarget.title}:{' '}
              <strong>{primaryRequired}/100</strong>. Projected after selected sprint:{' '}
              <strong>{primaryProjected}/100</strong>.
            </p>
            <button className={styles.primaryBtn} type="button" onClick={applyRecommendedSprint}>
              Apply recommended sprint
            </button>
          </div>

          <div className={styles.panel}>
            <p className={styles.eyebrow}>Before / after claim</p>
            <div className={styles.claimBox}>
              <span>Before</span>
              <p>{roleTarget.beforeClaim}</p>
            </div>
            <div className={styles.claimBoxStrong}>
              <span>After proof sprint</span>
              <p>{selectedActionDetails[0]?.applicationClaim || roleTarget.afterClaim}</p>
            </div>
          </div>
        </section>

        <section className={styles.routeChoices}>
          {routeOptions.map((route) => (
            <button
              key={route.id}
              type="button"
              className={`${styles.routeChoice} ${selectedRoute === route.id ? styles.routeChoiceActive : ''}`}
              onClick={() => setSelectedRoute(route.id)}
            >
              <span>{route.title}</span>
              <strong>{route.label}</strong>
              <p>{route.summary}</p>
              <small>{route.weeks} | {route.payoff}</small>
            </button>
          ))}
        </section>

        <section className={styles.sprintSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Proof sprint cards</p>
            <h3>Choose what evidence you will create next.</h3>
          </div>

          <div className={styles.sprintGrid}>
            {profile.dimensions.map((dim) => {
              const required = roleTarget.required[dim.dimension] || 60;
              const projected = Math.min(100, dim.score + (projectedScores[dim.dimension] || 0));
              const actions = IMPROVEMENT_ACTIONS[dim.dimension] || [];

              return (
                <article key={dim.dimension} className={styles.dimensionLane}>
                  <div className={styles.laneHeader}>
                    <div>
                      <strong>{dim.dimension}</strong>
                      <span>{dim.score} to {projected} / target {required}</span>
                    </div>
                    <i style={{ background: getStatusColor(dim.score) }} />
                  </div>

                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${dim.score}%`, background: getStatusColor(dim.score) }} />
                    {projected > dim.score && (
                      <div className={styles.barProjected} style={{ left: `${dim.score}%`, width: `${projected - dim.score}%` }} />
                    )}
                    <div className={styles.barTarget} style={{ left: `${Math.min(required, 100)}%` }} title={`Role target: ${required}`} />
                  </div>

                  <div className={styles.actionList}>
                    {actions.map((action) => {
                      const key = getActionKey(dim.dimension, action.title);
                      const checked = selectedActions.has(key);
                      return (
                        <button
                          key={action.title}
                          type="button"
                          className={`${styles.actionCard} ${checked ? styles.actionChecked : ''}`}
                          onClick={() => toggleAction(dim.dimension, action.title)}
                        >
                          <span>{checked ? 'Selected' : `${action.weeks} weeks`}</span>
                          <strong>{action.title}</strong>
                          <p>{action.evidenceProduced}</p>
                          <small>+{action.scoreDelta} readiness points</small>
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.outputPanel}>
          <div>
            <p className={styles.eyebrow}>Final output</p>
            <h3>Your application route summary</h3>
            <p>
              Route mode: <strong>{routeOptions.find((route) => route.id === selectedRoute)?.title}</strong>.
              Complete <strong>{selectedActions.size || 0}</strong> sprint card{selectedActions.size === 1 ? '' : 's'} in about{' '}
              <strong>{totalWeeks || 0} weeks</strong> to move from <strong>{profile.overall}</strong> to{' '}
              <strong>{projectedOverall}</strong>.
            </p>
          </div>
          <div className={styles.outputGrid}>
            <div>
              <span>Application bullet</span>
              <p>{selectedActionDetails[0]?.applicationClaim || roleTarget.afterClaim}</p>
            </div>
            <div>
              <span>Interview probe to prepare</span>
              <p>Explain what changed after the sprint, what proof exists, and what still needs work.</p>
            </div>
            <div>
              <span>Evidence artifact to add</span>
              <p>{selectedActionDetails[0]?.evidenceProduced || 'Live URL, source link, README, and short proof note.'}</p>
            </div>
          </div>
        </section>

        <div className={styles.footerNav}>
          <button className={styles.backBtn} onClick={onBack}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
