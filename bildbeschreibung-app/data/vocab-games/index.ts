// ============================================================================
// Vocab-Games: Shared Types + Game Registry
// ============================================================================

export type VocabGameType =
  | 'artikel-quiz'
  | 'mix-match'
  | 'cloze'
  | 'wordsearch'
  | 'crossword';

export interface VocabGameMeta {
  type: VocabGameType;
  icon: string;              // MaterialIcons name
  emoji: string;
  label: string;
  subtitle: string;
  route: string;             // expo-router path (ohne Parameter)
  color: string;             // accent color (theme token)
}

export const vocabGames: VocabGameMeta[] = [
  {
    type: 'cloze',
    icon: 'description',
    emoji: '🃏',
    label: 'Lückentext',
    subtitle: 'Bildbeschreibungen vervollständigen · 3 Level',
    route: '/vocab-games/cloze',
    color: '#edb1ff',
  },
  {
    type: 'artikel-quiz',
    icon: 'label',
    emoji: '🏷️',
    label: 'Artikel-Quiz',
    subtitle: 'der · die · das · 10 Kategorien',
    route: '/vocab-games/artikel-quiz',
    color: '#ffb1c5',
  },
  {
    type: 'mix-match',
    icon: 'shuffle',
    emoji: '🔀',
    label: 'Mix & Match',
    subtitle: 'Wörter in Kategorien sortieren',
    route: '/vocab-games/mix-match',
    color: '#ffb870',
  },
  {
    type: 'wordsearch',
    icon: 'grid-on',
    emoji: '🔡',
    label: 'Gitternetz',
    subtitle: 'Wörter im Buchstabengrid finden',
    route: '/vocab-games/wordsearch',
    color: '#edb1ff',
  },
  {
    type: 'crossword',
    icon: 'extension',
    emoji: '🧩',
    label: 'Kreuzworträtsel',
    subtitle: 'Umschreibungen → Wörter',
    route: '/vocab-games/crossword',
    color: '#ffb1c5',
  },
];

// ---------------------------------------------------------------------------
// Lückentext (Cloze) Types
// ---------------------------------------------------------------------------

export type ClozeSegment =
  | { type: 'text'; content: string }
  | {
      type: 'blank';
      correct: string;
      alternatives?: string[];
      base?: string;           // Grundform für Level 2 Wortbank
      hint?: string;
    };

export interface ClozeExercise {
  id: string;
  level: 1 | 2 | 3;
  categoryId: string;
  img: string;
  title: string;
  segments: ClozeSegment[];
}

// ---------------------------------------------------------------------------
// Mix & Match Types
// ---------------------------------------------------------------------------

export interface MixMatchCategory {
  id: string;
  label: string;
  icon: string;
}

export interface MixMatchRound {
  id: string;
  title: string;
  subtitle: string;
  categories: MixMatchCategory[];
  words: Array<{ word: string; categoryId: string }>;
}

// ---------------------------------------------------------------------------
// Word Search Types
// ---------------------------------------------------------------------------

export interface WordSearchWord {
  word: string;
  article?: string;
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical';
}

export interface WordSearchGrid {
  id: string;
  categoryId: string;
  title: string;
  subtitle: string;
  grid: string[][];
  words: WordSearchWord[];
}

// ---------------------------------------------------------------------------
// Crossword Types
// ---------------------------------------------------------------------------

export interface CrosswordCell {
  letter: string;
  number?: number;
}

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}

export interface Crossword {
  id: string;
  categoryId: string;
  title: string;
  width: number;
  height: number;
  // Row-major: grid[row][col]. null = schwarze Zelle
  grid: (CrosswordCell | null)[][];
  clues: CrosswordClue[];
}
