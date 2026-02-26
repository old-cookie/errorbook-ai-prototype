import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { EriBubble } from '../components/EriBubble';
import { VisualCoachSheet } from '../components/VisualCoachSheet';
import { StepCard } from '../components/StepCard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Award,
  Brain,
  Lightbulb,
  Sparkles,
  Shield,
  Snowflake,
  CalendarDays
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AppSettingsState, GameProgressState, getAppSettings, getGameProgress } from '../data/appState';
import { EriCharacterSvg } from '../components/EriCharacterSvg';

interface ProgressProps {
  onNavigate: (screen: string) => void;
  onEriClick: () => void;
}

const weeklyData = [
  { day: 'Mon', score: 60, practiced: true },
  { day: 'Tue', score: 70, practiced: true },
  { day: 'Wed', score: 65, practiced: false },
  { day: 'Thu', score: 80, practiced: true },
  { day: 'Fri', score: 75, practiced: true },
  { day: 'Sat', score: 85, practiced: true },
  { day: 'Sun', score: 90, practiced: false }
];

const topicWeakness = [
  { topic: 'Fractions', weakness: 75, color: '#EF4444', reward: '+20 XP' },
  { topic: 'Algebra basics', weakness: 45, color: '#F59E0B', reward: '+12 XP' },
  { topic: 'Percentages', weakness: 30, color: '#10B981', reward: '+8 XP' }
];

const badgeCategories = [
  {
    category: 'Recording',
    badges: [
      { id: 1, icon: '📝', name: 'Quick Logger', progress: '2 / 3' },
      { id: 2, icon: '📸', name: 'Scan Starter', progress: '1 / 3' }
    ]
  },
  {
    category: 'Streak',
    badges: [
      { id: 3, icon: '🔥', name: '7-Day Streak', progress: '2 / 3' },
      { id: 4, icon: '📅', name: 'Weekend Keeper', progress: '1 / 3' }
    ]
  },
  {
    category: 'Accuracy',
    badges: [
      { id: 5, icon: '🎯', name: 'Precision Path', progress: '2 / 3' },
      { id: 6, icon: '✅', name: 'Clean Streak', progress: '1 / 3' }
    ]
  },
  {
    category: 'Weakness Fixing',
    badges: [
      { id: 7, icon: '🛠️', name: 'Fraction Fixer', progress: '2 / 3' },
      { id: 8, icon: '📈', name: 'Bounce Back', progress: '1 / 3' }
    ]
  }
];

