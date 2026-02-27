import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Star, Home, RotateCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EriCharacterSvg } from '../components/EriCharacterSvg';
import {
  AppSettingsState,
  PracticeSessionSummary,
  applyPracticeSession,
  estimateSessionXP,
  getAppSettings,
  getGameProgress,
} from '../data/appState';

interface SessionResultsProps {
  onNavigate: (screen: string) => void;
  onEriClick: () => void;
  score?: number;
  total?: number;
  summary?: PracticeSessionSummary;
}

/* ─── Confetti particle ─── */
function ConfettiPiece({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 60 + Math.random() * 50;
  const colors = ['#6C5CE7', '#FBBF24', '#34D399', '#F472B6', '#60A5FA', '#F97316'];
  const color = colors[index % colors.length];
  const size = 4 + Math.random() * 6;
  const isCircle = index % 3 === 0;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius - 20,
        opacity: [1, 1, 0],
        scale: [0, 1.2, 0.6],
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 1.4 + Math.random() * 0.8,
        delay: 0.3 + index * 0.03,
        ease: 'easeOut',
      }}
      className="absolute"
      style={{
        width: isCircle ? size : size * 1.6,
        height: size,
        backgroundColor: color,
        borderRadius: isCircle ? '50%' : 2,
        top: '50%',
        left: '50%',
      }}
    />
  );
}

/* ─── XP floating number ─── */
function FloatingXP({ value, delay }: { value: number; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: [10, -8, -16, -30], scale: [0.5, 1.1, 1, 0.8] }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className="absolute -top-6 text-sm font-bold text-[#6C5CE7]"
    >
      +{value}
    </motion.span>
  );
}

/* ─── Eri Avatar (large hero) ─── */
function EriHero({ isPerfect, reduceMotion }: { isPerfect: boolean; reduceMotion: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`absolute w-32 h-32 rounded-full ${isPerfect
            ? 'bg-gradient-to-br from-yellow-200/40 to-amber-200/40'
            : 'bg-gradient-to-br from-[#6C5CE7]/15 to-[#8B7FE8]/15'
          }`}
      />

      {/* Avatar circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
        className="relative"
      >
        <EriCharacterSvg
          state={isPerfect ? 'correct' : 'idle'}
          reduceMotion={reduceMotion}
          size={112}
          className="drop-shadow-lg"
        />

        {/* Stars around for mixed */}
        {!isPerfect && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0.8] }}
                transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
                className="absolute"
                style={{
                  top: i === 0 ? -6 : i === 1 ? -2 : 8,
                  [i === 2 ? 'left' : 'right']: i === 0 ? -4 : i === 1 ? -8 : -6,
                }}
              >
                <Star
                  size={i === 0 ? 14 : 11}
                  className="text-[#6C5CE7] fill-[#6C5CE7]/40"
                />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Confetti for perfect */}
      {isPerfect && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} total={24} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── XP Progress Bar ─── */
