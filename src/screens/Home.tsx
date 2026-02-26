import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressRing } from '../components/ProgressRing';
import { EriBubble } from '../components/EriBubble';
import { VisualCoachSheet } from '../components/VisualCoachSheet';
import { StepCard } from '../components/StepCard';
import { Settings, Plus, PlayCircle, Clock, AlertCircle, Target, Calendar, Zap, Bot, Camera, CheckCircle2, Circle, Gift } from 'lucide-react';
import { mistakeData } from '../data/mistakeData';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { AppSettingsState, GameProgressState, getAppSettings, getGameProgress } from '../data/appState';
import { EriCharacterSvg } from '../components/EriCharacterSvg';

interface HomeProps {
  onNavigate: (screen: string, data?: any) => void;
  onEriClick: () => void;
}

export function Home({ onNavigate, onEriClick }: HomeProps) {
  const [showVisualCoach, setShowVisualCoach] = useState(false);
  const [progressState] = useState<GameProgressState>(() => getGameProgress());
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());
  const [missions, setMissions] = useState([
    {
      id: 'capture',
      title: 'Capture 1 new mistake',
      xp: '+20',
      done: false,
      icon: <Camera size={18} className="text-[#6C5CE7]" />
    },
    {
      id: 'review',
      title: 'Complete 1 review card that is due today',
      xp: '+20',
      done: true,
      icon: <Clock size={18} className="text-orange-500" />
    },
    {
      id: 'streak',
      title: 'Get 3 correct in a row',
      xp: '+20',
      done: false,
      icon: <Target size={18} className="text-green-600" />
    }
  ]);
  const dueItems = mistakeData.filter((m) => m.dueDate === 'Due today');
  const completedMissions = Math.max(
    missions.filter((mission) => mission.done).length,
    progressState.missionsCompletedToday,
  );

  const toggleMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === missionId ? { ...mission, done: !mission.done } : mission
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning! ☀️</h1>
            <p className="text-gray-600 text-sm mt-0.5">Saturday, Feb 7</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('eri-progress')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/25"
            >
              <Bot size={20} className="text-white" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Settings size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6">
        {appSettings.showEri && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card padding="md" className="bg-gradient-to-r from-[#6C5CE7]/5 to-[#8B7FE8]/10 border-[#6C5CE7]/20">
              <div className="flex items-center gap-4">
                <EriCharacterSvg
                      state={completedMissions >= 2 ? 'correct' : 'idle'}
                  reduceMotion={appSettings.reduceMotion}
                  size={82}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Eri mission helper</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {completedMissions >= 2
                      ? 'Great pace! Claim your reward and keep your streak alive.'
                      : 'Finish 2 missions today to unlock your bonus chest.'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Daily Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" className="bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] border-0 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold mb-1">Today's 10-Minute Mission</h2>
                <p className="text-white/80 text-sm">Complete any 2 to unlock your daily bonus</p>
              </div>
              <ProgressRing progress={(completedMissions / 3) * 100} size={78} strokeWidth={6} animated={false}>
                <div className="text-center">
                  <div className="text-xl font-bold">{completedMissions}</div>
                  <div className="text-xs opacity-80">/3</div>
                </div>
              </ProgressRing>
            </div>

            <div className="mb-3 px-3 py-2 rounded-xl bg-white/15 border border-white/20 text-xs flex items-center justify-between">
              <span className="font-semibold">Current streak: {progressState.streakDays} days</span>
              <span className="font-semibold">Total XP: {progressState.totalXP}</span>
            </div>

            <div className="space-y-2.5">
              {missions.map((mission) => (
                <button
                  key={mission.id}
                  onClick={() => toggleMission(mission.id)}
                  className="w-full bg-white/12 hover:bg-white/20 border border-white/20 rounded-2xl px-3 py-3 flex items-center gap-3 text-left transition-colors"
                >
                  <div className="shrink-0">{mission.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-tight">{mission.title}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/20 border border-white/25 font-semibold text-white">
                    XP {mission.xp}
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {mission.done ? (
                        <motion.div
                          key="checked"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.14, ease: 'easeOut' }}
                        >
                          <CheckCircle2 size={18} className="text-green-300" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.12, ease: 'easeOut' }}
                        >
                          <Circle size={18} className="text-white/70" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button
                onClick={() => onNavigate('mission-choice')}
                variant="secondary"
                fullWidth
                icon={<PlayCircle size={20} />}
              >
                Start Mission
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={() => onNavigate('capture')}
            variant="ghost"
            fullWidth
            icon={<Plus size={20} />}
          >
            Add a Mistake
          </Button>
        </motion.div>
        
        {/* Due for Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-[#6C5CE7]" />
              Due for Review
            </h3>
            <span className="text-sm text-gray-500">{dueItems.length} items</span>
          </div>
          
          <div className="space-y-3">
            {dueItems.map((mistake, index) => (
              <motion.div
                key={mistake.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card
                  onClick={() => onNavigate('mistake-detail', mistake)}
                  padding="md"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {mistake.question}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {mistake.topic}
                        </span>
                        <span>•</span>
                        <span className="text-red-600 font-medium">{mistake.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {completedMissions >= 2 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 16, stiffness: 420, mass: 0.6 }}
            className="fixed left-4 right-4 bottom-24 z-40"
          >
            <Card padding="md" className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] border-0 text-white shadow-xl shadow-[#6C5CE7]/30">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Bot size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Daily bonus unlocked!</p>
                  <p className="text-xs text-white/90">Eri is cheering for you — claim your reward chest.</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <Gift size={18} className="text-yellow-200" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Eri Bubble */}
      {appSettings.showEri && (
        <EriBubble
          state="idle"
          onClick={() => {
            onEriClick();
            setShowVisualCoach(true);
          }}
        />
      )}
      
      {/* Visual Coach Sheet */}
      <VisualCoachSheet
        isOpen={showVisualCoach}
        onClose={() => setShowVisualCoach(false)}
        title="Your Daily Strategy"
      >
        <div className="space-y-4 pb-6">
          <p className="text-gray-600 text-sm">
            Master your mistakes with this proven 3-step system:
          </p>
          
          <StepCard
            step={1}
            title="Complete Daily Mission"
            icon={<Target size={20} className="text-[#6C5CE7]" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Just 10 minutes a day builds strong habits. Focus on quality practice!
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Today's Progress</span>
                  <span className="text-xs font-medium text-[#6C5CE7]">3/10 min</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-[#6C5CE7] h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">📊 Students who practice daily improve 42% faster</p>
            </div>
          </StepCard>
          
          <StepCard
            step={2}
            title="Review What's Due"
            icon={<Calendar size={20} className="text-orange-500" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Spaced repetition helps you remember. Check items marked "Due today".
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Adding Fractions</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded">Due now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Pythagorean Theorem</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded">Due now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">BODMAS Order</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded">Due tmrw</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">🔄 Review at optimal intervals boosts retention by 3x</p>
            </div>
          </StepCard>
          
          <StepCard
            step={3}
            title="Add New Mistakes"
            icon={<Zap size={20} className="text-blue-500" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Capture errors quickly after tests or homework. Turn weaknesses into strengths!
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">Your Stats</p>
                    <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#6C5CE7]">12</p>
                    <p className="text-xs text-gray-500">mistakes added</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">⚡ Students with 10+ mistakes show 68% better exam scores</p>
            </div>
          </StepCard>
          
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] rounded-2xl p-4 mt-4 text-white">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔥</div>
              <div>
                <p className="font-medium text-sm mb-1">5-day streak active!</p>
                <p className="text-xs text-white/90">You're on track to unlock the "Consistency Champion" badge at 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </VisualCoachSheet>
    </div>
  );
}