export function Progress({ onNavigate, onEriClick }: ProgressProps) {
  const [showVisualCoach, setShowVisualCoach] = useState(false);
  const [showStreakFreezeModal, setShowStreakFreezeModal] = useState(false);
  const [progressState] = useState<GameProgressState>(() => getGameProgress());
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());

  const currentXp = progressState.totalXP;
  const nextLevelXp = 1500;
  const levelProgress = Math.round((currentXp / nextLevelXp) * 100);
  const hasPracticedToday = false;

  useEffect(() => {
    if (!hasPracticedToday) {
      const timeout = window.setTimeout(() => {
        setShowStreakFreezeModal(true);
      }, 900);

      return () => window.clearTimeout(timeout);
    }
  }, [hasPracticedToday]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-600 text-sm mt-1">Track your improvement</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {appSettings.showEri && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="md" className="bg-gradient-to-r from-[#6C5CE7]/5 to-[#8B7FE8]/10 border-[#6C5CE7]/20">
              <div className="flex items-center gap-4">
                <EriCharacterSvg
                  state={progressState.streakDays >= 7 ? 'correct' : 'thinking'}
                  reduceMotion={appSettings.reduceMotion}
                  size={82}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Eri progress coach</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {progressState.streakDays >= 7
                      ? 'Strong consistency. Focus Fractions first for faster XP gain.'
                      : 'One more focused session today can rebuild momentum.'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card padding="md" className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={20} className="text-orange-600" />
                <span className="text-2xl font-bold text-orange-900">{progressState.streakDays}</span>
              </div>
              <p className="text-orange-800 font-medium text-sm">Day Streak</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#6C5CE7]/20 bg-[#6C5CE7]/10">
                <Snowflake size={12} className="text-[#6C5CE7]" />
                <span className="text-[10px] font-semibold text-[#6C5CE7]">1 Streak Freeze available</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-purple-600" />
                <span className="text-2xl font-bold text-purple-900">{progressState.badgesEarned}</span>
              </div>
              <p className="text-purple-800 font-medium text-sm">Badges Earned</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="md" className="bg-gradient-to-br from-indigo-50 to-violet-100 border-violet-200 h-full">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-[#6C5CE7]" />
                <span className="text-lg font-bold text-violet-900">Level 7</span>
              </div>
              <p className="text-violet-800 font-medium text-xs">Focused Fixer</p>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card padding="md" className="bg-gradient-to-r from-white to-purple-50/60 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 text-sm">XP Progress</p>
              <span className="text-xs font-semibold text-[#6C5CE7]">{currentXp} / 1500 XP to Level 8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8]"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-[#6C5CE7]" />
              <h3 className="text-lg font-bold text-gray-900">Badge Journey</h3>
            </div>
            <span className="text-sm text-gray-600">Scrollable</span>
          </div>

          <Card padding="md" className="max-h-[320px] overflow-y-auto">
            <div className="space-y-4">
              {badgeCategories.map((group) => (
                <div key={group.category}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{group.category}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.badges.map((badge) => (
                      <Card
                        key={badge.id}
                        onClick={() => onNavigate('badge-unlocked')}
                        padding="sm"
                        className="bg-gradient-to-br from-gray-50 to-white border-gray-200"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-2xl leading-none">{badge.icon}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{badge.name}</p>
                            <span className="mt-1 inline-flex items-center rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                              {badge.progress}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">Weekly Progress</h3>
          </div>

          <Card padding="lg">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.practiced ? '#6C5CE7' : '#C4BDEB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {weeklyData.map((item) => (
                <div
                  key={item.day}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] border ${
                    item.practiced
                      ? 'bg-orange-50 text-orange-600 border-orange-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  <Flame size={10} />
                  <span>{item.day}</span>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-600 text-sm mt-3">Average score: 75% ↗ +10% from last week</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">Weakness Map</h3>
          </div>

          <Card padding="lg">
            <div className="space-y-4">
              {topicWeakness.map((item, index) => (
                <motion.div
                  key={item.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-[#6C5CE7]" />
                      <span className="font-medium text-gray-900">{item.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 font-semibold">
                        {item.reward}
                      </span>
                      <Chip variant={item.weakness > 60 ? 'error' : item.weakness > 40 ? 'default' : 'success'}>
                        {item.weakness}% errors
                      </Chip>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.weakness}%` }}
                      transition={{ delay: 0.45 + index * 0.1, type: 'spring' }}
                      style={{ backgroundColor: item.color }}
                      className="h-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-4">💡 Fixing Fractions this week can unlock your next tier badge faster.</p>
          </Card>
        </motion.div>
      </div>

      {appSettings.showEri && (
        <EriBubble
          state="idle"
          onClick={() => {
            onEriClick();
            setShowVisualCoach(true);
          }}
        />
      )}

      <VisualCoachSheet
        isOpen={showVisualCoach}
        onClose={() => setShowVisualCoach(false)}
        title="Reading Your Progress"
      >
        <div className="space-y-4 pb-6">
          <p className="text-gray-600 text-sm">Your data tells a powerful story—here's how to use it:</p>

          <StepCard
            step={1}
            title="Analyze Your Trends"
            icon={<TrendingUp size={20} className="text-[#6C5CE7]" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Track your weekly chart for patterns and improvement.</p>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Your Trend</span>
                  <span className="text-xs font-medium text-green-600">↗ +10%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[60, 70, 65, 80, 75, 85, 90].map((val, i) => (
                    <div key={i} className="flex-1 bg-[#6C5CE7] rounded-sm" style={{ height: `${val / 2}px` }} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500">📈 Consistent upward trend = mastery building!</p>
            </div>
          </StepCard>

          <StepCard
            step={2}
            title="Target Your Weaknesses"
            icon={<Target size={20} className="text-red-500" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Focus on topics with the highest error rates first.</p>
              <div className="bg-white rounded-lg p-3 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">🎯 Priority: Fractions</span>
                  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded">75% errors</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-600 pt-1">⚡ Practice 5 fraction problems today to reduce this by 20%</p>
              </div>
              <p className="text-xs text-gray-500">🎯 Top weakness = biggest opportunity for gains</p>
            </div>
          </StepCard>

          <StepCard
            step={3}
            title="Celebrate Milestones"
            icon={<Trophy size={20} className="text-yellow-600" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Badges mark real achievements—use them as motivation!</p>
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">🔥</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">7-Day Streak</p>
                    <p className="text-xs text-gray-600">Earned 2 days ago</p>
                  </div>
                </div>
                <div className="bg-white/50 rounded p-2 mt-2">
                  <p className="text-xs text-gray-700">
                    <strong>Next Goal:</strong> Maintain 14 days for "Consistency Master" 🏆
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">🏆 Small wins build lasting habits</p>
            </div>
          </StepCard>

          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] rounded-2xl p-4 mt-4 text-white">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-medium text-sm mb-1">Smart Study Tip</p>
                <p className="text-xs text-white/90">
                  Spend 70% of your time on your top weakness (Fractions) and 30% reviewing everything else for balanced growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </VisualCoachSheet>

      <Modal isOpen={showStreakFreezeModal} onClose={() => setShowStreakFreezeModal(false)} title="Heading to bed?">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#6C5CE7]/20 bg-[#6C5CE7]/5 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-white" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Use a Streak Freeze so your 7-day streak stays safe. Eri believes in you.
            </p>
          </div>

          <Button
            fullWidth
            onClick={() => setShowStreakFreezeModal(false)}
            icon={<Snowflake size={18} />}
          >
            Use Streak Freeze
          </Button>
          <Button fullWidth variant="secondary" onClick={() => setShowStreakFreezeModal(false)} icon={<Brain size={18} />}>
            I'll practice now
          </Button>
        </div>
      </Modal>
    </div>
  );
}
