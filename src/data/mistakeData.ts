export interface Mistake {
  id: string;
  question: string;
  myAnswer: string;
  correctAnswer: string;
  topic: string;
  errorType: string;
  explanation: string;
  dueDate: string;
  exam: string;
}

export const mistakeData: Mistake[] = [
  {
    id: '1',
    question: 'Calculate: 2 1/4 - 1.35 + 3/5 (answer to 2 d.p.)',
    myAnswer: '1.35',
    correctAnswer: '1.50',
    topic: 'Basic computation',
    errorType: 'Method selection',
    explanation: 'You skipped converting all terms into a common form first. Convert mixed fraction and fraction to decimals: 2 1/4 = 2.25 and 3/5 = 0.60, then compute 2.25 - 1.35 + 0.60 = 1.50.',
    dueDate: 'Due today',
    exam: 'HK KS3 Math'
  },
  {
    id: '2',
    question: 'Printing cost problem: setup fee $18 and $4.5 per worksheet, total $63.',
    myAnswer: 'x = 14',
    correctAnswer: 'Equation: 18 + 4.5x = 63, so x = 10',
    topic: 'Linear equations in one unknown',
    errorType: 'Concept misunderstanding',
    explanation: 'You did not set up the equation from context correctly. Fixed fee + variable fee gives 18 + 4.5x = 63, then 4.5x = 45 and x = 10.',
    dueDate: 'Due tomorrow',
    exam: 'HK KS3 Math'
  },
  {
    id: '3',
    question: 'Bag probability (2R, 3B, 1G), two draws without replacement.',
    myAnswer: '(a) missed pairs, (b) 1/4, (c) 3/4',
    correctAnswer: '(a) RR,RB,RG,BR,BB,BG,GR,GB  (b) 1/5  (c) 4/5',
    topic: 'Probability',
    errorType: 'Calculation slip',
    explanation: 'For both blue, multiply dependent probabilities: 3/6 × 2/5 = 1/5. For different colours, use complement of same colour outcomes or direct counting from ordered colour pairs.',
    dueDate: 'Due in 3 days',
    exam: 'HK KS3 Math'
  }
];

export const errorTypes = [
  'Concept misunderstanding',
  'Calculation slip',
  'Method selection',
  'Reading error',
  'Time pressure'
];

export const topics = [
  'Basic computation',
  'Linear equations in one unknown',
  'Probability',
  'Geometry',
  'Statistics'
];

export const eriScriptedLines = {
  diagnose: [
    "Nice catch—this is a method selection issue.",
    "I can see you struggled with the order of operations here.",
    "This looks like a concept misunderstanding. Let me explain..."
  ],
  tips: [
    "Try this: simplify first, then divide.",
    "Remember: find the LCM before adding fractions.",
    "Break it down step by step—you've got this!"
  ],
  motivation: [
    "You're improving. Let's do one more quick question.",
    "Every mistake is a learning opportunity. Keep going!",
    "Your accuracy is up 15% this week. Amazing progress! 💪"
  ],
  celebration: [
    "Brilliant! You nailed that one! 🎉",
    "Perfect! That's exactly right!",
    "Yes! You're getting stronger with each practice! ⭐"
  ]
};
