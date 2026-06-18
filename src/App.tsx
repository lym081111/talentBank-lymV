import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Navigation } from './components/Navigation';

// Lazy-load page components so each page's code only downloads when first visited.
// This splits the 1.7 MB bundle into per-page chunks, reducing initial load time.
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const JobSearch = lazy(() => import('./pages/JobSearch').then((m) => ({ default: m.JobSearch })));
const ProfileAndEvidence = lazy(() =>
  import('./pages/ProfileAndEvidence').then((m) => ({ default: m.ProfileAndEvidence }))
);
const SkillExtraction = lazy(() =>
  import('./pages/SkillExtraction').then((m) => ({ default: m.SkillExtraction }))
);
const ReadinessDashboard = lazy(() =>
  import('./pages/ReadinessDashboard').then((m) => ({ default: m.ReadinessDashboard }))
);
const Gaps = lazy(() => import('./pages/Gaps').then((m) => ({ default: m.Gaps })));
const CohortView = lazy(() =>
  import('./pages/CohortView').then((m) => ({ default: m.CohortView }))
);
const TrajectorySimulator = lazy(() =>
  import('./pages/TrajectorySimulator').then((m) => ({ default: m.TrajectorySimulator }))
);
const TalentPortal = lazy(() =>
  import('./pages/TalentPortal').then((m) => ({ default: m.TalentPortal }))
);
const EmployerPortal = lazy(() =>
  import('./pages/EmployerPortal').then((m) => ({ default: m.EmployerPortal }))
);
import { AppFooter } from './components/AppFooter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { mockCohortInsight } from './data/mockCohort';
import { calculateReadinessProfile } from './utils/readinessScoring';
import { generateGaps } from './utils/nextActions';
import { useEvidence } from './hooks/useEvidence';
import { useStudentProfile } from './hooks/useStudentProfile';
import { useDarkMode } from './hooks/useDarkMode';
import { StudentProfile } from './types/evidence';
import { priyaSharmaProfile } from './data/mockStudent';
import './App.css';
import type { Page } from './types/navigation';
import type { AuthUser } from './pages/AuthPage';

const AUTH_KEY = 'pathlens_auth_user';

function loadAuthUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) as AuthUser : null;
  } catch {
    return null;
  }
}

