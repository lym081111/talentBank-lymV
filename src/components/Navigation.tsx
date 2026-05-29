import styles from './Navigation.module.css';
import type { Page } from '../types/navigation';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  showNav: boolean;
  onResetDemo?: () => void;
  onGoHome?: () => void;
  isDark?: boolean;
  onToggleDarkMode?: () => void;
}

const STEP_ORDER: Page[] = ['profile', 'extraction', 'dashboard', 'gaps', 'cohort'];
// These pages are accessible from the dashboard but not sequential steps
const SIDE_PAGES: Page[] = ['trajectory'];

export function Navigation({ currentPage, onNavigate, showNav, onResetDemo, onGoHome, isDark, onToggleDarkMode }: Props) {
  if (!showNav) return null;

  // For side pages, treat as if we're on dashboard for accessibility
  const effectivePage = SIDE_PAGES.includes(currentPage) ? 'dashboard' : currentPage;
  const currentIndex = STEP_ORDER.indexOf(effectivePage);

  const isStepAccessible = (page: Page) => {
    const pageIndex = STEP_ORDER.indexOf(page);
    return pageIndex <= currentIndex || pageIndex === 0; // Can always go back to profile
  };

  const steps = [
    { page: 'profile' as const, label: 'Evidence' },
    { page: 'extraction' as const, label: 'Skills' },
    { page: 'dashboard' as const, label: 'Landscape' },
    { page: 'gaps' as const, label: 'Paths' },
    { page: 'cohort' as const, label: 'Cohort' },
  ];

  return (
    <nav className={styles.nav} role="navigation" aria-label="PathLens navigation">
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <button
            className={styles.homeBtn}
            onClick={onGoHome}
            title="Back to home"
            aria-label="Back to home"
          >
            🏠
          </button>
          <div className={styles.navBrand} aria-label="PathLens">PathLens</div>
        </div>
        <div className={styles.navSteps} role="list" aria-label="Assessment steps">
          {steps.map((step, idx) => (
            <div key={step.page} role="listitem" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className={`${styles.step} ${currentPage === step.page ? styles.active : ''} ${!isStepAccessible(step.page) ? styles.disabled : ''}`}
                onClick={() => isStepAccessible(step.page) && onNavigate(step.page)}
                disabled={!isStepAccessible(step.page)}
                aria-current={currentPage === step.page ? 'step' : undefined}
                aria-disabled={!isStepAccessible(step.page)}
                title={!isStepAccessible(step.page) ? 'Complete previous steps first' : `Go to ${step.label}`}
              >
                {step.label}
              </button>
              {idx < steps.length - 1 && <span className={styles.divider} aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
        <div className={styles.navRight}>
          {onToggleDarkMode && (
            <button
              className={styles.darkModeBtn}
              onClick={onToggleDarkMode}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          )}
          {onResetDemo && (
            <button
              className={styles.resetBtn}
              onClick={onResetDemo}
              aria-label="Reset to demo profile"
            >
              Reset to Demo
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
