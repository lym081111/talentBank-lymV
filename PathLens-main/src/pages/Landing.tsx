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
    desc: 'Log your projects, internships, certifications, and work history. Rich descriptions help extract accurate skills and career narrative.',
  },
  {
    step: '02',
    title: 'Market Comparison',
    desc: 'See yourself against 10,000+ real profiles. Where do you stand percentile-wise? What skills drive salary growth in your role/region?',
  },
  {
    step: '03',
    title: 'Your Career Landscape',
    desc: 'Readiness score (0-100) mapped to real salary ranges. See what similar profiles earned at each stage. Transparent about timing and luck factors.',
  },
  {
    step: '04',
    title: 'Actionable Next Steps',
    desc: 'Top 3 skill gaps ranked by ROI (salary impact). Timeline, resources, and expected uplift for each. Real progression paths from people like you.',
  },
];

export function Landing({ onViewDemo, onBuildOwn }: Props) {
  const [showPersonas, setShowPersonas] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>🌏 Based on 10,000+ Real Career Progressions</div>
          <h1 className={styles.title}>PathLens</h1>
          <p className={styles.tagline}>See realistic career futures. Navigate with data, not guesswork.</p>
        </div>

        <div className={styles.description}>
          <p>
            Most students in Asia don't know what's realistic for their career — until they're 3 years in and realize they've been optimizing for the wrong skills.
            PathLens analyzes your evidence against real market data from 10,000+ professionals across Asia tech, showing you{' '}
            <strong>real salary progressions, skill premiums, and role demand</strong> — then maps your gaps to achievable next steps.
          </p>
          <p>
            <strong>See: Priya earned 4x salary growth in 5 years (SGD 3.5k → 15k/month). Kai transitioned analyst to senior data engineer in 3 years. Aisha grew a billion-rupee marketplace.</strong> See your realistic path.
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
              <span style={{ fontSize: '28px' }}>📊</span>
            </div>
            <h3>Evidence-Based</h3>
            <p>Every score comes from your actual projects and experience — no self-rating, no guesswork.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}>
              <span style={{ fontSize: '28px' }}>🔍</span>
            </div>
            <h3>Transparent Scoring</h3>
            <p>No black box. See exactly how each dimension is scored and what evidence drove the result.</p>
          </div>

          <div className={styles.valueProp}>
            <div className={styles.iconContainer}>
              <span style={{ fontSize: '28px' }}>🤖</span>
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

        {/* Real Market Data Stats */}
        <div className={styles.contextStrip}>
          <div className={styles.contextStat}>
            <strong>10,000+</strong>
            <span>Real career profiles</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>18% YoY</strong>
            <span>Average salary growth</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>SGD 3k → 15k</strong>
            <span>Real 5-year progression</span>
          </div>
          <div className={styles.contextDivider} />
          <div className={styles.contextStat}>
            <strong>Free</strong>
            <span>No sign-up needed</span>
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
