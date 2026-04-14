import phase1Data from './phase1.json';
import phase2Data from './phase2.json';
import phase3Data from './phase3.json';
import phase4Data from './phase4.json';
import extraData from './extra.json';
import { Exercise, LevelData } from './index';

const allPhases: LevelData[] = [
  phase1Data as unknown as LevelData,
  phase2Data as unknown as LevelData,
  phase3Data as unknown as LevelData,
  phase4Data as unknown as LevelData,
  extraData as unknown as LevelData,
];

function flattenAll(): Exercise[] {
  const out: Exercise[] = [];
  for (const p of allPhases) {
    out.push(...(p.level1 || []));
    out.push(...(p.level2 || []));
    out.push(...(p.level3 || []));
  }
  return out;
}

function hintText(ex: Exercise): string {
  const parts: string[] = [];
  if ('hint' in ex && ex.hint) parts.push(ex.hint);
  if ('explanation' in ex && (ex as any).explanation) parts.push((ex as any).explanation);
  if ('errorHint' in ex && (ex as any).errorHint) parts.push((ex as any).errorHint);
  return parts.join(' ').toLowerCase();
}

const prepositionPatterns = [
  ' auf dem', ' auf der', ' auf den',
  ' in dem', ' in der', ' in den', ' im ',
  ' an dem', ' an der', ' am ',
  ' vor dem', ' vor der',
  ' hinter dem', ' hinter der',
  ' neben dem', ' neben der',
  ' unter dem', ' unter der',
  ' über dem', ' über der',
  ' zwischen',
];

type Predicate = (ex: Exercise, text: string) => boolean;

const topicFilters: Record<string, Predicate> = {
  akkusativ: (_ex, t) => t.includes('akkusativ') || t.includes('akk.'),
  dativ: (_ex, t) => t.includes('dativ') || t.includes('dat.'),
  praepositionen: (_ex, t) =>
    t.includes('präposition') ||
    t.includes('praeposition') ||
    prepositionPatterns.some((p) => t.includes(p)),
  adjektivdeklination: (_ex, t) =>
    t.includes('adjektiv') || t.includes('deklination'),
  satzstellung: (ex, t) =>
    ex.type === 'wordOrder' ||
    t.includes('position 2') ||
    t.includes('inversion') ||
    t.includes('satzstellung') ||
    t.includes('position + verb'),
};

export function getExercisesForTopic(topicId: string): Exercise[] {
  const filt = topicFilters[topicId];
  if (!filt) return [];
  const all = flattenAll();
  const seen = new Set<string>();
  const matches: Exercise[] = [];
  for (const ex of all) {
    if (seen.has(ex.id)) continue;
    if (filt(ex, hintText(ex))) {
      seen.add(ex.id);
      matches.push(ex);
    }
  }
  return matches;
}

export const grammarTopicLabels: Record<string, string> = {
  akkusativ: 'Akkusativ',
  dativ: 'Dativ',
  praepositionen: 'Präpositionen',
  adjektivdeklination: 'Adjektivdeklination',
  satzstellung: 'Satzstellung',
};
