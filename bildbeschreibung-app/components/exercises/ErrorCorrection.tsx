import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useCorrectBounce, useShake, useFloatingText } from '../../hooks/useGameAnimations';
import { colors, fonts, radius } from '../../theme';
import type { ErrorCorrectionExercise } from '../../data/exercises';

interface Props {
  exercise: ErrorCorrectionExercise;
  onAnswer: (correct: boolean) => void;
}

export function ErrorCorrection({ exercise, onAnswer }: Props) {
  const [correction, setCorrection] = useState(exercise.wrongSentence);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctBounce = useCorrectBounce();
  const shake = useShake();
  const floatingXp = useFloatingText();

  const handleSubmit = () => {
    if (!correction.trim()) return;
    Keyboard.dismiss();
    const normalize = (s: string) =>
      s.toLowerCase().trim().replace(/[„""\.]/g, '').replace(/\s+/g, ' ');
    const correct = normalize(correction) === normalize(exercise.correctSentence);
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

  const hasEdited = correction.trim() !== exercise.wrongSentence.trim();

  return (
    <View>
      <Animated.View style={[shake.animatedStyle, correctBounce.animatedStyle]}>
        <GlassCard style={styles.card}>
          {floatingXp.visible && (
            <Animated.Text style={[styles.floatingXp, floatingXp.animatedStyle]}>
              +10 XP
            </Animated.Text>
          )}
          <Text style={styles.label}>Finde und korrigiere den Fehler:</Text>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            Der Satz ist unten vorausgefüllt. Tippe auf die fehlerhafte Stelle und korrigiere sie direkt.
          </Text>
        </View>

        <TextInput
          style={[
            styles.input,
            submitted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
          ]}
          value={correction}
          onChangeText={setCorrection}
          placeholder="Korrigierten Satz eingeben…"
          placeholderTextColor={colors.textDim}
          editable={!submitted}
          multiline
          autoCapitalize="sentences"
          autoCorrect={false}
          returnKeyType="done"
        />

        {!submitted && (
          <GradientButton
            title="Prüfen"
            onPress={handleSubmit}
            disabled={!hasEdited}
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
                  {exercise.correctSentence}
                </Text>
              )}
              <Text style={styles.hint}>{exercise.errorHint}</Text>
            </Animated.View>
        )}
        </GlassCard>
      </Animated.View>
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

const styles = StyleSheet.create({
  card: { padding: 20 },
  label: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  instructionBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.sm,
    marginBottom: 14,
  },
  instructionText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 17,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.body,
    padding: 14,
    minHeight: 70,
    marginBottom: 14,
    lineHeight: 22,
  },
  inputCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(74,222,128,0.06)',
  },
  inputWrong: {
    borderColor: colors.error,
    backgroundColor: 'rgba(255,180,171,0.06)',
  },
  button: { marginTop: 4 },
  feedback: {
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
    fontSize: 14,
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
