import { motion, AnimatePresence } from 'motion/react';
import { Bot, CheckCircle2, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface EriFeedbackToastProps {
  isOpen: boolean;
  type: 'correct' | 'incorrect' | null;
  onClose: () => void;
  onShowHint?: () => void;
  onAdvance?: () => void;
  correctAnswer?: string;
  autoDismissMs?: number;
  questionIndex?: number;
}

const correctMessages = [
  "Great job! You've mastered this step.",
  "Brilliant! That's exactly right.",
  "Perfect! You're on a roll!",
];

const incorrectMessages = [
  "Nice try — this is a method selection issue. Want a hint?",
  "Almost there — let's revisit the approach together.",
  "Good effort — a small fix will get you there!",
];

export function EriFeedbackToast({
  isOpen,
  type,
  onClose,
  onShowHint,
  onAdvance,
  correctAnswer,
  autoDismissMs = 2400,
  questionIndex = 0,
}: EriFeedbackToastProps) {
  // Auto-dismiss for correct answers only — incorrect stays until user acts
  const handleAutoDismiss = useCallback(() => {
    onClose();
    // Advance to next question after the exit animation
    if (onAdvance) {
      setTimeout(onAdvance, 350);
    }
  }, [onClose, onAdvance]);

  useEffect(() => {
    if (isOpen && type === 'correct') {
      const t = setTimeout(handleAutoDismiss, autoDismissMs);
      return () => clearTimeout(t);
    }
  }, [isOpen, type, autoDismissMs, handleAutoDismiss]);

  const msg =
    type === 'correct'
      ? correctMessages[questionIndex % correctMessages.length]
      : incorrectMessages[questionIndex % incorrectMessages.length];

  return (
    <AnimatePresence>
      {isOpen && type && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="fixed bottom-28 left-4 right-4 z-[60] max-w-[370px] mx-auto"
        >
          <div
            className={`rounded-2xl shadow-lg px-4 py-4 ${type === 'correct'
                ? 'bg-green-50 border border-green-200/80'
                : 'bg-amber-50 border border-amber-200/80'
              }`}
            style={{
              boxShadow:
                type === 'correct'
                  ? '0 8px 32px rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.06)'
                  : '0 8px 32px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-start gap-3">
              {/* Eri avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${type === 'correct'
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                      : 'bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8]'
                    }`}
                >
                  <Bot size={22} className="text-white" strokeWidth={2.5} />
                </div>
                {/* State badge on avatar */}
                {type === 'correct' ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.15 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles size={14} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.15 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center"
                  >
                    <HelpCircle size={11} className="text-amber-500" />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${type === 'correct' ? 'text-green-600' : 'text-amber-600'
                      }`}
                  >
                    Eri
                  </span>
                  {type === 'correct' && (
                    <CheckCircle2 size={13} className="text-green-500" />
                  )}
                </div>
                <p
                  className={`text-sm leading-snug ${type === 'correct' ? 'text-green-800' : 'text-amber-800'
                    }`}
                >
                  {msg}
                </p>

                {/* Incorrect: show correct answer + hint button */}
                {type === 'incorrect' && (
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    {correctAnswer && (
                      <span className="text-xs text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                        Answer: <span className="font-semibold">{correctAnswer}</span>
                      </span>
                    )}
                    {onShowHint && (
                      <button
                        onClick={onShowHint}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6C5CE7] text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                      >
                        <Lightbulb size={12} />
                        Show Hint
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => {
                  onClose();
                  if (type === 'correct' && onAdvance) {
                    setTimeout(onAdvance, 350);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0 -mt-0.5 -mr-0.5"
                aria-label="Dismiss"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={
                      type === 'correct' ? 'text-green-300' : 'text-amber-300'
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
