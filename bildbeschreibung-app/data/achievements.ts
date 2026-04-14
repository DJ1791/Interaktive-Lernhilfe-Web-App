// ============================================================================
// Achievement definitions.
// Each achievement has a condition check that receives the current app state.
// ============================================================================

import type { ProgressState } from '../stores/useAppStore';

export interface AchievementDef {
  id: string;
  icon: string;             // MaterialIcons name
  color: string;
  label: string;
  description: string;
  check: (args: { progress: ProgressState; favoriteWords: string[] }) => boolean;
}

// A small deterministic set of 10 achievements covering different milestones.
export const achievements: AchievementDef[] = [
  {
    id: 'first-steps',
    icon: 'directions-walk',
    color: '#edb1ff',
    label: 'Erste Schritte',
    description: 'Erste Übung abgeschlossen',
    check: ({ progress }) => {
      const total = Object.values(progress.phases).reduce(
        (s, p) => s + p.level1.total + p.level2.total + p.level3.total,
        0
      );
      return total >= 1;
    },
  },
  {
    id: 'streak-3',
    icon: 'local-fire-department',
    color: '#ffb870',
    label: '3 Tage in Folge',
    description: 'Streak von 3 Tagen erreicht',
    check: ({ progress }) => progress.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: 'local-fire-department',
    color: '#ffb1c5',
    label: 'Wochen-Streak',
    description: '7 Tage in Folge gelernt',
    check: ({ progress }) => progress.streak >= 7,
  },
  {
    id: 'xp-100',
    icon: 'star',
    color: '#edb1ff',
    label: 'Erste 100 XP',
    description: '100 XP gesammelt',
    check: ({ progress }) => progress.xp >= 100,
  },
  {
    id: 'xp-500',
    icon: 'stars',
    color: '#ffb870',
    label: '500 XP',
    description: '500 XP insgesamt gesammelt',
    check: ({ progress }) => progress.xp >= 500,
  },
  {
    id: 'phase-1-complete',
    icon: 'check-circle',
    color: '#edb1ff',
    label: 'Phase 1 gemeistert',
    description: 'Phase 1 zu 100 % abgeschlossen',
    check: ({ progress }) => {
      const p = progress.phases.phase1;
      if (!p) return false;
      const total = p.level1.total + p.level2.total + p.level3.total;
      const correct = p.level1.correct + p.level2.correct + p.level3.correct;
      return total >= 10 && correct / total >= 0.95;
    },
  },
  {
    id: 'all-phases-started',
    icon: 'flag',
    color: '#ffb1c5',
    label: 'Alle Phasen gestartet',
    description: 'In allen 4 Phasen mindestens eine Übung gemacht',
    check: ({ progress }) => {
      return ['phase1', 'phase2', 'phase3', 'phase4'].every((id) => {
        const p = progress.phases[id];
        return p && p.level1.total + p.level2.total + p.level3.total > 0;
      });
    },
  },
  {
    id: 'vocab-game-first',
    icon: 'sports-esports',
    color: '#ffb870',
    label: 'Spieler',
    description: 'Erstes Wortschatz-Spiel gespielt',
    check: ({ progress }) => Object.keys(progress.vocabGames || {}).length >= 1,
  },
  {
    id: 'favorites-10',
    icon: 'star-outline',
    color: '#ffb1c5',
    label: 'Notizbuch voll',
    description: '10 Vokabeln als „schwer" markiert',
    check: ({ favoriteWords }) => favoriteWords.length >= 10,
  },
  {
    id: 'level-5',
    icon: 'emoji-events',
    color: '#ffb870',
    label: 'Fortgeschritten',
    description: 'Level 5 erreicht',
    check: ({ progress }) => progress.level >= 5,
  },
];

export function getAchievementDef(id: string): AchievementDef | undefined {
  return achievements.find((a) => a.id === id);
}
