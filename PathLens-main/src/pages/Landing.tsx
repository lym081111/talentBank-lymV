import { useState } from 'react';
import { StudentProfile } from '../types/evidence';
import { danielLeeProfile, sarahTanProfile, ahmadRazifProfile } from '../data/mockStudent';
import styles from './Landing.module.css';

interface Props {
  onViewDemo: (profile: StudentProfile) => void;
  onBuildOwn: () => void;
}

const DEMO_PERSONAS = [
  { profile: danielLeeProfile, emoji: '🎯', desc: 'SWE Track • 3rd Year' },
  { profile: sarahTanProfile, emoji: '📊', desc: 'Data Track • 3rd Year' },
  { profile: ahmadRazifProfile, emoji: '⚙️', desc: 'Full-Stack • 2nd Year' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Add Your Evidence',
    desc: 'Log your projects, internships, certifications, and hackathons. Specific descriptions = richer skill detection and more accurate scoring.',
  },
  {
    step: '02',
    title: 'Skills Extracted Transparently',
    desc: '34 high-demand skills matched across 6 categories. Every detected skill traces back to an exact phrase in your evidence — no black box.',
  },
  {
    step: '03',
    title: 'See Your Market Position',
    desc: 'Readiness radar across 6 weighted dimensions, ATS compatibility score, market alignment % vs Asia tech hiring data, and portfolio quality analysis.',
  },
  {
    step: '04',
    title: 'Navigate Your Gaps',
    desc: 'Ranked gaps with projected score impact, a Quick Win algorithm, Claude AI career intelligence, and a trajectory simulator before you commit.',
  },
];

export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [showPersonas, setShowPersonas] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>🌏 Built for Asia's Tech Market</div>
          <h1 className={styles.title}>PathLens</h1>
          <p className={styles.tagline}>See where you stand. Navigate what's next.</p>
        </div>

        <div className={styles.description}>
          <p>
            Most CS students in Southeast Asia don't know if they're ready for internships — until they get rejected.
            PathLens maps your projects and experience to a transparent readiness score across{' '}
            <strong>6 weighted dimensions hiring managers actually use</strong>, and shows your{' '}
            <strong>market alignment</strong> against 34 high-demand skills tracked across Asia's tech hubs — in under 2 minutes, no account needed.
          </p>
          <p>
            <strong>Build your profile during university. Carry it through your entire career. Update it forever.</strong>
          </p>
        </div>

        <div className={styles.ctaGroup}>
          {!showPersonas ? (
            <>
              <button className={styles.ctaPrimary} onClick={() => setShowPersonas(true)}>
                ✨ See a Live Demo
              </button>
              <button className={styles.ctaSecondary} onClick={onBuildOwn}>
                Build My Own Profile →
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
                ← Back
              </button>
            </div>
          )}
        </div>

        <p className={styles.demo}>No account needed · Free · Powered by Claude AI</p>

        {/* Value Props */}
        <div className={styles.valueProps}>
          <div className={styles.valueProp}>
            <div className={styles.iconContainer}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3>Evidence-Based</h3>
            <p>Every score comes from your actual projects and experience — no self-rating, no guesswork.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3>Transparent Scoring</h3>
            <p>No black box. See exactly how each dimension is scored and what evidence drove the result.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <h3>Claude AI Insights</h3>
            <p>Get personalised career intelligence from Claude — narrative analysis and your single most impactful next step.</p>
          </div>
        </div>

        {/* How It Works */}
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

        {/* Stats strip */}
        <div className={styles.contextStrip}>
          <div className={styles.contextStat}>
            <strong>2 min</strong>
            <span>Full assessment</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>6</strong>
            <span>Readiness dimensions</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>34</strong>
            <span>Skills tracked</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>0</strong>
            <span>Account needed</span>
          </div>
        </div>

        {/* Career OS Ecosystem */}
        <div className={styles.ecosystemSection}>
          <div className={styles.ecosystemLabel}>Part of Asia's Career OS · Universities Track</div>
          <h2 className={styles.ecosystemTitle}>PathLens is Module 03 of 5</h2>
          <p className={styles.ecosystemDesc}>
            The Career OS is a connected navigation system — not a single tool. PathLens handles
            readiness profiling. The other modules handle what comes next.
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
              <span className={styles.ecoModuleYou}>← You are here</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>04</span>
              <span className={styles.ecoModuleName}>Internship Marketplace</span>
            </div>
            <div className={`${styles.ecoModule} ${styles.ecoModuleDim}`}>
              <span className={styles.ecoModuleNum}>05</span>
              <span className={styles.ecoModuleName}>Lifelong Learning Wallet</span>
            </div>
          </div>
          <p className={styles.ecosystemFlow}>
            Your readiness score feeds directly into <strong>Module 04</strong> (internship matching) and your profile becomes a verifiable credential in <strong>Module 05</strong> — from university to 10 years into your career.
          </p>
        </div>

        <p className={styles.moduleTag}>
          🏆 Talentbank Tech Hackathon 2026 · <strong>Adaptive Readiness Profile</strong> — Universities Track
        </p>
      </div>
    </div>
  );
}
