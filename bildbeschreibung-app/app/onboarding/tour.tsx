import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { GradientButton } from '../../components/ui/GradientButton';
import { useAppStore } from '../../stores/useAppStore';
import { colors, fonts, radius, spacing } from '../../theme';

interface TourStep {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

const tourSteps: TourStep[] = [
  {
    icon: 'menu-book',
    iconColor: '#edb1ff',
    title: 'Bildbeschreibung in 4 Phasen',
    description:
      'Im Lernen-Tab arbeitest du dich schrittweise durch 4 Phasen: Einleitung, Positionen, Präpositionen und Adjektive. Jede Phase hat 3 Schwierigkeitsstufen.',
  },
  {
    icon: 'style',
    iconColor: '#ffb1c5',
    title: 'Wortschatz aufbauen & üben',
    description:
      'Im Wortschatz-Tab findest du 357 Vokabeln in 12 Kategorien mit Übersetzungen in deiner Muttersprache. Verschiedene Übungsformen wie Lückentext, Artikel-Quiz oder Kreuzworträtsel helfen dir beim Einprägen.',
  },
  {
    icon: 'functions',
    iconColor: '#ffb870',
    title: 'Grammatik & Fortschritt',
    description:
      'Im Lernen-Tab findest du auch gezielte Grammatik-Übungen. Im Ich-Tab siehst du deinen Fortschritt, Erfolge und deine Lernstatistik der letzten Woche.',
  },
];

const { width } = Dimensions.get('window');

export default function TourScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);

  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)' as any);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)' as any);
  };

  const currentStep = tourSteps[stepIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>
          Schritt 2 von 2 · Kurz-Tour ({stepIndex + 1}/{tourSteps.length})
        </Text>
        <TouchableOpacity onPress={handleSkip} accessibilityLabel="Tour überspringen">
          <Text style={styles.skipText}>Überspringen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Animated.View
          key={stepIndex}
          entering={FadeIn.duration(350)}
          exiting={FadeOut.duration(200)}
          style={styles.stepWrap}
        >
          <View style={[styles.iconBg, { backgroundColor: currentStep.iconColor + '20' }]}>
            <MaterialIcons
              name={currentStep.icon as any}
              size={48}
              color={currentStep.iconColor}
            />
          </View>
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.description}>{currentStep.description}</Text>
        </Animated.View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dotsRow}>
          {tourSteps.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === stepIndex && styles.dotActive]}
            />
          ))}
        </View>
        <View style={styles.buttonsRow}>
          {stepIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={18} color={colors.textDim} />
              <Text style={styles.backText}>Zurück</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }} />
          )}
          <GradientButton
            title={stepIndex === tourSteps.length - 1 ? 'Jetzt starten' : 'Weiter'}
            onPress={handleNext}
            size="lg"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  stepLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  skipText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  stepWrap: { alignItems: 'center' },
  iconBg: {
    width: 104,
    height: 104,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: width - 80,
  },
  bottom: {
    padding: spacing.lg,
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 80,
  },
  backText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
});
