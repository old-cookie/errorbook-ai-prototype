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
    question: 'Calculate 3/4 + 2/5',
    myAnswer: '5/9',
    correctAnswer: '23/20 or 1 3/20',
    topic: 'Fractions',
    errorType: 'Calculation slip',
    explanation: 'You added the numerators and denominators directly instead of finding a common denominator first. Remember: find the LCM of denominators (20), convert both fractions, then add.',
    dueDate: 'Due today',
    exam: 'GCSE Math'
  },
  {
    id: '2',
    question: 'Solve for x: 2x + 5 = 13',
    myAnswer: 'x = 9',
    correctAnswer: 'x = 4',
    topic: 'Algebra basics',
    errorType: 'Concept misunderstanding',
    explanation: 'You forgot to divide by 2 after subtracting 5. The correct steps: 2x = 8, then x = 4. Always perform inverse operations in the right order.',
    dueDate: 'Due tomorrow',
    exam: 'GCSE Math'
  },
  {
    id: '3',
    question: 'What is 15% of 80?',
    myAnswer: '15',
    correctAnswer: '12',
    topic: 'Percentages',
    errorType: 'Method selection',
    explanation: 'You calculated 80% of 15 instead of 15% of 80. Remember: "of" means multiply, so 15% × 80 = 0.15 × 80 = 12.',
    dueDate: 'Due in 3 days',
    exam: 'GCSE Math'
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
  'Fractions',
  'Algebra basics',
  'Percentages',
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
