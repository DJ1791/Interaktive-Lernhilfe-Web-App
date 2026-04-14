import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useCorrectBounce, useShake, useFloatingText } from '../../hooks/useGameAnimations';
import { colors, fonts, radius } from '../../theme';
import type { FillInBlankExercise } from '../../data/exercises';

interface Props {
  exercise: FillInBlankExercise;
  onAnswer: (correct: boolean) => void;
}

export function FillInBlank({ exercise, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctBounce = useCorrectBounce();
  const shake = useShake();
  const floatingXp = useFloatingText();

  const handleSubmit = () => {
    if (!answer.trim()) return;
    Keyboard.dismiss();
    const correct = checkAnswer(answer.trim(), exercise.correct, exercise.alternatives);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) {
      correctBounce.trigger();
      floatingXp.trigger();
    } else {
      shake.trigger();
    }
    Haptics.notificationAsync(
      correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
  };

  const handleContinue = () => {
    onAnswer(isCorrect);
  };

  return (
    <View>
      <Animated.View style={[shake.animatedStyle, correctBounce.animatedStyle]}>
        <GlassCard style={styles.card}>
          {exercise.givenWord && (
            <View style={styles.givenWordContainer}>
              <Text style={styles.givenWordLabel}>Gegeben:</Text>
              <Text style={styles.givenWord}>{exercise.givenWord}</Text>
            </View>
          )}

          {floatingXp.visible && (
            <Animated.Text style={[styles.floatingXp, floatingXp.animatedStyle]}>
              +10 XP
            </Animated.Text>
          )}

          <View style={styles.sentenceContainer}>
            <Text style={styles.sentenceText}>{exercise.before}</Text>
            <TextInput
              style={[
                styles.input,
                submitted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
              ]}
              value={answer}
              onChangeText={setAnswer}
              placeholder="hier eintippen…"
              placeholderTextColor={colors.textDim}
              editable={!submitted}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <Text style={styles.sentenceText}>{exercise.after}</Text>
          </View>

          {!submitted && (
            <GradientButton
              title="Prüfen"
              onPress={handleSubmit}
              disabled={!answer.trim()}
              size="md"
              style={styles.button}
            />
          )}

          {submitted && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.feedback}>
              <Text style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}>
                {isCorrect ? 'Richtig!' : 'Nicht ganz...'}
              </Text>
              {!isCorrect && (
                <Text style={styles.correctAnswer}>
                  Richtige Antwort: {exercise.correct}
                </Text>
              )}
              <Text style={styles.hint}>{exercise.hint}</Text>
            </Animated.View>
          )}
        </GlassCard>
      </Animated.View>

      {/* Weiter-Button AUSSERHALB der animierten View, damit Touch immer funktioniert */}
      {submitted && (
        <GradientButton
          title="Weiter"
          onPress={handleContinue}
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
}

function checkAnswer(answer: string, correct: string, alternatives?: string[]): boolean {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[„""]/g, '');
  if (normalize(answer) === normalize(correct)) return true;
  if (alternatives) {
    return alternatives.some((alt) => normalize(answer) === normalize(alt));
  }
  return false;
}

const styles = StyleSheet.create({
  card: { padding: 20 },
  givenWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(237,177,255,0.08)',
    borderRadius: radius.md,
  },
  givenWordLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  givenWord: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  sentenceText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.body,
    lineHeight: 24,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.bodyMedium,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  inputCorrect: {
    borderBottomColor: colors.success,
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  inputWrong: {
    borderBottomColor: colors.error,
    backgroundColor: 'rgba(255,180,171,0.08)',
  },
  button: { marginTop: 8 },
  feedback: {
    marginTop: 4,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
  },
  feedbackText: {
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
    marginBottom: 4,
  },
  correctText: { color: colors.success },
  wrongText: { color: colors.error },
  correctAnswer: {
    color: colors.secondary,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    marginBottom: 6,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    fontStyle: 'italic',
  },
  floatingXp: {
    position: 'absolute',
    top: -10,
    right: 16,
    color: colors.success,
    fontSize: 16,
    fontFamily: fonts.headlineBlack,
    zIndex: 10,
  },
});
