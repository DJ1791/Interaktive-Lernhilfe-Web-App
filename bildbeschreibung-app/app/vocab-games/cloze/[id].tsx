import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { GameShell } from '../../../components/vocab-games/GameShell';
import { GameResults } from '../../../components/vocab-games/GameResults';
import { GradientButton } from '../../../components/ui/GradientButton';
import { useAppStore } from '../../../stores/useAppStore';
import { clozeExercises } from '../../../data/vocab-games/clozeTexts';
import { getImage } from '../../../data/images';
import { ClozeSegment } from '../../../data/vocab-games';
import { colors, fonts, radius, spacing } from '../../../theme';

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[„"""]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue');
}

function isCorrectAnswer(userInput: string, correct: string, alternatives?: string[]): boolean {
  const normalized = normalize(userInput);
  if (normalized === normalize(correct)) return true;
  if (alternatives) {
    return alternatives.some((alt) => normalize(alt) === normalized);
  }
  return false;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ClozeGame() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const updateVocabGame = useAppStore((s) => s.updateVocabGame);

  const exercise = useMemo(() => clozeExercises.find((e) => e.id === id), [id]);

  // Blanks + Wortbank Setup
  const blankIndices = useMemo(() => {
    if (!exercise) return [];
    return exercise.segments
      .map((seg, i) => (seg.type === 'blank' ? i : -1))
      .filter((i) => i >= 0);
  }, [exercise]);

  const wordBank = useMemo(() => {
    if (!exercise) return [];
    if (exercise.level === 3) return [];
    const items = blankIndices.map((i) => {
      const seg = exercise.segments[i] as any;
      if (exercise.level === 1) return seg.correct;
      return seg.base ?? seg.correct;
    });
    return shuffle(items);
  }, [exercise, blankIndices]);

  // State: userAnswers[segmentIndex] = what user put into the blank
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // For Level 1: which wordBank items are still available
  const [bankUsed, setBankUsed] = useState<Record<number, boolean>>({});
  const [selectedBankIdx, setSelectedBankIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!exercise) {
    return (
      <GameShell title="Lückentext">
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Übung nicht gefunden.</Text>
        </View>
      </GameShell>
    );
  }

  // ---- Level-1 Tap-to-select-Tap-to-drop ----
  const handleBankTap = (idx: number) => {
    if (bankUsed[idx]) return;
    setSelectedBankIdx(idx === selectedBankIdx ? null : idx);
    Haptics.selectionAsync();
  };

  const handleBlankTapL1 = (segIdx: number) => {
    if (selectedBankIdx === null) {
      // Clicking a filled blank un-assigns it
      const currentAnswer = answers[segIdx];
      if (currentAnswer) {
        const bankIdx = wordBank.findIndex((w, i) => w === currentAnswer && bankUsed[i]);
        if (bankIdx >= 0) {
          setBankUsed((u) => ({ ...u, [bankIdx]: false }));
        }
        setAnswers((a) => {
          const next = { ...a };
          delete next[segIdx];
          return next;
        });
      }
      return;
    }
    // Place the selected word into this blank
    const word = wordBank[selectedBankIdx];
    // If blank was already filled, return previous bank item
    const prev = answers[segIdx];
    if (prev) {
      const prevIdx = wordBank.findIndex((w, i) => w === prev && bankUsed[i]);
      if (prevIdx >= 0) setBankUsed((u) => ({ ...u, [prevIdx]: false }));
    }
    setAnswers((a) => ({ ...a, [segIdx]: word }));
    setBankUsed((u) => ({ ...u, [selectedBankIdx]: true }));
    setSelectedBankIdx(null);
    Haptics.selectionAsync();
  };

  // ---- Level 2/3 TextInput ----
  const handleInputChange = (segIdx: number, value: string) => {
    setAnswers((a) => ({ ...a, [segIdx]: value }));
  };

  // ---- Submission ----
  const allFilled = blankIndices.every((i) => (answers[i] ?? '').trim().length > 0);

  const handleSubmit = () => {
    Keyboard.dismiss();
    setSubmitted(true);
    let correct = 0;
    blankIndices.forEach((i) => {
      const seg = exercise.segments[i] as any;
      if (isCorrectAnswer(answers[i] ?? '', seg.correct, seg.alternatives)) correct++;
    });
    Haptics.notificationAsync(
      correct === blankIndices.length
        ? Haptics.NotificationFeedbackType.Success
        : correct > blankIndices.length / 2
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error
    );
  };

  const handleShowResults = () => {
    let correct = 0;
    blankIndices.forEach((i) => {
      const seg = exercise.segments[i] as any;
      if (isCorrectAnswer(answers[i] ?? '', seg.correct, seg.alternatives)) correct++;
    });
    updateVocabGame(`cloze:${exercise.id}`, correct, blankIndices.length);
    setFinished(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setBankUsed({});
    setSelectedBankIdx(null);
    setSubmitted(false);
    setFinished(false);
  };

  // ---- Render ----
  if (finished) {
    let correct = 0;
    blankIndices.forEach((i) => {
      const seg = exercise.segments[i] as any;
      if (isCorrectAnswer(answers[i] ?? '', seg.correct, seg.alternatives)) correct++;
    });
    return (
      <GameShell title="Lückentext" subtitle={exercise.title}>
        <GameResults
          title={exercise.title}
          correct={correct}
          total={blankIndices.length}
          onRetry={handleRetry}
        />
      </GameShell>
    );
  }

  const filledCount = blankIndices.filter((i) => (answers[i] ?? '').trim().length > 0).length;
  const progress = (filledCount / blankIndices.length) * 100;

  return (
    <GameShell
      title={`Lückentext · Level ${exercise.level}`}
      subtitle={exercise.title.split(' · ')[0]}
      progressPercent={progress}
      progressLabel={`${filledCount} / ${blankIndices.length}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image source={getImage(exercise.img)} style={styles.image} resizeMode="cover" />

          <View style={styles.textContainer}>
            {exercise.segments.map((seg, segIdx) => {
              if (seg.type === 'text') {
                return (
                  <Text key={segIdx} style={styles.textPart}>
                    {seg.content}
                  </Text>
                );
              }
              // Blank
              const userAnswer = answers[segIdx] ?? '';
              const blankSeg = seg as Extract<ClozeSegment, { type: 'blank' }>;
              const correctCheck = submitted
                ? isCorrectAnswer(userAnswer, blankSeg.correct, blankSeg.alternatives)
                : null;

              if (exercise.level === 1) {
                return (
                  <TouchableOpacity
                    key={segIdx}
                    activeOpacity={0.8}
                    onPress={() => !submitted && handleBlankTapL1(segIdx)}
                    disabled={submitted}
                  >
                    <View
                      style={[
                        styles.blankBox,
                        userAnswer && styles.blankBoxFilled,
                        submitted && correctCheck === true && styles.blankBoxCorrect,
                        submitted && correctCheck === false && styles.blankBoxWrong,
                      ]}
                    >
                      <Text style={styles.blankText}>
                        {userAnswer || '____'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
              // Level 2 + 3: TextInput
              return (
                <View key={segIdx} style={styles.inputWrap}>
                  <TextInput
                    value={userAnswer}
                    onChangeText={(v) => !submitted && handleInputChange(segIdx, v)}
                    editable={!submitted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="____"
                    placeholderTextColor={colors.textDim}
                    style={[
                      styles.input,
                      submitted && correctCheck === true && styles.inputCorrect,
                      submitted && correctCheck === false && styles.inputWrong,
                    ]}
                  />
                  {submitted && correctCheck === false && (
                    <Text style={styles.correctBelow}>{blankSeg.correct}</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Wortbank (Level 1/2) */}
          {wordBank.length > 0 && !submitted && (
            <View style={styles.bankWrap}>
              <Text style={styles.bankLabel}>
                {exercise.level === 1 ? 'Wortbank — tippe ein Wort, dann die Lücke:' : 'Grundformen (musst du anpassen):'}
              </Text>
              <View style={styles.bankRow}>
                {wordBank.map((w, i) => {
                  if (bankUsed[i]) return null;
                  const isSelected = i === selectedBankIdx;
                  return (
                    <Animated.View
                      key={`${w}-${i}`}
                      entering={FadeIn}
                      exiting={FadeOut}
                      layout={Layout.springify()}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() =>
                          exercise.level === 1 ? handleBankTap(i) : undefined
                        }
                        disabled={exercise.level !== 1}
                        style={[
                          styles.bankChip,
                          isSelected && styles.bankChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.bankChipText,
                            isSelected && styles.bankChipTextSelected,
                          ]}
                        >
                          {w}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}

          {!submitted && (
            <GradientButton
              title="Prüfen"
              onPress={handleSubmit}
              disabled={!allFilled}
              size="lg"
              style={{ marginTop: 16 }}
            />
          )}

          {submitted && (
            <GradientButton
              title="Weiter zu den Ergebnissen"
              onPress={handleShowResults}
              size="lg"
              style={{ marginTop: 16 }}
            />
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GameShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  image: {
    width: '100%',
    height: 180,
    borderRadius: radius.lg,
    marginBottom: 16,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  textPart: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.body,
    lineHeight: 28,
  },
  blankBox: {
    minWidth: 70,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankBoxFilled: {
    backgroundColor: 'rgba(237,177,255,0.08)',
    borderRadius: 4,
  },
  blankBoxCorrect: {
    borderBottomColor: colors.success,
    backgroundColor: 'rgba(74,222,128,0.1)',
  },
  blankBoxWrong: {
    borderBottomColor: colors.error,
    backgroundColor: 'rgba(255,180,171,0.1)',
  },
  blankText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.bodyMedium,
  },
  inputWrap: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  input: {
    minWidth: 90,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.bodyMedium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  inputCorrect: {
    borderBottomColor: colors.success,
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  inputWrong: {
    borderBottomColor: colors.error,
    backgroundColor: 'rgba(255,180,171,0.08)',
  },
  correctBelow: {
    color: colors.success,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  bankWrap: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
  },
  bankLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headline,
    marginBottom: 10,
  },
  bankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bankChipSelected: {
    backgroundColor: 'rgba(237,177,255,0.2)',
    borderColor: colors.primary,
  },
  bankChipText: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
  bankChipTextSelected: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
  },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, fontFamily: fonts.body },
});
