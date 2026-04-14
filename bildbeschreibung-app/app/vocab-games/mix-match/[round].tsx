import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { GameShell } from '../../../components/vocab-games/GameShell';
import { GameResults } from '../../../components/vocab-games/GameResults';
import { mixMatchRounds } from '../../../data/vocab-games/mixMatchRounds';
import { colors, fonts, radius, spacing } from '../../../theme';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface WordState {
  word: string;
  correctCategoryId: string;
  assignedTo?: string;
  hasError?: boolean;
}

export default function MixMatchGame() {
  const { round: roundId } = useLocalSearchParams<{ round: string }>();
  const round = mixMatchRounds.find((r) => r.id === roundId);

  const [words, setWords] = useState<WordState[]>(() =>
    round
      ? shuffle(
          round.words.map((w) => ({
            word: w.word,
            correctCategoryId: w.categoryId,
          }))
        )
      : []
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const remaining = words.filter((w) => !w.assignedTo);
  const total = words.length;

  const [noSelectionHint, setNoSelectionHint] = useState(false);

  const handlePickWord = (index: number) => {
    if (words[index].assignedTo) return;
    setSelected(index === selected ? null : index);
    setNoSelectionHint(false);
    Haptics.selectionAsync();
  };

  const handlePickCategory = (catId: string) => {
    if (selected === null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setNoSelectionHint(true);
      setTimeout(() => setNoSelectionHint(false), 2000);
      return;
    }
    const wordState = words[selected];
    const isCorrect = wordState.correctCategoryId === catId;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setWords((ws) =>
        ws.map((w, i) =>
          i === selected ? { ...w, assignedTo: catId, hasError: false } : w
        )
      );
      setCorrectCount((c) => c + 1);
      setSelected(null);

      // Check if round is finished after this assignment
      const newRemaining = words.filter((w, i) => i !== selected && !w.assignedTo);
      if (newRemaining.length === 0) {
        setTimeout(() => setFinished(true), 900);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorCount((e) => e + 1);
      // Flash error marker
      setWords((ws) => ws.map((w, i) => (i === selected ? { ...w, hasError: true } : w)));
      setTimeout(() => {
        setWords((ws) => ws.map((w, i) => (i === selected ? { ...w, hasError: false } : w)));
      }, 600);
    }
  };

  const handleRetry = () => {
    if (!round) return;
    setWords(
      shuffle(
        round.words.map((w) => ({
          word: w.word,
          correctCategoryId: w.categoryId,
        }))
      )
    );
    setSelected(null);
    setErrorCount(0);
    setCorrectCount(0);
    setFinished(false);
  };

  if (!round) {
    return (
      <GameShell title="Mix & Match">
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Runde nicht gefunden.</Text>
        </View>
      </GameShell>
    );
  }

  if (finished) {
    // Score = correctCount, aber errors als Strafe
    // Total = words.length + errorCount (jeder Fehler = extra Versuch)
    const percent = Math.round((correctCount / (correctCount + errorCount)) * 100);
    return (
      <GameShell title="Mix & Match" subtitle={round.title}>
        <GameResults
          title={round.title}
          correct={correctCount}
          total={correctCount + errorCount}
          onRetry={handleRetry}
          extraLine={
            errorCount === 0
              ? 'Perfekte Runde — kein einziger Fehler!'
              : `${errorCount} Fehlversuch${errorCount === 1 ? '' : 'e'}`
          }
        />
      </GameShell>
    );
  }

  const progressPercent = ((total - remaining.length) / total) * 100;

  return (
    <GameShell
      title="Mix & Match"
      subtitle={round.title}
      progressPercent={progressPercent}
      progressLabel={`${total - remaining.length} / ${total}`}
    >
      <View style={styles.gameContent}>
        <Text style={styles.instruction}>
          1. Tippe ein Wort  →  2. Tippe die passende Kategorie
        </Text>
        {noSelectionHint && (
          <Text style={styles.noSelectionHint}>
            Wähle erst ein Wort aus!
          </Text>
        )}

        <View style={styles.wordsRow}>
          {words.map((w, i) => {
            if (w.assignedTo) return null;
            const isSelected = i === selected;
            return (
              <Animated.View
                key={`${w.word}-${i}`}
                entering={FadeIn}
                exiting={FadeOut}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handlePickWord(i)}
                  style={[
                    styles.wordChip,
                    isSelected && styles.wordChipSelected,
                    w.hasError && styles.wordChipError,
                  ]}
                >
                  <Text
                    style={[
                      styles.wordText,
                      isSelected && styles.wordTextSelected,
                      w.hasError && styles.wordTextError,
                    ]}
                  >
                    {w.word}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          {remaining.length === 0 && (
            <Text style={styles.allDone}>Alle Wörter zugeordnet!</Text>
          )}
        </View>

        <View style={styles.categoriesRow}>
          {round.categories.map((cat) => {
            const assigned = words.filter((w) => w.assignedTo === cat.id).length;
            const targetCount = round.words.filter((w) => w.categoryId === cat.id).length;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() => handlePickCategory(cat.id)}
                style={[
                  styles.categoryCard,
                  selected !== null && styles.categoryCardActive,
                ]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={styles.catLabel}>{cat.label}</Text>
                <Text style={styles.catCount}>
                  {assigned} / {targetCount}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </GameShell>
  );
}

const styles = StyleSheet.create({
  gameContent: {
    flex: 1,
    padding: spacing.lg,
  },
  instruction: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginBottom: 8,
  },
  noSelectionHint: {
    color: colors.tertiary,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    textAlign: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,184,112,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 140,
  },
  wordChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  wordChipSelected: {
    backgroundColor: 'rgba(237,177,255,0.2)',
    borderColor: colors.primary,
  },
  wordChipError: {
    backgroundColor: 'rgba(255,180,171,0.2)',
    borderColor: colors.error,
  },
  wordText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
  wordTextSelected: { color: colors.primary },
  wordTextError: { color: colors.error },
  allDone: {
    color: colors.success,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
    marginTop: 20,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
    marginBottom: 10,
  },
  categoryCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    gap: 4,
  },
  categoryCardActive: {
    backgroundColor: 'rgba(237,177,255,0.1)',
    borderColor: 'rgba(237,177,255,0.35)',
  },
  catIcon: { fontSize: 22 },
  catLabel: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.headlineMedium,
    textAlign: 'center',
  },
  catCount: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.body,
  },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, fontFamily: fonts.body },
});