function createBlankProfile(): StudentProfile {
  return {
    id: `student_custom_${Date.now()}`,
    name: '',
    university: '',
    year: 1,
    major: '',
    targetRole: '',
    evidence: [],
  };
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(loadAuthUser);
  const [currentPage, setCurrentPage] = useState<Page>(() => authUser ? 'landing' : 'auth');
  const [profileReturnPage, setProfileReturnPage] = useState<Page>('landing');
  const [lightweightViewReturnPage, setLightweightViewReturnPage] = useState<Page>('landing');
  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  const { evidence, addEvidence, updateEvidence, deleteEvidence, resetToDemo, clearAll, setEvidence } = useEvidence();
  const { profile: studentProfile, updateProfile, isDemoProfile } = useStudentProfile();

  const readinessProfile = useMemo(() => {
    return calculateReadinessProfile(evidence);
  }, [evidence]);

  const gaps = useMemo(() => {
    return generateGaps(readinessProfile.dimensions, mockCohortInsight);
  }, [readinessProfile]);

  // Scroll to top and update page title whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const PAGE_TITLES: Record<string, string> = {
      auth: 'Login - PathLens Career OS',
      landing: 'Career OS Home - PathLens',
      profile: 'Profile Builder - PathLens',
      jobs: 'Job Search - PathLens',
      extraction: 'Skills Detected - PathLens',
      dashboard: 'Candidate Dashboard - PathLens',
      gaps: 'Applications and Paths - PathLens',
      cohort: 'University Cohort View - PathLens',
      trajectory: 'Career Path Navigator - PathLens',
      'talent-portal': 'Career OS - PathLens',
      'employer-portal': 'Employer Hiring Brief - PathLens',
    };
    document.title = PAGE_TITLES[currentPage] ?? 'PathLens';
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    if (!authUser && page !== 'auth') {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page);
  };

  const handleAuthenticate = (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem(AUTH_KEY);
    setCurrentPage('auth');
  };

  const handleViewDemo = (profile: StudentProfile) => {
    // Set the student profile and their evidence
    setProfileReturnPage('talent-portal');
    updateProfile(profile);
    setEvidence(profile.evidence);
    handleNavigate('profile');
  };

  const handleBuildOwn = (returnPage?: Page) => {
    setProfileReturnPage(returnPage ?? (currentPage === 'profile' ? profileReturnPage : currentPage));
    updateProfile(createBlankProfile());
    clearAll();
    handleNavigate('profile');
  };

  const handleUpdateEvidenceFromDashboard = () => {
    setProfileReturnPage('dashboard');
    handleNavigate('profile');
  };

  // Navigate to a lightweight view (Employer or University) that needs a profile.
  // If no evidence is loaded yet (direct entry from landing), silently seed Priya's
  // demo profile so the view renders with real data instead of empty/zero state.
  const handleNavigateToLightweightView = (page: 'cohort' | 'employer-portal') => {
    setLightweightViewReturnPage(currentPage);
    if (evidence.length === 0) {
      updateProfile(priyaSharmaProfile);
      setEvidence(priyaSharmaProfile.evidence);
    }
    handleNavigate(page);
  };

  const handleGoHome = () => {
    handleNavigate('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onAuthenticate={handleAuthenticate} />;
      case 'landing':
        return (
          <Landing
            userName={authUser?.name}
            onNavigate={(page) => {
              if (page === 'cohort' || page === 'employer-portal') {
                handleNavigateToLightweightView(page);
              } else {
                handleNavigate(page);
              }
            }}
            onBuildOwn={() => handleBuildOwn('landing')}
          />
        );
      case 'jobs':
        return (
          <JobSearch
            profile={readinessProfile}
            studentProfile={studentProfile}
            gaps={gaps}
            onBuildProfile={() => handleBuildOwn('jobs')}
            onViewDashboard={() => handleNavigate('dashboard')}
            onViewApplications={() => handleNavigate('gaps')}
          />
        );
      case 'profile':
        return (
          <ProfileAndEvidence
            profile={studentProfile}
            evidence={evidence}
            isDemoMode={isDemoProfile}
            onUpdateProfile={updateProfile}
            onAddEvidence={addEvidence}
            onUpdateEvidence={updateEvidence}
            onDeleteEvidence={deleteEvidence}
            onAnalyze={() => handleNavigate('extraction')}
            onClearAndStart={() => handleBuildOwn()}
            onBack={() => handleNavigate(profileReturnPage)}
            backLabel={
              profileReturnPage === 'talent-portal'
                ? 'Back to Career OS'
                : profileReturnPage === 'employer-portal'
                  ? 'Back to Employer Brief'
                  : profileReturnPage === 'dashboard'
                    ? 'Back to Landscape'
                    : 'Back to previous page'
            }
          />
        );
      case 'extraction':
        return (
          <SkillExtraction
            evidence={evidence}
            extractedSkills={readinessProfile.allExtractedSkills}
            studentProfile={studentProfile}
            onContinue={() => handleNavigate('dashboard')}
          />
        );
      case 'dashboard':
        return (
          <ReadinessDashboard
            profile={readinessProfile}
            studentProfile={studentProfile}
            studentName={studentProfile.name}
            hasEvidence={evidence.length > 0}
            evidence={evidence}
            onViewGaps={() => handleNavigate('gaps')}
            onBackToProfile={handleUpdateEvidenceFromDashboard}
            onViewTrajectory={() => handleNavigate('trajectory')}
          />
        );
      case 'gaps':
        return (
          <Gaps
            gaps={gaps}
            readinessProfile={readinessProfile}
            studentProfile={studentProfile}
            onBackToDashboard={() => handleNavigate('dashboard')}
            onViewCohort={() => handleNavigateToLightweightView('cohort')}
            onUpdateEvidence={handleUpdateEvidenceFromDashboard}
          />
        );
      case 'cohort':
        return (
          <CohortView
            cohort={mockCohortInsight}
            readinessProfile={readinessProfile}
            studentProfile={studentProfile}
            onBack={() => handleNavigate(lightweightViewReturnPage)}
            backLabel={
              lightweightViewReturnPage === 'landing'
                ? 'Back to home'
                : lightweightViewReturnPage === 'gaps'
                  ? 'Back to gaps'
                  : 'Back to readiness dashboard'
            }
          />
        );
      case 'trajectory':
        return (
          <TrajectorySimulator
            profile={readinessProfile}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      case 'talent-portal':
        return (
          <TalentPortal
            onViewDemo={handleViewDemo}
            onBuildOwn={() => handleBuildOwn('talent-portal')}
            onBack={() => handleNavigate('landing')}
          />
        );
      case 'employer-portal':
        return (
          <EmployerPortal
            profile={studentProfile}
            evidence={evidence}
            readinessProfile={readinessProfile}
            onBuildOwn={() => handleBuildOwn('employer-portal')}
            onBack={() => handleNavigate(lightweightViewReturnPage)}
          />
        );
      default:
        return <Landing userName={authUser?.name} onNavigate={handleNavigate} onBuildOwn={() => handleBuildOwn('landing')} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          showNav={Boolean(authUser) && currentPage !== 'auth'}
          onResetDemo={resetToDemo}
          onGoHome={handleGoHome}
          onLogout={handleLogout}
          userName={authUser?.name}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />
        <Suspense fallback={
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', color: 'var(--color-text-muted)', fontSize: '14px',
          }}>
            Loading...
          </div>
        }>
          <div key={currentPage} className="pageWrapper">
            {renderPage()}
            {currentPage !== 'auth' && currentPage !== 'landing' && currentPage !== 'cohort' && <AppFooter />}
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
