export type EnglishMissionPhase = 'write' | 'speak' | 'listening';

export interface EnglishMissionStep {
  phase: EnglishMissionPhase;
  title: string;
  demoQuestion: string;
  instruction: string;
  coachLine: string;
  cta: string;
}

export const englishMissionSteps: EnglishMissionStep[] = [
  {
    phase: 'write',
    title: 'Write',
    demoQuestion: 'Demo Question: What did you do after school today?',
    instruction: 'Write 2-3 sentences about your school day in English.',
    coachLine: 'Start simple. Focus on clear subject + verb + detail.',
    cta: 'Continue to Speak',
  },
  {
    phase: 'speak',
    title: 'Speak',
    demoQuestion: 'Demo Question: Please say, "Today I practiced English with Eri."',
    instruction: 'Say your answer out loud once. Eri is listening to your voice.',
    coachLine: 'Speak slowly and clearly. Keep each sentence short.',
    cta: 'I Finished Speaking',
  },
  {
    phase: 'listening',
    title: 'Listening',
    demoQuestion: 'Demo Question: Listen and repeat, "I can learn one step at a time."',
    instruction: 'Listen to Eri\'s prompt, then repeat the key phrase once.',
    coachLine: 'Catch key words first, then repeat with confidence.',
    cta: 'I Finished Listening',
  },
];
