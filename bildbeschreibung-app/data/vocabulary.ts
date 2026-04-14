import vocabData from './vocabulary.json';

export interface VocabWord {
  word: string;
  article?: string;
  plural?: string;
  besonderheiten?: string;
  beispiel?: string;
  partizipII?: string;
  erSieEs?: string;
  gegenteil?: string;
  steigerung?: string;
}

export interface VocabCategory {
  id: string;
  label: string;
  labelEN: string;
  icon: string;
  nomen: VocabWord[];
  verben: VocabWord[];
  adjektive: VocabWord[];
}

export const vocabularyCategories: VocabCategory[] = vocabData as VocabCategory[];

export function getCategoryById(id: string): VocabCategory | undefined {
  return vocabularyCategories.find((c) => c.id === id);
}

export function getTotalWordCount(): number {
  return vocabularyCategories.reduce(
    (sum, cat) =>
      sum + (cat.nomen?.length || 0) + (cat.verben?.length || 0) + (cat.adjektive?.length || 0),
    0
  );
}
