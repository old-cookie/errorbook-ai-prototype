import { Suspense, lazy, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { PracticeSessionSummary } from './data/appState';

const Splash = lazy(() => import('./screens/Splash').then((mod) => ({ default: mod.Splash })));
const Onboarding = lazy(() => import('./screens/Onboarding').then((mod) => ({ default: mod.Onboarding })));
const Home = lazy(() => import('./screens/Home').then((mod) => ({ default: mod.Home })));
const Capture = lazy(() => import('./screens/Capture').then((mod) => ({ default: mod.Capture })));
const CaptureDetails = lazy(() => import('./screens/CaptureDetails').then((mod) => ({ default: mod.CaptureDetails })));
const MistakeDetail = lazy(() => import('./screens/MistakeDetail').then((mod) => ({ default: mod.MistakeDetail })));
const PracticeSession = lazy(() => import('./screens/PracticeSession').then((mod) => ({ default: mod.PracticeSession })));
const SessionResults = lazy(() => import('./screens/SessionResults').then((mod) => ({ default: mod.SessionResults })));
const Review = lazy(() => import('./screens/Review').then((mod) => ({ default: mod.Review })));
const Progress = lazy(() => import('./screens/Progress').then((mod) => ({ default: mod.Progress })));
const BadgeUnlocked = lazy(() => import('./screens/BadgeUnlocked').then((mod) => ({ default: mod.BadgeUnlocked })));
const Settings = lazy(() => import('./screens/Settings').then((mod) => ({ default: mod.Settings })));
const EriProgress = lazy(() => import('./screens/EriProgress').then((mod) => ({ default: mod.EriProgress })));
const EnglishMission = lazy(() => import('./screens/EnglishMission').then((mod) => ({ default: mod.EnglishMission })));
const MissionChoice = lazy(() => import('./screens/MissionChoice').then((mod) => ({ default: mod.MissionChoice })));

type Screen = 
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'capture'
  | 'capture-details'
  | 'mistake-detail'
  | 'practice'
  | 'session-results'
  | 'review'
  | 'progress'
  | 'settings'
  | 'eri-progress'
  | 'english-mission'
  | 'mission-choice';

type Tab = 'home' | 'capture' | 'review' | 'progress';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [navigationStack, setNavigationStack] = useState<Screen[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<any>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<PracticeSessionSummary | null>(null);

  const screensWithBottomNav: Screen[] = ['home', 'review', 'progress'];
  const showBottomNav = screensWithBottomNav.includes(currentScreen);

  const handleNavigate = (screen: string, data?: any) => {
    if (screen === 'badge-unlocked') {
      setShowBadgeModal(true);
      return;
    }
    
    // Store current screen in navigation stack for back navigation
    if (!['splash', 'onboarding'].includes(currentScreen)) {
      setNavigationStack([...navigationStack, currentScreen]);
    }
    
    if (screen === 'session-results' && data) {
      setSessionSummary(data as PracticeSessionSummary);
    } else if (data) {
      setSelectedMistake(data);
    }
    
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      const previousScreen = navigationStack[navigationStack.length - 1];
      setNavigationStack(navigationStack.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // Default back to home if stack is empty
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setNavigationStack([]); // Clear navigation stack when switching tabs
    
    // Map tabs to screens
    const tabScreenMap: Record<Tab, Screen> = {
      home: 'home',
      capture: 'capture',
      review: 'review',
      progress: 'progress'
    };
    
    setCurrentScreen(tabScreenMap[tab]);
  };

  const handleEriClick = () => {
    // Eri bubble opens context-specific visual coach in each screen
    // Handled per-screen instead of globally
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash onComplete={() => setCurrentScreen('onboarding')} />;
      
      case 'onboarding':
        return (
          <Onboarding
            onComplete={() => {
              setCurrentScreen('home');
              setActiveTab('home');
            }}
          />
        );
      
      case 'home':
        return <Home onNavigate={handleNavigate} onEriClick={handleEriClick} />;
      
      case 'capture':
        return <Capture onNavigate={handleNavigate} onBack={handleBack} />;
      
      case 'capture-details':
        return <CaptureDetails onNavigate={handleNavigate} onBack={handleBack} onEriClick={handleEriClick} />;
      
      case 'mistake-detail':
        return (
          <MistakeDetail
            mistake={selectedMistake}
            onNavigate={handleNavigate}
            onBack={handleBack}
            onEriClick={handleEriClick}
          />
        );
      
      case 'practice':
        return <PracticeSession onNavigate={handleNavigate} onBack={handleBack} onEriClick={handleEriClick} />;

      case 'english-mission':
        return <EnglishMission onNavigate={handleNavigate} onBack={handleBack} />;

      case 'mission-choice':
        return <MissionChoice onNavigate={handleNavigate} onBack={handleBack} />;
      
      case 'session-results':
        return (
          <SessionResults
            onNavigate={handleNavigate}
            onEriClick={handleEriClick}
            summary={sessionSummary ?? undefined}
          />
        );
      
      case 'review':
        return <Review onNavigate={handleNavigate} />;
      
      case 'progress':
        return <Progress onNavigate={handleNavigate} onEriClick={handleEriClick} />;
      
      case 'settings':
        return <Settings onBack={handleBack} />;

      case 'eri-progress':
        return <EriProgress onBack={handleBack} />;
      
      default:
        return <Home onNavigate={handleNavigate} onEriClick={handleEriClick} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="relative w-full min-h-screen max-w-5xl mx-auto bg-white md:border-x md:border-gray-200">
        <Suspense
          fallback={
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-4 border-[#6C5CE7]/20 border-t-[#6C5CE7] animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-3">Loading...</p>
              </div>
            </div>
          }
        >
          {renderScreen()}
        </Suspense>
        
        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        
        {/* Badge Unlocked Modal */}
        <Suspense fallback={null}>
          <BadgeUnlocked
            isOpen={showBadgeModal}
            onClose={() => setShowBadgeModal(false)}
          />
        </Suspense>
      </div>
    </div>
  );
}
