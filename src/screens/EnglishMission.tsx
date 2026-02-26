import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, Mic, PencilLine, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EriCharacterSvg, EriCharacterState } from '../components/EriCharacterSvg';
import { AppSettingsState, getAppSettings } from '../data/appState';
import { EnglishMissionPhase, englishMissionSteps } from '../data/englishMissionData';

interface EnglishMissionProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

const phaseIconMap: Record<EnglishMissionPhase, ReactNode> = {
  write: <PencilLine size={16} className="text-[#6C5CE7]" />,
  speak: <Mic size={16} className="text-[#6C5CE7]" />,
  listening: <Volume2 size={16} className="text-[#6C5CE7]" />,
};

const phaseCharacterMap: Record<EnglishMissionPhase, EriCharacterState> = {
  write: 'thinking',
  speak: 'listening',
  listening: 'speaking',
};

export function EnglishMission({ onNavigate, onBack }: EnglishMissionProps) {
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [writingText, setWritingText] = useState('');
  const [speakTurns, setSpeakTurns] = useState(0);
  const [listeningTurns, setListeningTurns] = useState(0);
  const [sessionId] = useState(() => `english-${Date.now()}`);

  const activeStep = englishMissionSteps[phaseIndex];
  const isLastPhase = phaseIndex === englishMissionSteps.length - 1;

  const completedPhases = useMemo(
    () => englishMissionSteps.slice(0, phaseIndex + 1).map((step) => step.phase),
    [phaseIndex],
  );

  const canContinue =
    activeStep.phase !== 'write' || writingText.trim().length >= 12;

  const finishMission = () => {
    onNavigate('session-results', {
      sessionId,
      score: 3,
      total: 3,
      hintsUsed: 0,
      missionMode: 'english',
      english: {
        completedPhases,
        writeChars: writingText.trim().length,
        speakTurns,
        listeningTurns,
      },
    });
  };

  const handlePrimaryAction = () => {
    if (activeStep.phase === 'speak') {
      setSpeakTurns((prev) => prev + 1);
    }

    if (activeStep.phase === 'listening') {
      setListeningTurns((prev) => prev + 1);
    }

    if (isLastPhase) {
      finishMission();
      return;
    }

    setPhaseIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-28">
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">English Mission</h1>
          </div>
          <div className="text-sm text-gray-600">{phaseIndex + 1} / 3</div>
        </div>
      </div>

      <div className="px-5 pt-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((phaseIndex + 1) / 3) * 100}%` }}
            className="h-full bg-[#6C5CE7]"
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </div>

      <div className="px-5 pt-5 pb-8 space-y-4">
        <Card padding="md" className="border-[#6C5CE7]/20 bg-[#6C5CE7]/5">
          <div className="flex items-center gap-2">
            {phaseIconMap[activeStep.phase]}
            <p className="text-sm font-semibold text-[#6C5CE7] uppercase tracking-wide">{activeStep.title}</p>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-3">{activeStep.demoQuestion}</p>
          <p className="text-base font-semibold text-gray-900 mt-3">{activeStep.instruction}</p>
          <p className="text-sm text-gray-600 mt-2">Eri: {activeStep.coachLine}</p>
        </Card>

        {activeStep.phase === 'write' ? (
          <Card padding="md" className="py-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your writing</label>
            <textarea
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
              placeholder="Today I had math class. I learned fractions..."
              className="w-full min-h-[160px] rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none p-4 text-base"
            />
            <p className="text-xs text-gray-500 mt-2">Minimum 12 characters to continue.</p>
          </Card>
        ) : (
          <div className="min-h-[420px] rounded-3xl bg-white border border-gray-200 flex flex-col items-center justify-center px-8 py-8 text-center">
            {appSettings.showEri && (
              <EriCharacterSvg
                state={phaseCharacterMap[activeStep.phase]}
                reduceMotion={appSettings.reduceMotion}
                size={188}
                className="mb-3"
              />
            )}
            <p className="text-base font-semibold text-gray-900">
              {activeStep.phase === 'speak'
                ? 'Speak now. Eri is listening to you in the middle stage.'
                : 'Listen now. Eri is speaking in the middle stage.'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {activeStep.phase === 'speak'
                ? `Speaking turns: ${speakTurns}`
                : `Listening turns: ${listeningTurns}`}
            </p>
          </div>
        )}

        <div className="pt-1">
          <Button
            onClick={handlePrimaryAction}
            fullWidth
            size="lg"
            disabled={!canContinue}
          >
            {isLastPhase ? 'Finish Mission' : activeStep.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
