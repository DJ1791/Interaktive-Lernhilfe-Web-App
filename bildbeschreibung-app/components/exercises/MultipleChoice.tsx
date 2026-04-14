import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useCorrectBounce, useShake, useFloatingText } from '../../hooks/useGameAnimations';
import { colors, fonts, radius } from '../../theme';
import type { MultipleChoiceExercise } from '../../data/exercises';

interface Props {
  exercise: MultipleChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoice({ exercise, onAnswer }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correctBounce = useCorrectBounce();
  const shake = useShake();
  const floatingXp = useFloatingText();

  const handleSelect = (index: number) => {
    if (submitted) return;
    Haptics.selectionAsync();
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    const correct = selectedIndex === exercise.correctIndex;
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
    onAnswer(selectedIndex === exercise.correctIndex);
  };

  return (
    <View>
      <Animated.View style={[shake.animatedStyle, correctBounce.animatedStyle]}>
        <GlassCard style={styles.card}>
          {floatingXp.visible && (
            <Animated.Text style={[styles.floatingXp, floatingXp.animatedStyle]}>
              +10 XP
            </Animated.Text>
          )}
        <Text style={styles.question}>{exercise.question}</Text>

        <View style={styles.options}>
          {exercise.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = index === exercise.correctIndex;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(index)}
                disabled={submitted}
                activeOpacity={0.7}
                style={[
                  styles.option,
                  showCorrect && styles.optionCorrect,
                  showWrong && styles.optionWrong,
                  isSelected && !submitted && styles.optionSelected,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[
                  styles.optionIndex,
                  showCorrect && styles.indexCorrect,
                  showWrong && styles.indexWrong,
                  isSelected && !submitted && styles.indexSelected,
                ]}>
                  <Text style={styles.optionIndexText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  showCorrect && styles.correctOptionText,
                  isSelected && !submitted && styles.selectedOptionText,
                ]}>
                  {option}
                </Text>
                {isSelected && !submitted && (
                  <View style={styles.selectedDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {!submitted && (
          <GradientButton
            title="Prüfen"
            onPress={handleSubmit}
            disabled={selectedIndex === null}
            size="md"
            style={styles.submitButton}
          />
        )}

        {submitted && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.feedback}>
              <Text style={[
                styles.feedbackLabel,
                selectedIndex === exercise.correctIndex
                  ? styles.feedbackLabelCorrect
                  : styles.feedbackLabelWrong,
              ]}>
                {selectedIndex === exercise.correctIndex ? 'Richtig!' : 'Nicht ganz...'}
              </Text>
              <Text style={styles.explanation}>{exercise.explanation}</Text>
            </Animated.View>
        )}
        </GlassCard>
      </Animated.View>
      {submitted && (
        <GradientButton
          title="Weiter"
          onPress={handleContinue}
          size="md"
          style={styles.submitButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20 },
  question: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.bodyMedium,
    lineHeight: 24,
    marginBottom: 20,
  },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 52,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(237,177,255,0.1)',
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  optionWrong: {
    borderColor: colors.error,
    backgroundColor: 'rgba(255,180,171,0.08)',
  },
  optionIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexSelected: { backgroundColor: colors.primary },
  indexCorrect: { backgroundColor: colors.success },
  indexWrong: { backgroundColor: colors.error },
  optionIndexText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.headline,
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.body,
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary,
    fontFamily: fonts.bodyMedium,
  },
  correctOptionText: {
    color: colors.success,
    fontFamily: fonts.bodyMedium,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  submitButton: { marginTop: 14 },
  feedback: {
    marginTop: 14,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
  },
  feedbackLabel: {
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
    marginBottom: 6,
  },
  feedbackLabelCorrect: { color: colors.success },
  feedbackLabelWrong: { color: colors.error },
  explanation: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    lineHeight: 20,
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
