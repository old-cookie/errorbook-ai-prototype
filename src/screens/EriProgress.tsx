import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { ChevronLeft, Sparkles, Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { EriCharacterSvg } from '../components/EriCharacterSvg';
import { AppSettingsState, getAppSettings } from '../data/appState';

interface EriProgressProps {
  onBack: () => void;
}

const evolutionStages = ['Egg', 'Buddy', 'Mentor', 'Master'];
const currentStageIndex = 2;

const unlockedPerks = [
  'New encouragement messages',
  'Special badge border'
];

export function EriProgress({ onBack }: EriProgressProps) {
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());
  const level = 7;
  const levelTitle = "Learner's Ally";
  const ringProgress = 76;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Eri Progress</h1>
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
                  state={ringProgress >= 75 ? 'correct' : 'thinking'}
                  reduceMotion={appSettings.reduceMotion}
                  size={84}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Eri evolution guide</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {ringProgress >= 75
                      ? 'You are close to the next form. Keep completing missions for the final push.'
                      : 'Steady growth. Daily practice and review will evolve Eri faster.'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex justify-center mb-4">
              <ProgressRing progress={ringProgress} size={180} strokeWidth={10}>
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/20 overflow-hidden">
                  <EriCharacterSvg
                    state={ringProgress >= 85 ? 'correct' : ringProgress >= 60 ? 'idle' : 'thinking'}
                    reduceMotion={appSettings.reduceMotion}
                    size={92}
                    showLabel={false}
                    className="-mb-1"
                  />
                </div>
              </ProgressRing>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600">Current level</p>
              <h2 className="text-2xl font-bold text-gray-900">Level {level}</h2>
              <p className="text-[#6C5CE7] font-semibold">{levelTitle}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#6C5CE7]" />
              <h3 className="text-lg font-bold text-gray-900">Evolution path</h3>
            </div>

            <div className="flex items-center justify-between gap-2">
              {evolutionStages.map((stage, index) => {
                const isCurrent = index === currentStageIndex;
                const isReached = index <= currentStageIndex;

                return (
                  <div key={stage} className="flex-1 flex flex-col items-center min-w-0">
                    <div className="w-full flex items-center">
                      {index > 0 && (
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            isReached ? 'bg-[#6C5CE7]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0 ${
                          isCurrent
                            ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white'
                            : isReached
                              ? 'bg-purple-100 border-purple-300 text-[#6C5CE7]'
                              : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < evolutionStages.length - 1 && (
                        <div
                          className={`h-1 flex-1 rounded-full ${
                            index < currentStageIndex ? 'bg-[#6C5CE7]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? 'text-[#6C5CE7]' : isReached ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {stage}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Card padding="md" className="bg-gradient-to-br from-white to-purple-50/40 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Next evolution in 240 XP</p>
              <span className="text-xs font-semibold text-[#6C5CE7]">760 / 1000 XP</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] rounded-full" style={{ width: '76%' }} />
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-[#6C5CE7]" />
              <h3 className="text-base font-bold text-gray-900">Perks unlocked</h3>
            </div>
            <div className="space-y-2.5">
              {unlockedPerks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                  <p className="text-sm text-gray-700">{perk}</p>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-xs text-gray-500 leading-relaxed px-1">
            XP comes from adding mistakes, completing missions, and reviewing due cards.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