function XPProgressBar({ xpEarned, currentXP, levelXP }: { xpEarned: number; currentXP: number; levelXP: number }) {
  const [showFloating, setShowFloating] = useState(false);
  const [animateBar, setAnimateBar] = useState(false);
  const startPercent = ((currentXP - xpEarned) / levelXP) * 100;
  const endPercent = (currentXP / levelXP) * 100;

  useEffect(() => {
    const t1 = setTimeout(() => setShowFloating(true), 800);
    const t2 = setTimeout(() => setAnimateBar(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 font-medium">Level 4</span>
        <div className="relative">
          <span className="text-gray-500 font-medium">{currentXP} / {levelXP} XP</span>
          <AnimatePresence>
            {showFloating && (
              <FloatingXP value={xpEarned} delay={0} />
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/60">
        <motion.div
          initial={{ width: `${startPercent}%` }}
          animate={{ width: animateBar ? `${endPercent}%` : `${startPercent}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          className="h-full rounded-full relative"
          style={{
            background: 'linear-gradient(90deg, #6C5CE7 0%, #8B7FE8 60%, #A78BFA 100%)',
          }}
        >
          {/* Shimmer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.5, delay: 1.4, repeat: 2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Score Ring ─── */
function ScoreDisplay({ score, total }: { score: number; total: number }) {
  const percentage = Math.round((score / total) * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 14, delay: 0.6 }}
      className="flex items-center gap-5"
    >
      {/* Circular ring */}
      <div className="relative w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="6"
          />
          <motion.circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke={percentage === 100 ? '#FBBF24' : '#6C5CE7'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl font-bold text-gray-900"
          >
            {score}/{total}
          </motion.span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="text-gray-900 font-bold text-lg"
        >
          {percentage === 100 ? 'Perfect Score!' : `${percentage}% Correct`}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm mt-0.5"
        >
          {percentage === 100
            ? "You nailed every question!"
            : `${score} correct, ${total - score} to review`}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ─── Question Result Row ─── */
function QuestionResult({
  index,
  question,
  correct,
  delay,
  details,
}: {
  index: number;
  question: string;
  correct: boolean;
  delay: number;
  details?: Array<{ label: string; correct: boolean }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 py-2.5"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${correct
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-500'
          }`}
      >
        {correct ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <span className="text-sm text-gray-700">Q{index + 1}: {question}</span>
        {details && details.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {details.map((detail) => (
              <span
                key={detail.label}
                className={`text-[11px] px-2 py-0.5 rounded-full ${detail.correct
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                  }`}
              >
                {detail.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Screen ─── */
export function SessionResults({ onNavigate, onEriClick, score = 2, total = 3, summary }: SessionResultsProps) {
  const isEnglishMission = summary?.missionMode === 'english';
  const resolvedScore = summary?.score ?? score;
  const resolvedTotal = summary?.total ?? (isEnglishMission ? 3 : total);
  const isPerfect = resolvedScore === resolvedTotal;
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());
  const [xpEarned, setXpEarned] = useState(estimateSessionXP(resolvedScore, resolvedTotal));
  const [currentXP, setCurrentXP] = useState(() => getGameProgress().totalXP);
  const levelXP = 400;
  const missionTitle = isEnglishMission
    ? 'English Mission – Write, Speak, Listening'
    : 'KS3 Maths Mixed Practice';

  useEffect(() => {
    if (!summary) {
      return;
    }

    const result = applyPracticeSession(summary);
    setXpEarned(result.rewards.xpEarned || estimateSessionXP(resolvedScore, resolvedTotal));
    setCurrentXP(result.progress.totalXP);
  }, [summary, resolvedScore, resolvedTotal]);

  const questions = isEnglishMission
    ? [
      {
        question: `Write task (${summary?.english?.writeChars ?? 0} chars)`,
        correct: (summary?.english?.writeChars ?? 0) >= 12,
      },
      {
        question: `Speak task (${summary?.english?.speakTurns ?? 0} turn${(summary?.english?.speakTurns ?? 0) === 1 ? '' : 's'})`,
        correct: (summary?.english?.speakTurns ?? 0) > 0,
      },
      {
        question: `Listening task (${summary?.english?.listeningTurns ?? 0} turn${(summary?.english?.listeningTurns ?? 0) === 1 ? '' : 's'})`,
        correct: (summary?.english?.listeningTurns ?? 0) > 0,
      },
    ]
    : (summary?.questionResults?.length
      ? summary.questionResults.map((item) => ({
        question: item.question,
        correct: item.isCorrect,
        details: item.parts?.map((part) => ({
          label: `${part.id.toUpperCase()}: ${part.isCorrect ? '✓' : '✕'}`,
          correct: part.isCorrect,
        })),
      }))
      : []);
  // Adjust based on score prop for demo
  const displayQuestions = questions.map((q) => ({
    ...q,
    correct: isPerfect ? true : q.correct,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] via-white to-white">
      <div className="px-6 pt-12 pb-10">
        {/* ── Hero section with Eri ── */}
        <div className="flex flex-col items-center mb-8">
          {appSettings.showEri && <EriHero isPerfect={isPerfect} reduceMotion={appSettings.reduceMotion} />}

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mt-6 text-center"
          >
            {isPerfect ? (isEnglishMission ? 'English Mission Perfect!' : 'Mission Perfect!') : 'Mission Complete!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-sm mt-1 text-center"
          >
            {isPerfect
              ? isEnglishMission
                ? 'Excellent English practice — Eri is proud of you!'
                : 'Eri is so proud of you!'
              : isEnglishMission
                ? 'Nice progress on write, speak, and listening!'
                : 'Great effort — keep going!'}
          </motion.p>
        </div>

        {/* ── Mission card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm mb-4"
        >
          {/* Mission title */}
          <p className="text-xs text-[#6C5CE7] font-semibold uppercase tracking-wide mb-3">
            Mission Summary
          </p>
          <p className="text-gray-900 font-bold mb-5">{missionTitle}</p>

          {/* Score display */}
          <ScoreDisplay score={resolvedScore} total={resolvedTotal} />

          {/* Divider */}
          <div className="h-px bg-gray-100 my-4" />

          {/* Per-question breakdown */}
          <div>
            {displayQuestions.map((q, i) => (
              <QuestionResult
                key={i}
                index={i}
                question={q.question}
                correct={q.correct}
                details={'details' in q ? q.details : undefined}
                delay={1.1 + i * 0.12}
              />
            ))}
          </div>
        </motion.div>

        {/* ── XP Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-[#6C5CE7]/5 to-[#8B7FE8]/10 rounded-2xl border border-[#6C5CE7]/15 p-5 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">XP Earned</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xs text-gray-500"
              >
                {isPerfect ? 'Perfect bonus included' : `${xpEarned} XP for completing`}
              </motion.p>
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, delay: 0.85 }}
              className="ml-auto"
            >
              <span className="text-xl font-bold text-[#6C5CE7]">+{xpEarned}</span>
            </motion.div>
          </div>

          <XPProgressBar xpEarned={xpEarned} currentXP={currentXP} levelXP={levelXP} />
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          <Button
            onClick={() => {
              onNavigate('home');
            }}
            size="lg"
            fullWidth
            icon={<Home size={18} />}
          >
            Back to Home
          </Button>

          {!isPerfect && (
            <Button
              onClick={() => onNavigate('review')}
              variant="secondary"
              size="lg"
              fullWidth
              icon={<RotateCcw size={18} />}
            >
              Review Mistakes
            </Button>
          )}

          {isPerfect && (
            <Button
              onClick={() => onNavigate('progress')}
              variant="secondary"
              size="lg"
              fullWidth
            >
              View Progress
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
