import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Navigation } from './components/Navigation';

// Lazy-load page components so each page's code only downloads when first visited.
// This splits the 1.7 MB bundle into per-page chunks, reducing initial load time.
const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
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
import './App.css';
import type { Page } from './types/navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
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
      landing: 'PathLens — Career Readiness for Asia\'s Tech Market',
      profile: 'Your Profile & Evidence — PathLens',
      extraction: 'Skills Detected — PathLens',
      dashboard: 'Your Readiness Landscape — PathLens',
      gaps: 'Paths Forward — PathLens',
      cohort: 'University Cohort View — PathLens',
      trajectory: 'Trajectory Simulator — PathLens',
      'talent-portal': 'Talent OS — PathLens',
      'employer-portal': 'Recruiter Dashboard — PathLens',
    };
    document.title = PAGE_TITLES[currentPage] ?? 'PathLens';
  }, [currentPage]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleViewDemo = (profile: StudentProfile) => {
    // Set the student profile and their evidence
    updateProfile(profile);
    setEvidence(profile.evidence);
    handleNavigate('profile');
  };

  const handleBuildOwn = () => {
    clearAll();
    handleNavigate('profile');
  };

  const handleGoHome = () => {
    handleNavigate('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onBuildOwn={handleBuildOwn} onNavigate={handleNavigate} />;
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
            onClearAndStart={handleBuildOwn}
          />
        );
      case 'extraction':
        return (
          <SkillExtraction
            evidence={evidence}
            extractedSkills={readinessProfile.allExtractedSkills}
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
            onBackToProfile={() => handleNavigate('profile')}
            onViewTrajectory={() => handleNavigate('trajectory')}
          />
        );
      case 'gaps':
        return (
          <Gaps
            gaps={gaps}
            onViewCohort={() => handleNavigate('cohort')}
            onUpdateEvidence={() => handleNavigate('profile')}
          />
        );
      case 'cohort':
        return (
          <CohortView
            cohort={mockCohortInsight}
            readinessProfile={readinessProfile}
            studentProfile={studentProfile}
            onBack={() => handleNavigate('dashboard')}
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
            onBuildOwn={handleBuildOwn}
            onBack={() => handleNavigate('landing')}
          />
        );
      case 'employer-portal':
        return (
          <EmployerPortal
            onBuildOwn={handleBuildOwn}
            onBack={() => handleNavigate('landing')}
          />
        );
      default:
        return <Landing onBuildOwn={handleBuildOwn} onNavigate={handleNavigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          showNav={currentPage !== 'landing' && currentPage !== 'talent-portal' && currentPage !== 'employer-portal'}
          onResetDemo={resetToDemo}
          onGoHome={handleGoHome}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />
        <Suspense fallback={
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '60vh', color: 'var(--color-text-muted)', fontSize: '14px',
          }}>
            Loading…
          </div>
        }>
          <div key={currentPage} className="pageWrapper">
            {renderPage()}
            {currentPage !== 'landing' && <AppFooter />}
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
