import { useState, useCallback } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EriBubble } from '../components/EriBubble';
import { VisualCoachSheet } from '../components/VisualCoachSheet';
import { StepCard } from '../components/StepCard';
import { HintToken } from '../components/HintToken';
import { FractionBar } from '../components/FractionBar';
import { EriCharacterSvg, EriCharacterState } from '../components/EriCharacterSvg';
import { ChevronLeft, CheckCircle2, X, ArrowRight, Brain, Lightbulb, Target, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EriFeedbackToast } from '../components/EriFeedbackToast';
import { AppSettingsState, getAppSettings } from '../data/appState';

interface PracticeSessionProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onEriClick: () => void;
}

const practiceQuestions = [
  {
    id: 1,
    question: 'Calculate 1/2 + 1/3',
    correctAnswer: '5/6',
    hints: [
      {
        title: 'Hint 1: Check denominators',
        visual: (
          <div className="space-y-3">
            <p className="text-center text-sm font-semibold text-gray-700">Denominators are different!</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <FractionBar numerator={1} denominator={2} showHighlight color="#EF4444" />
                <div className="mt-2 px-3 py-1 bg-yellow-100 border-2 border-yellow-400 rounded-full text-xs font-bold">
                  2
                </div>
              </div>
              <div className="text-center">
                <FractionBar numerator={1} denominator={3} showHighlight color="#3B82F6" />
                <div className="mt-2 px-3 py-1 bg-yellow-100 border-2 border-yellow-400 rounded-full text-xs font-bold">
                  3
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 2: Find LCM',
        visual: (
          <div className="space-y-3">
            <p className="text-center text-sm font-semibold text-gray-700">LCM(2, 3) = 6</p>
            <div className="bg-[#6C5CE7]/10 rounded-xl p-4">
              <div className="flex justify-around text-xs text-gray-600">
                <div className="text-center">
                  <p className="font-bold text-gray-900 mb-1">2:</p>
                  <p>2, 4, <span className="text-[#6C5CE7] font-bold text-base">6</span></p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 mb-1">3:</p>
                  <p>3, <span className="text-[#6C5CE7] font-bold text-base">6</span></p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Convert & add',
        visual: (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">1/2 = 3/6</p>
                <FractionBar numerator={3} denominator={6} color="#10B981" />
              </div>
              <span className="text-lg font-bold text-gray-400">+</span>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">1/3 = 2/6</p>
                <FractionBar numerator={2} denominator={6} color="#10B981" />
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight size={24} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-2">3 + 2 = 5</p>
              <FractionBar numerator={5} denominator={6} color="#6C5CE7" />
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 2,
    question: 'Solve: 3x - 7 = 11',
    correctAnswer: 'x = 6',
    hints: [
      {
        title: 'Hint 1: Isolate variable',
        visual: (
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold text-gray-700">Add 7 to both sides</p>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-lg font-bold text-gray-900">3x - 7 + 7 = 11 + 7</p>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 2: Simplify',
        visual: (
          <div className="space-y-3 text-center">
            <p className="text-lg font-bold text-gray-900">3x = 18</p>
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3].map((group) => (
                <div key={group} className="flex flex-col gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-8 h-1 bg-[#6C5CE7] rounded" />
                  ))}
                  <p className="text-xs font-bold text-gray-700 mt-1">x</p>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Divide by 3',
        visual: (
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold text-gray-700">3x ÷ 3 = 18 ÷ 3</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-900">x = 6</p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 3,
    question: 'What is 20% of 150?',
    correctAnswer: '30',
    hints: [
      {
        title: 'Hint 1: Convert percent',
        visual: (
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-gray-700">20% = 0.20</p>
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded ${
                    i < 20 ? 'bg-[#6C5CE7]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">20 out of 100 squares</p>
          </div>
        )
      },
      {
        title: 'Hint 2: Multiply',
        visual: (
          <div className="text-center space-y-3">
            <p className="text-lg font-bold text-gray-900">0.20 × 150</p>
            <div className="bg-[#6C5CE7]/10 rounded-xl p-4">
              <p className="text-sm text-gray-700">= 20/100 × 150</p>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Calculate',
        visual: (
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-gray-700">20 × 150 ÷ 100</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-900">= 30</p>
            </div>
          </div>
        )
      }
    ]
  }
];

export function PracticeSession({ onNavigate, onBack, onEriClick }: PracticeSessionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showVisualCoach, setShowVisualCoach] = useState(false);
  const [showMetaCoach, setShowMetaCoach] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [unlockedHints, setUnlockedHints] = useState(1);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [characterState, setCharacterState] = useState<EriCharacterState>('idle');
  const [appSettings] = useState<AppSettingsState>(() => getAppSettings());
  
  const question = practiceQuestions[currentQuestion];
  
  const advanceToNext = useCallback(() => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setFeedback(null);
      setShowFeedbackToast(false);
      setCurrentHint(0);
      setUnlockedHints(1);
      setCharacterState('idle');
    } else {
      onNavigate('session-results', {
        sessionId,
        score,
        total: practiceQuestions.length,
        hintsUsed,
      });
    }
  }, [currentQuestion, onNavigate, sessionId, score, hintsUsed]);

  const handleSubmit = () => {
    const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setCharacterState(isCorrect ? 'correct' : 'wrong');
    setShowFeedbackToast(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleDismissToast = useCallback(() => {
    setShowFeedbackToast(false);
  }, []);

  const handleToastShowHint = () => {
    setShowFeedbackToast(false);
    setHintsUsed((prev) => prev + 1);
    setCharacterState('hint');
    setShowVisualCoach(true);
  };
  
  const handleShowHint = () => {
    setHintsUsed((prev) => prev + 1);
    setCharacterState('hint');
    setShowVisualCoach(true);
  };
  
  const handleNextHint = () => {
    if (currentHint < question.hints.length - 1) {
      setCurrentHint(currentHint + 1);
      setUnlockedHints(Math.max(unlockedHints, currentHint + 2));
      setCharacterState('hint');
    }
  };
  
  const handleSelectHint = (index: number) => {
    if (index < unlockedHints) {
      setCurrentHint(index);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Practice</h1>
          </div>
          <div className="text-sm text-gray-600">
            {currentQuestion + 1} / {practiceQuestions.length}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / practiceQuestions.length) * 100}%` }}
            className="h-full bg-[#6C5CE7]"
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>
      </div>
      
      <div className="px-6 py-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Question */}
            <Card padding="lg" className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your answer:
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setAnswer(nextValue);
                      if (!feedback) {
                        setCharacterState(nextValue.trim() ? 'thinking' : 'idle');
                      }
                    }}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none text-lg"
                    disabled={feedback !== null}
                  />
                </div>
              </div>
            </Card>
            
            {/* Actions */}
            <div className="space-y-3">
              {!feedback && (
                <>
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    fullWidth
                    disabled={!answer.trim()}
                  >
                    Submit Answer
                  </Button>
                  
                  <button
                    onClick={handleShowHint}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-gray-700 font-semibold">Ask Eri for Hints</span>
                      <div className="flex gap-2">
                        {question.hints.map((_, index) => (
                          <HintToken
                            key={index}
                            number={(index + 1) as 1 | 2 | 3}
                            isUnlocked={index < unlockedHints}
                            isCurrent={index === currentHint}
                            isInteractive={false}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                </>
              )}

              {/* Post-feedback actions for incorrect answers */}
              {feedback === 'incorrect' && !showFeedbackToast && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleShowHint}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Lightbulb size={18} className="text-[#6C5CE7]" />
                      <span className="text-gray-700 font-semibold">Review Hints</span>
                    </div>
                  </button>

                  <Button
                    onClick={advanceToNext}
                    size="lg"
                    fullWidth
                    variant="secondary"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Next Question
                      <ChevronRight size={18} />
                    </span>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {appSettings.showEri && (
        <div className="px-6 pb-6">
          <Card padding="md" className="bg-gradient-to-r from-[#6C5CE7]/5 to-[#8B7FE8]/10 border-[#6C5CE7]/15">
            <div className="flex items-center gap-4">
              <EriCharacterSvg
                state={characterState}
                reduceMotion={appSettings.reduceMotion}
                size={92}
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Eri Companion</p>
                <p className="text-xs text-gray-600 mt-1">
                  {characterState === 'correct'
                    ? 'Great solve. Keep momentum for the next question!'
                    : characterState === 'wrong'
                      ? 'No worries—use hints step by step and retry the logic.'
                      : characterState === 'hint'
                        ? 'I unlocked a visual hint. Try the next step yourself first.'
                        : characterState === 'thinking'
                          ? 'Nice thinking. Check your final arithmetic once more.'
                          : 'I am here while you solve. Start with your first step.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Eri Bubble */}
      {appSettings.showEri && (
        <EriBubble
          state={feedback === 'correct' ? 'celebrating' : 'listening'}
          onClick={() => {
            onEriClick();
            setShowMetaCoach(true);
          }}
        />
      )}
      
      {/* Visual Coach - Hints */}
      <VisualCoachSheet
        isOpen={showVisualCoach}
        onClose={() => setShowVisualCoach(false)}
        title={question.hints[currentHint].title}
      >
        <div className="space-y-6">
          {/* Hint Token Selector */}
          <div className="flex justify-center gap-4">
            {question.hints.map((_, index) => (
              <HintToken
                key={index}
                number={(index + 1) as 1 | 2 | 3}
                isUnlocked={index < unlockedHints}
                isCurrent={index === currentHint}
                onClick={() => handleSelectHint(index)}
              />
            ))}
          </div>
          
          {/* Visual Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHint}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card padding="lg" className="bg-white">
                {question.hints[currentHint].visual}
              </Card>
            </motion.div>
          </AnimatePresence>
          
          {/* Next Hint Button */}
          {currentHint < question.hints.length - 1 && (
            <Button
              onClick={handleNextHint}
              variant="secondary"
              fullWidth
            >
              Unlock Next Hint ({currentHint + 2}/3)
            </Button>
          )}
          
          {currentHint === question.hints.length - 1 && (
            <div className="text-center">
              <p className="text-sm text-gray-600">All hints revealed! 🎯</p>
            </div>
          )}
        </div>
      </VisualCoachSheet>
      
      {/* Meta Coach - Practice Strategy */}
      <VisualCoachSheet
        isOpen={showMetaCoach}
        onClose={() => setShowMetaCoach(false)}
        title="Smart Practice Strategy"
      >
        <div className="space-y-4 pb-6">
          <p className="text-gray-600 text-sm">
            Master these 3 techniques to get the most from every practice session:
          </p>
          
          <StepCard
            step={1}
            title="Try First, Then Ask"
            icon={<Brain size={20} className="text-[#6C5CE7]" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Attempt the problem yourself before using hints—this builds problem-solving skills.
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">1</div>
                    <span className="text-xs text-gray-700">Read the question carefully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">2</div>
                    <span className="text-xs text-gray-700">Write your working out</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-xs font-bold text-yellow-700">3</div>
                    <span className="text-xs text-gray-700">Stuck? Use Hint 1 only</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">💪 Struggling first = deeper learning!</p>
            </div>
          </StepCard>
          
          <StepCard
            step={2}
            title="Use Hints Progressively"
            icon={<Lightbulb size={20} className="text-yellow-600" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Hints unlock step-by-step. Try after each one before revealing more.
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex justify-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white font-bold">1</div>
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">2</div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">3</div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-bold text-[#6C5CE7]">Hint 1:</span> Quick nudge in right direction</p>
                  <p><span className="font-bold text-orange-500">Hint 2:</span> Shows the key step visually</p>
                  <p><span className="font-bold text-blue-500">Hint 3:</span> Full solution breakdown</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">🎯 Each hint builds on the last</p>
            </div>
          </StepCard>
          
          <StepCard
            step={3}
            title="Learn From Mistakes"
            icon={<Target size={20} className="text-red-500" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Wrong answers are learning opportunities—check the solution and retry!
              </p>
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="flex items-start gap-2 mb-2">
                  <X size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-900">Got it wrong?</p>
                    <p className="text-xs text-red-700 mt-1">Look at correct answer → Understand why → Try similar problem</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3 pt-2 border-t border-red-200">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-900">Got it right?</p>
                    <p className="text-xs text-green-700 mt-1">Can you explain it? Try without hints next time!</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">📝 Mistakes = progress in disguise</p>
            </div>
          </StepCard>
          
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] rounded-2xl p-4 mt-4 text-white">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚀</div>
              <div>
                <p className="font-medium text-sm mb-1">Your Practice Goal</p>
                <p className="text-xs text-white/90">
                  Aim for 80% correct using Hint 1 only. This sweet spot builds both confidence and real understanding!
                </p>
              </div>
            </div>
          </div>
        </div>
      </VisualCoachSheet>

      {/* Feedback Toast */}
      <EriFeedbackToast
        isOpen={showFeedbackToast}
        onClose={handleDismissToast}
        onShowHint={handleToastShowHint}
        onAdvance={advanceToNext}
        correctAnswer={question.correctAnswer}
        type={feedback}
        questionIndex={currentQuestion}
      />
    </div>
  );
}