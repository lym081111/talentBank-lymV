import { Page } from '../types/navigation';
import styles from './Landing.module.css';

interface Props {
  userName?: string;
  onNavigate: (page: Page) => void;
  onBuildOwn: () => void;
}

const CAREER_OS_FEATURES = [
  ['Profile and resume builder', 'Create a live evidence profile from projects, internships, certificates, and resume items.'],
  ['Job listings', 'Browse mock roles across Malaysia, Singapore, Indonesia, and remote SEA teams.'],
  ['Keyword and job search', 'Search by skill, market, company, and work mode.'],
  ['Job matching', 'See fit score, matched evidence, blockers, and next actions before applying.'],
  ['Job applications', 'Save mock applications and generate evidence-backed application talking points.'],
  ['Candidate dashboard', 'Readiness score, skill extraction, gaps, paths, and application targets.'],
  ['Employer dashboard', 'Role-specific shortlist brief and interview probes from the same profile.'],
  ['University dashboard', 'Mock cohort intervention board for programme action.'],
];

export function Landing({ userName = 'Career OS user', onNavigate, onBuildOwn }: Props) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Career OS + Adaptive Readiness Profile</span>
          <h1>One jobsite flow. Evidence underneath every match.</h1>
          <p>
            Welcome, {userName}. PathLens is now framed as a proper Career OS prototype:
            build a profile, search jobs, apply with proof, and use readiness insights to improve before rejection.
          </p>
          <div className={styles.ctas}>
            <button className={styles.primary} onClick={() => onNavigate('jobs')}>
              Search jobs
            </button>
            <button className={styles.secondary} onClick={onBuildOwn}>
              Build profile
            </button>
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>Today in your Career OS</span>
            <strong>3 recommended actions</strong>
          </div>
          <div className={styles.actionList}>
            {[
              ['Complete your proof passport', 'Add links, outcomes, and verified evidence.'],
              ['Search matching roles', 'Use keyword search and compare role fit.'],
              ['Close application blockers', 'Improve the weakest readiness dimension first.'],
            ].map(([title, body], index) => (
              <button key={title} onClick={() => index === 1 ? onNavigate('jobs') : index === 2 ? onNavigate('gaps') : onBuildOwn()}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.coverage}>
        <div className={styles.sectionHeader}>
          <span>Starter Kit coverage</span>
          <h2>Core jobsite features, not just a demo profile.</h2>
          <p>
            The prototype remains frontend-only, but each core feature is clickable enough for judges to understand the product flow.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {CAREER_OS_FEATURES.map(([title, body]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.sectionHeader}>
          <span>Choose a workspace</span>
          <h2>Same platform, different job to be done.</h2>
        </div>
        <div className={styles.workspaceGrid}>
          <button onClick={() => onNavigate('jobs')}>
            <small>Candidate flow</small>
            <strong>Job Search</strong>
            <p>Find roles, inspect match quality, and save mock applications.</p>
          </button>
          <button onClick={() => onNavigate('dashboard')}>
            <small>Candidate dashboard</small>
            <strong>Readiness Profile</strong>
            <p>See scores, evidence sources, blockers, paths, and application assets.</p>
          </button>
          <button onClick={() => onNavigate('employer-portal')}>
            <small>Employer dashboard</small>
            <strong>Hiring Brief</strong>
            <p>Pick a role and see which profile deserves a shortlist conversation.</p>
          </button>
          <button onClick={() => onNavigate('cohort')}>
            <small>University module</small>
            <strong>Cohort Interventions</strong>
            <p>Turn readiness gaps into programme actions, owners, and measures.</p>
          </button>
        </div>
      </section>
    </main>
  );
}
