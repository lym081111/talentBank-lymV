import { useMemo, useState } from 'react';
import { Gap, ReadinessProfile, StudentProfile } from '../types/evidence';
import { matchApplicationTargets, MOCK_APPLICATION_TARGETS } from '../utils/applicationTargets';
import styles from './JobSearch.module.css';

interface Props {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  gaps: Gap[];
  onBuildProfile: () => void;
  onViewDashboard: () => void;
  onViewApplications: () => void;
}

type WorkMode = 'all' | 'onsite' | 'hybrid' | 'remote';

const WORK_MODES: Record<string, WorkMode> = {
  'swe-platform-kl': 'hybrid',
  'data-products-sg': 'onsite',
  'frontend-application-regional': 'remote',
  'backend-api-jakarta': 'hybrid',
};

const SALARY_BANDS: Record<string, string> = {
  'swe-platform-kl': 'MYR 3,500-5,500/mo',
  'data-products-sg': 'MYR 4,800-7,200/mo',
  'frontend-application-regional': 'MYR 3,200-5,800/mo',
  'backend-api-jakarta': 'MYR 3,000-5,000/mo',
};

export function JobSearch({ profile, studentProfile, gaps, onBuildProfile, onViewDashboard, onViewApplications }: Props) {
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('all');
  const [workMode, setWorkMode] = useState<WorkMode>('all');
  const [appliedIds, setAppliedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('pathlens_applications') || '[]') as string[];
    } catch {
      return [];
    }
  });

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return matchApplicationTargets(profile, gaps, MOCK_APPLICATION_TARGETS).filter((match) => {
      const role = match.role;
      const searchable = [
        role.title,
        role.company,
        role.market,
        role.description,
        ...role.requiredSkills,
        ...role.niceToHaveSkills,
      ].join(' ').toLowerCase();
      const marketMatch = market === 'all' || role.market.toLowerCase().includes(market);
      const modeMatch = workMode === 'all' || WORK_MODES[role.id] === workMode;
      return (!q || searchable.includes(q)) && marketMatch && modeMatch;
    });
  }, [gaps, market, profile, query, workMode]);

  function handleApply(roleId: string) {
    const next = Array.from(new Set([...appliedIds, roleId]));
    setAppliedIds(next);
    localStorage.setItem('pathlens_applications', JSON.stringify(next));
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Keyword and job search</span>
          <h1>Search roles. See the evidence gap before applying.</h1>
          <p>
            This is the compulsory Career OS jobsite layer: listings, keyword search, matching,
            applications, and a candidate dashboard powered by the Adaptive Readiness Profile.
          </p>
        </div>
        <div className={styles.profileCard}>
          <span>Active profile</span>
          <strong>{studentProfile.name || 'Unnamed candidate'}</strong>
          <p>{studentProfile.targetRole || 'No target role yet'} - readiness {profile.overall}/100</p>
          <button onClick={onBuildProfile}>Edit profile evidence</button>
        </div>
      </section>

      <section className={styles.searchPanel} aria-label="Search jobs">
        <label>
          Keyword
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try React, Python, SQL, backend, Singapore..."
          />
        </label>
        <label>
          Market
          <select value={market} onChange={(event) => setMarket(event.target.value)}>
            <option value="all">All markets</option>
            <option value="malaysia">Malaysia</option>
            <option value="singapore">Singapore</option>
            <option value="remote">Remote</option>
            <option value="indonesia">Indonesia</option>
          </select>
        </label>
        <label>
          Work mode
          <select value={workMode} onChange={(event) => setWorkMode(event.target.value as WorkMode)}>
            <option value="all">All modes</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </label>
      </section>

      <section className={styles.summary}>
        <div>
          <span>{matches.length}</span>
          <p>roles found</p>
        </div>
        <div>
          <span>{appliedIds.length}</span>
          <p>mock applications</p>
        </div>
        <div>
          <span>{profile.allExtractedSkills.length}</span>
          <p>skill signals used</p>
        </div>
      </section>

      <section className={styles.results}>
        {matches.map((match) => {
          const applied = appliedIds.includes(match.role.id);
          return (
            <article key={match.role.id} className={styles.jobCard}>
              <div className={styles.jobMain}>
                <div className={styles.jobTopline}>
                  <span>{match.role.market}</span>
                  <span>{WORK_MODES[match.role.id]}</span>
                  <span>{SALARY_BANDS[match.role.id]}</span>
                </div>
                <h2>{match.role.title}</h2>
                <p>{match.role.company} - {match.role.description}</p>
                <div className={styles.skillList}>
                  {match.role.requiredSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <aside className={styles.matchPanel}>
                <div className={styles.score}>{match.score}%</div>
                <strong>{match.fit}</strong>
                <p>{match.whyMatched[0]}</p>
                <p className={styles.blocker}>{match.blockers[0]}</p>
                <button onClick={() => handleApply(match.role.id)} disabled={applied}>
                  {applied ? 'Application saved' : 'Apply with evidence'}
                </button>
              </aside>
            </article>
          );
        })}
      </section>

      <section className={styles.nextActions}>
        <button onClick={onViewDashboard}>Open candidate dashboard</button>
        <button onClick={onViewApplications}>Improve application blockers</button>
      </section>
    </main>
  );
}
