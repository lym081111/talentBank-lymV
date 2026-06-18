import styles from './Navigation.module.css';
import type { Page } from '../types/navigation';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  showNav: boolean;
  onResetDemo?: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
  userName?: string;
  isDark?: boolean;
  onToggleDarkMode?: () => void;
}

const NAV_ITEMS: Array<{ page: Page; label: string }> = [
  { page: 'landing', label: 'Home' },
  { page: 'jobs', label: 'Jobs' },
  { page: 'profile', label: 'Profile' },
  { page: 'extraction', label: 'Skills' },
  { page: 'dashboard', label: 'Dashboard' },
  { page: 'gaps', label: 'Applications' },
  { page: 'employer-portal', label: 'Employer' },
  { page: 'cohort', label: 'University' },
];

export function Navigation({
  currentPage,
  onNavigate,
  showNav,
  onResetDemo,
  onGoHome,
  onLogout,
  userName,
  isDark,
  onToggleDarkMode,
}: Props) {
  if (!showNav) return null;

  return (
    <nav className={styles.nav} role="navigation" aria-label="Career OS navigation">
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <button
            className={styles.homeBtn}
            onClick={onGoHome}
            title="Back to Career OS home"
            aria-label="Back to Career OS home"
          >
            OS
          </button>
          <div>
            <div className={styles.navBrand} aria-label="PathLens">PathLens</div>
            <div className={styles.navSub}>Career OS</div>
          </div>
        </div>

        <div className={styles.navSteps} role="list" aria-label="Platform pages">
          {NAV_ITEMS.map((item) => (
            <div key={item.page} role="listitem">
              <button
                className={`${styles.step} ${currentPage === item.page ? styles.active : ''}`}
                onClick={() => onNavigate(item.page)}
                aria-current={currentPage === item.page ? 'page' : undefined}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.navRight}>
          {userName && <span className={styles.userPill}>{userName}</span>}
          {onToggleDarkMode && (
            <button
              className={styles.darkModeBtn}
              onClick={onToggleDarkMode}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
          )}
          {onResetDemo && (
            <button
              className={styles.resetBtn}
              onClick={onResetDemo}
              aria-label="Reset to sample profile"
            >
              Reset sample
            </button>
          )}
          {onLogout && (
            <button className={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
