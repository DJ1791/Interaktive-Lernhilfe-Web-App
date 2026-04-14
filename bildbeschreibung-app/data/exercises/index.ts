import phase1Data from './phase1.json';
import phase2Data from './phase2.json';
import phase3Data from './phase3.json';
import phase4Data from './phase4.json';
import extraData from './extra.json';

export interface FillInBlankExercise {
  type: 'fillInBlank';
  id: string;
  img: string;
  before: string;
  after: string;
  correct: string;
  givenWord?: string;
  hint: string;
  alternatives?: string[];
}

export interface MultipleChoiceExercise {
  type: 'multipleChoice';
  id: string;
  img: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ErrorCorrectionExercise {
  type: 'errorCorrection';
  id: string;
  img: string;
  wrongSentence: string;
  correctSentence: string;
  errorHint: string;
}

export interface WordOrderExercise {
  type: 'wordOrder';
  id: string;
  img: string;
  parts: { text: string; color: string }[];
  correctOrder: number[];
  hint: string;
}

export type Exercise =
  | FillInBlankExercise
  | MultipleChoiceExercise
  | ErrorCorrectionExercise
  | WordOrderExercise;

export interface LevelData {
  level1: Exercise[];
  level2: Exercise[];
  level3: Exercise[];
}

export const exercisesByPhase: Record<string, LevelData> = {
  phase1: phase1Data as unknown as LevelData,
  phase2: phase2Data as unknown as LevelData,
  phase3: phase3Data as unknown as LevelData,
  phase4: phase4Data as unknown as LevelData,
  extra: extraData as unknown as LevelData,
};

export function getExercisesForPhase(phaseId: string): Exercise[] {
  const data = exercisesByPhase[phaseId];
  if (!data) return [];
  return [...(data.level1 || []), ...(data.level2 || []), ...(data.level3 || [])];
}

export function getExercisesForLevel(phaseId: string, level: number): Exercise[] {
  const data = exercisesByPhase[phaseId];
  if (!data) return [];
  const key = `level${level}` as keyof LevelData;
  return data[key] || [];
}
