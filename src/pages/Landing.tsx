import { useState } from 'react';
import { StudentProfile } from '../types/evidence';
import { priyaSharmaProfile, kaiChenProfile, aishaPatelProfile } from '../data/mockStudent';
import styles from './Landing.module.css';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

const DEMO_PERSONAS = [
  { profile: priyaSharmaProfile, emoji: '🚀', desc: 'Senior SWE at Grab • 5 Years' },
  { profile: kaiChenProfile, emoji: '📊', desc: 'Senior Data Eng at ByteDance • 3 Years' },
  { profile: aishaPatelProfile, emoji: '📈', desc: 'Senior PM at Lazada • 4 Years' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Add Your Evidence',
    desc: 'Log projects, internships, certifications, and hackathons. Specific descriptions create stronger skill detection and more accurate scoring.',
  },
  {
    step: '02',
    title: 'Extract Skills Transparently',
    desc: '34 high-demand skills are matched against your evidence. Every detected skill traces back to a phrase you provided.',
  },
  {
    step: '03',
    title: 'See Your Readiness Landscape',
    desc: 'Radar scoring, ATS compatibility, Asia market alignment, and portfolio quality analysis show where you realistically stand today.',
  },
  {
    step: '04',
    title: 'Navigate Toward Matches',
    desc: 'Ranked gaps, Claude coaching, a trajectory simulator, and a marketplace preview show which roles your profile can unlock next.',
  },
];

function Icon({ type }: { type: 'evidence' | 'trust' | 'marketplace' }) {
  if (type === 'trust') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }

  if (type === 'marketplace') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }

  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [showPersonas, setShowPersonas] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>Built for Asia's Tech Market</div>
          <h1 className={styles.title}>PathLens</h1>
          <p className={styles.tagline}>See where you stand. Navigate what is next.</p>
        </div>

        <div className={styles.description}>
          <p>
            Most CS students in Southeast Asia do not know if they are ready for internships until they get rejected.
            PathLens maps projects and experience into a transparent readiness profile across{' '}
            <strong>6 weighted dimensions hiring managers actually use</strong>, plus{' '}
            <strong>market alignment</strong> against 34 high-demand skills tracked across Asia's tech hubs.
          </p>
          <p>
            <strong>Navigation, not prediction:</strong> your evidence becomes gaps, next moves, marketplace-fit signals, and portable career proof.
          </p>
        </div>

        <div className={styles.ctaGroup}>
          {!showPersonas ? (
            <>
              <button className={styles.ctaPrimary} onClick={() => setShowPersonas(true)}>
                See a Live Demo
              </button>
              <button className={styles.ctaSecondary} onClick={onBuildOwn}>
                Build My Own Profile
              </button>
            </>
          ) : (
            <div className={styles.personaSelector}>
              <p className={styles.personaTitle}>Choose a Student Profile:</p>
              <div className={styles.personas}>
                {DEMO_PERSONAS.map(({ profile, emoji, desc }) => (
                  <button
                    key={profile.id}
                    className={styles.personaCard}
                    onClick={() => onViewDemo(profile)}
                  >
                    <div className={styles.personaEmoji}>{emoji}</div>
                    <div className={styles.personaName}>{profile.name}</div>
                    <div className={styles.personaDesc}>{desc}</div>
                  </button>
                ))}
              </div>
              <button
                className={styles.ctaSecondary}
                onClick={() => setShowPersonas(false)}
                style={{ marginTop: '16px' }}
              >
                Back
              </button>
            </div>
          )}
        </div>

        <p className={styles.demo}>No account needed - free - Claude narrative insights with deterministic scoring</p>

        <div className={styles.valueProps}>
          <div className={styles.valueProp}>
            <div className={styles.iconContainer}><Icon type="evidence" /></div>
            <h3>Evidence-Based</h3>
            <p>Every score comes from actual projects and experience: no self-rating, no guesswork.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}><Icon type="trust" /></div>
            <h3>Transparent Scoring</h3>
            <p>Skill extraction and readiness scoring stay deterministic, explainable, and source-traced.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}><Icon type="marketplace" /></div>
            <h3>Marketplace Bridge</h3>
            <p>The same profile can power internship matching by showing fit, blockers, and next evidence to build.</p>
          </div>
        </div>

        <div className={styles.howItWorks}>
          <h2 className={styles.howTitle}>How PathLens Works</h2>
          <div className={styles.steps}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className={styles.step}>
                <div className={styles.stepNumber}>{item.step}</div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contextStrip}>
          <div className={styles.contextStat}>
            <strong>2 min</strong>
            <span>Assessment</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>6</strong>
            <span>Dimensions</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>34</strong>
            <span>Skills tracked</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>04</strong>
            <span>Marketplace bridge</span>
          </div>
        </div>

        <div className={styles.ecosystemSection}>
          <div className={styles.ecosystemLabel}>Part of Asia's Career OS - Universities Track</div>
          <h2 className={styles.ecosystemTitle}>PathLens is Module 03 of 5</h2>
          <p className={styles.ecosystemDesc}>
            The Career OS is a connected navigation system, not a single tool. PathLens handles readiness profiling,
            then passes structured signals to career marketplace matching and learning credentials.
          </p>
          <div className={styles.ecosystemModules}>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>01</span>
              <span className={styles.ecoModuleName}>Lifelong Outcome Loop</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>02</span>
              <span className={styles.ecoModuleName}>Curriculum Engine</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleActive}`}>
              <span className={styles.ecoModuleNum}>03</span>
              <span className={styles.ecoModuleName}>Adaptive Readiness Profile</span>
              <span className={styles.ecoModuleYou}>You are here</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>04</span>
              <span className={styles.ecoModuleName}>Career Marketplace</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>05</span>
              <span className={styles.ecoModuleName}>Lifelong Learning Wallet</span>
            </div>
          </div>
          <p className={styles.ecosystemFlow}>
            Readiness score, extracted skills, and gaps feed <strong>Module 04</strong> role matching.
            Evidence snapshots can later become verifiable proof in <strong>Module 05</strong>.
          </p>
        </div>

        <p className={styles.moduleTag}>
          Talentbank Tech Hackathon 2026 - Adaptive Readiness Profile - Universities Track
        </p>
      </div>
    </div>
  );
}
