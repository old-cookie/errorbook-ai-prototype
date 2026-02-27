import { useState, useCallback, ReactNode } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EriBubble } from '../components/EriBubble';
import { VisualCoachSheet } from '../components/VisualCoachSheet';
import { StepCard } from '../components/StepCard';
import { HintToken } from '../components/HintToken';
import { FractionBar } from '../components/FractionBar';
import { EriCharacterSvg, EriCharacterState } from '../components/EriCharacterSvg';
import { ChevronLeft, CheckCircle2, X, Brain, Lightbulb, Target, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EriFeedbackToast } from '../components/EriFeedbackToast';
import { AppSettingsState, getAppSettings, PracticeQuestionResult } from '../data/appState';

interface PracticeSessionProps {
  onNavigate: (screen: string, data?: unknown) => void;
  onBack: () => void;
  onEriClick: () => void;
}

interface PracticeHint {
  title: string;
  visual: ReactNode;
}

interface QuestionPart {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  displayAnswer: string;
}

type PracticeQuestion = {
  id: number;
  question: string;
  hints: PracticeHint[];
} & (
    | {
      type: 'single';
      acceptedAnswers: string[];
      displayAnswer: string;
    }
    | {
      type: 'multi';
      parts: QuestionPart[];
    }
  );

const practiceQuestions: PracticeQuestion[] = [
  {
    type: 'single',
    id: 1,
    question: 'Calculate: 2 1/4 - 1.35 + 3/5\nGive your answer as a decimal correct to 2 decimal places.',
    acceptedAnswers: ['1.5', '1.50'],
    displayAnswer: '1.50',
    hints: [
      {
        title: 'Hint 1: Convert to decimals',
        visual: (
          <div className="space-y-4">
            <p className="text-center text-sm font-semibold text-gray-700">Convert each fraction term first</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-2">2 1/4</p>
                <FractionBar numerator={9} denominator={4} color="#6C5CE7" />
                <p className="mt-2 text-sm font-bold text-[#6C5CE7]">= 2.25</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-2">3/5</p>
                <FractionBar numerator={3} denominator={5} color="#10B981" />
                <p className="mt-2 text-sm font-bold text-green-700">= 0.60</p>
              </div>
            </div>
            <div className="bg-[#6C5CE7]/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-gray-900">2.25 - 1.35 + 0.60</p>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 2: Subtract first',
        visual: (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-sm font-semibold text-gray-700">Step 1</span>
              <span className="text-base font-bold text-[#6C5CE7]">2.25 - 1.35 = 0.90</span>
            </div>
            <div className="flex justify-center text-gray-400 text-xl">↓</div>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
              <span className="text-sm font-semibold text-gray-700">Step 2</span>
              <span className="text-base font-bold text-green-700">0.90 + 0.60 = 1.50</span>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Final decimal',
        visual: (
          <div className="space-y-3 text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-900">1.50</p>
            </div>
            <p className="text-xs text-gray-600">Decimal to 2 d.p.: 1.50</p>
          </div>
        )
      }
    ]
  },
  {
    type: 'multi',
    id: 2,
    question: 'A printing shop charges a setup fee of $18 and $4.5 for each worksheet. The total cost is $63.',
    parts: [
      {
        id: 'a',
        prompt: '(a) Let x be the number of worksheets. Write the linear equation.',
        acceptedAnswers: ['18+4.5x=63', '4.5x+18=63'],
        displayAnswer: '18 + 4.5x = 63',
      },
      {
        id: 'b',
        prompt: '(b) Solve for x.',
        acceptedAnswers: ['10', 'x=10'],
        displayAnswer: 'x = 10',
      },
    ],
    hints: [
      {
        title: 'Hint 1: Identify fixed + variable cost',
        visual: (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <p className="text-xs text-orange-700">Fixed fee</p>
                <p className="text-sm font-bold text-orange-900">$18</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <p className="text-xs text-blue-700">Per sheet</p>
                <p className="text-sm font-bold text-blue-900">$4.5 × x</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <p className="text-xs text-green-700">Total</p>
                <p className="text-sm font-bold text-green-900">$63</p>
              </div>
            </div>
            <div className="bg-[#6C5CE7]/10 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-gray-900">18 + 4.5x = 63</p>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 2: Rearrange and simplify',
        visual: (
          <div className="space-y-3 text-center">
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-sm text-gray-600">18 + 4.5x = 63</p>
            </div>
            <p className="text-sm font-semibold text-gray-700">Subtract 18 on both sides</p>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-lg font-bold text-gray-900">4.5x = 45</p>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Solve for x',
        visual: (
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold text-gray-700">Divide by 4.5</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-900">x = 10</p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    type: 'multi',
    id: 3,
    question: 'A bag has 2 red, 3 blue, and 1 green ball. Draw one, then another without replacement.',
    parts: [
      {
        id: 'a',
        prompt: '(a) List all possible ordered pairs of colours.',
        acceptedAnswers: ['rr,rb,rg,br,bb,bg,gr,gb'],
        displayAnswer: 'RR, RB, RG, BR, BB, BG, GR, GB',
      }
      ,
      {
        id: 'b',
        prompt: '(b) Find P(both balls are blue).',
        acceptedAnswers: ['1/5', '0.2'],
        displayAnswer: '1/5',
      },
      {
        id: 'c',
        prompt: '(c) Find P(two balls are of different colours).',
        acceptedAnswers: ['4/5', '0.8'],
        displayAnswer: '4/5',
      },
    ],
    hints: [
      {
        title: 'Hint 1: Sample space by colours',
        visual: (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 rounded-full px-2 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                R = Red
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-2 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                B = Blue
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 rounded-full px-2 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                G = Green
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-center">
              {['RR', 'RB', 'RG', 'BR', 'BB', 'BG', 'GR', 'GB'].map((pair) => {
                const tone: Record<string, string> = {
                  R: 'bg-red-100 text-red-800 border-red-200',
                  B: 'bg-blue-100 text-blue-800 border-blue-200',
                  G: 'bg-green-100 text-green-800 border-green-200',
                };

                return (
                  <div key={pair} className="bg-white border border-gray-200 rounded-lg p-1.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`w-6 h-6 rounded-md border inline-flex items-center justify-center ${tone[pair[0]]}`}>
                        {pair[0]}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className={`w-6 h-6 rounded-md border inline-flex items-center justify-center ${tone[pair[1]]}`}>
                        {pair[1]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      },
      {
        title: 'Hint 2: Both blue',
        visual: (
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-gray-700">First draw blue, then blue again</p>
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                <p className="text-xs text-blue-700 mb-1">1st draw: 3 blue out of 6</p>
                <div className="grid grid-cols-6 gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-2.5 rounded-full ${i < 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="mt-1 text-sm font-bold text-blue-900">3/6</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                <p className="text-xs text-blue-700 mb-1">2nd draw: 2 blue out of 5</p>
                <div className="grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className={`h-2.5 rounded-full ${i < 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="mt-1 text-sm font-bold text-blue-900">2/5</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-700">
              <span className="text-blue-900">3/6 × 2/5</span>
              <span className="text-[#6C5CE7]">→</span>
              <span className="text-[#6C5CE7]">1/5</span>
            </div>
          </div>
        )
      },
      {
        title: 'Hint 3: Different colours',
        visual: (
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-gray-700">Use complement flow</p>
            <div className="space-y-2 text-sm">
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                <p className="text-red-700 font-semibold">Same-colour outcomes</p>
                <p className="font-bold text-red-900">RR + BB = 1/5</p>
              </div>
              <div className="flex justify-center text-gray-400 text-lg">↓</div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5">
                <p className="text-purple-700 font-semibold">Complement</p>
                <p className="font-bold text-purple-900">P(different) = 1 - P(same)</p>
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-lg font-bold text-green-900">P(different) = 4/5</p>
            </div>
          </div>
        )
      }
    ]
  }
];

export function PracticeSession({ onNavigate, onBack, onEriClick }: PracticeSessionProps) {
  const normalizeAnswer = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
  const totalSubQuestions = practiceQuestions.reduce((sum, item) => {
    return sum + (item.type === 'multi' ? item.parts.length : 1);
  }, 0);
  const getQuestionAnswerText = (item: PracticeQuestion) => {
    if (item.type === 'single') {
      return item.displayAnswer;
    }

    return item.parts.map((part) => `${part.id}) ${part.displayAnswer}`).join(' · ');
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [partAnswers, setPartAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState<PracticeQuestionResult[]>([]);
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
      setPartAnswers({});
      setFeedback(null);
      setShowFeedbackToast(false);
      setCurrentHint(0);
      setUnlockedHints(1);
      setCharacterState('idle');
    } else {
      onNavigate('session-results', {
        sessionId,
        score,
        total: totalSubQuestions,
        hintsUsed,
        questionResults,
        missionMode: 'math-practice',
      });
    }
  }, [currentQuestion, onNavigate, questionResults, score, sessionId, hintsUsed, totalSubQuestions]);

  const handleSubmit = () => {
    if (question.type === 'single') {
      const normalized = normalizeAnswer(answer);
      const acceptedAnswers = question.acceptedAnswers.map((item) => normalizeAnswer(item));
      const isCorrect = acceptedAnswers.includes(normalized);
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setCharacterState(isCorrect ? 'correct' : 'wrong');
      setQuestionResults((prev) => [
        ...prev,
        {
          id: question.id,
          question: question.question,
          isCorrect,
          userAnswer: answer,
          acceptedAnswers: question.acceptedAnswers,
        },
      ]);
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    } else {
      const partResults = question.parts.map((part) => {
        const currentAnswer = partAnswers[part.id] ?? '';
        const normalized = normalizeAnswer(currentAnswer);
        const acceptedAnswers = part.acceptedAnswers.map((item) => normalizeAnswer(item));
        const isCorrect = acceptedAnswers.includes(normalized);

        return {
          id: part.id,
          prompt: part.prompt,
          userAnswer: currentAnswer,
          acceptedAnswers: part.acceptedAnswers,
          isCorrect,
        };
      });

      const correctCount = partResults.filter((item) => item.isCorrect).length;
      const isQuestionFullyCorrect = correctCount === question.parts.length;
      setFeedback(isQuestionFullyCorrect ? 'correct' : 'incorrect');
      setCharacterState(isQuestionFullyCorrect ? 'correct' : 'wrong');
      setQuestionResults((prev) => [
        ...prev,
        {
          id: question.id,
          question: question.question,
          isCorrect: isQuestionFullyCorrect,
          parts: partResults,
        },
      ]);
      if (correctCount > 0) {
        setScore((prev) => prev + correctCount);
      }
    }

    setShowFeedbackToast(true);
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

  const isSubmitDisabled = question.type === 'single'
    ? !answer.trim()
    : question.parts.some((part) => !(partAnswers[part.id] ?? '').trim());

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
              <h2 className="text-xl font-bold text-gray-900 mb-6 whitespace-pre-line">{question.question}</h2>

              <div className="space-y-4">
                {question.type === 'single' ? (
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
                ) : (
                  <div className="space-y-4">
                    {question.parts.map((part) => (
                      <div key={part.id}>
                        <label className="block text-gray-700 font-semibold mb-2">
                          {part.prompt}
                        </label>
                        <input
                          type="text"
                          value={partAnswers[part.id] ?? ''}
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            setPartAnswers((prev) => ({
                              ...prev,
                              [part.id]: nextValue,
                            }));

                            if (!feedback) {
                              const allValues = {
                                ...partAnswers,
                                [part.id]: nextValue,
                              };
                              const hasAnyInput = question.parts.some((item) => (allValues[item.id] ?? '').trim());
                              setCharacterState(hasAnyInput ? 'thinking' : 'idle');
                            }
                          }}
                          placeholder="Type your answer..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none text-lg"
                          disabled={feedback !== null}
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                    disabled={isSubmitDisabled}
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
        correctAnswer={getQuestionAnswerText(question)}
        type={feedback}
        questionIndex={currentQuestion}
      />
    </div>
  );
}