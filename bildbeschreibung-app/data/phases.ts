export interface PhaseConfig {
  id: string;
  icon: string;
  label: string;
  color: string;
  description: string;
}

export interface UnitConfig {
  id: string;
  title: string;
  subtitle: string;
  gradientColors: [string, string];
  lessons: PhaseConfig[];
}

export const phases: PhaseConfig[] = [
  {
    id: 'phase1',
    icon: 'visibility',
    label: 'Einleitung',
    color: '#edb1ff',
    description: 'Erster Eindruck: Das Bild benennen und den Gesamteindruck beschreiben.',
  },
  {
    id: 'phase2',
    icon: 'pin-drop',
    label: 'Positionen',
    color: '#ffb1c5',
    description: 'Grobe Positionen und passende Verben verwenden.',
  },
  {
    id: 'phase3',
    icon: 'swap-horiz',
    label: 'Präpositionen',
    color: '#ffb870',
    description: 'Genaue Positionen mit Präpositionen und Dativ beschreiben.',
  },
  {
    id: 'phase4',
    icon: 'palette',
    label: 'Adjektive',
    color: '#edb1ff',
    description: 'Eigenschaften mit Adjektiven genau beschreiben.',
  },
];

export const units: UnitConfig[] = [
  {
    id: 'unit1',
    title: 'Bildbeschreibung',
    subtitle: 'Die 4 Phasen systematisch lernen',
    gradientColors: ['#9d50bb', '#8b0e45'],
    lessons: phases,
  },
  {
    id: 'unit2',
    title: 'Beispiel & Fokus',
    subtitle: 'Vollständige Übungen & gezieltes Training',
    gradientColors: ['#8b0e45', '#a56100'],
    lessons: [
      {
        id: 'example',
        icon: 'auto-fix-high',
        label: 'Beispiel',
        color: '#ffb870',
        description: 'Vollständige Bildbeschreibungen als Beispiel durcharbeiten.',
      },
      {
        id: 'fokus',
        icon: 'fitness-center',
        label: 'Fokus',
        color: '#ffb1c5',
        description: 'Gezielte Übungen zu deinen Schwächen.',
      },
    ],
  },
];

export const phaseLabels: Record<string, { de: string; en: string }> = {
  phase1: { de: 'Erster Eindruck', en: 'First Impression' },
  phase2: { de: 'Positionen + Verben', en: 'Positions + Verbs' },
  phase3: { de: 'Präpositionen + Dativ', en: 'Prepositions + Dative' },
  phase4: { de: 'Adjektive', en: 'Adjectives' },
};
