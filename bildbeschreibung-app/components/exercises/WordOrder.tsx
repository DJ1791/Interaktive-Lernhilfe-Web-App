import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { useCorrectBounce, useShake, useFloatingText } from '../../hooks/useGameAnimations';
import { colors, fonts, radius } from '../../theme';
import type { WordOrderExercise } from '../../data/exercises';

interface Props {
  exercise: WordOrderExercise;
  onAnswer: (correct: boolean) => void;
}

export function WordOrder({ exercise, onAnswer }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const correctBounce = useCorrectBounce();
  const shake = useShake();
  const floatingXp = useFloatingText();

  const availableParts = exercise.parts
    .map((_, i) => i)
    .filter((i) => !selectedOrder.includes(i));

  const handleSelectPart = useCallback(
    (index: number) => {
      if (submitted) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedOrder((prev) => [...prev, index]);
    },
    [submitted]
  );

  const handleRemovePart = useCallback(
    (orderIndex: number) => {
      if (submitted) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedOrder((prev) => prev.filter((_, i) => i !== orderIndex));
    },
    [submitted]
  );

  const handleSubmit = () => {
    if (selectedOrder.length !== exercise.parts.length) return;
    const correct =
      JSON.stringify(selectedOrder) === JSON.stringify(exercise.correctOrder);
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

  const correctSentence = exercise.correctOrder
    .map((i) => exercise.parts[i].text)
    .join(' ');

  return (
    <View>
      <Animated.View style={[shake.animatedStyle, correctBounce.animatedStyle]}>
        <GlassCard style={styles.card}>
          {floatingXp.visible && (
            <Animated.Text style={[styles.floatingXp, floatingXp.animatedStyle]}>
              +10 XP
            </Animated.Text>
          )}
          <Text style={styles.label}>Ordne die Satzteile richtig:</Text>

        <View style={styles.dropZone}>
          {selectedOrder.length === 0 ? (
            <Text style={styles.dropPlaceholder}>
              Tippe auf die Wörter in der richtigen Reihenfolge
            </Text>
          ) : (
            selectedOrder.map((partIndex, orderIdx) => (
              <TouchableOpacity
                key={`selected-${orderIdx}`}
                onPress={() => handleRemovePart(orderIdx)}
                disabled={submitted}
                style={[
                  styles.partChip,
                  styles.selectedChip,
                  submitted && isCorrect && styles.chipCorrect,
                  submitted && !isCorrect && styles.chipWrong,
                ]}
              >
                <Text
                  style={[
                    styles.partText,
                    submitted && isCorrect && styles.chipCorrectText,
                    submitted && !isCorrect && styles.chipWrongText,
                  ]}
                >
                  {exercise.parts[partIndex].text}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.partsContainer}>
          {availableParts.map((partIndex) => (
            <Animated.View key={`avail-${partIndex}`} layout={Layout.duration(200)}>
              <TouchableOpacity
                onPress={() => handleSelectPart(partIndex)}
                style={styles.partChip}
                activeOpacity={0.7}
              >
                <Text style={styles.partText}>{exercise.parts[partIndex].text}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {!submitted && (
          <View style={{ gap: 8 }}>
            <GradientButton
              title="Prüfen"
              onPress={handleSubmit}
              disabled={selectedOrder.length !== exercise.parts.length}
              size="md"
            />
            {selectedOrder.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedOrder([]);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.resetButton}
                activeOpacity={0.7}
                accessibilityLabel="Alle Satzteile zurücksetzen"
              >
                <Text style={styles.resetText}>Zurücksetzen</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {submitted && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.feedback}>
              <Text
                style={[styles.feedbackText, isCorrect ? styles.correctText : styles.wrongText]}
              >
                {isCorrect ? 'Richtig!' : 'Nicht ganz...'}
              </Text>
              {!isCorrect && (
                <Text style={styles.correctAnswer}>{correctSentence}</Text>
              )}
              <Text style={styles.hint}>{exercise.hint}</Text>
            </Animated.View>
        )}
        </GlassCard>
      </Animated.View>
      {submitted && (
        <GradientButton
          title="Weiter"
          onPress={handleContinue}
          size="md"
          style={{ marginTop: 12 }}
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
    marginBottom: 12,
  },
  dropZone: {
    minHeight: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  dropPlaceholder: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: fonts.body,
    fontStyle: 'italic',
  },
  partsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  partChip: {
    backgroundColor: 'rgba(237,177,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(237,177,255,0.20)',
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: 'rgba(255,177,197,0.12)',
    borderColor: 'rgba(255,177,197,0.25)',
  },
  chipCorrect: {
    backgroundColor: 'rgba(74,222,128,0.10)',
    borderColor: colors.success,
  },
  chipWrong: {
    backgroundColor: 'rgba(255,180,171,0.10)',
    borderColor: colors.error,
  },
  chipCorrectText: { color: colors.success },
  chipWrongText: { color: colors.error },
  partText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.bodyMedium,
  },
  button: { marginTop: 0 },
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
  resetButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resetText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
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
