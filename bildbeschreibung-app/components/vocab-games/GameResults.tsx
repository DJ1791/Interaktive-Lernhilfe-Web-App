import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { GradientButton } from '../ui/GradientButton';
import { ProgressBar } from '../ui/ProgressBar';
import { useCountUp } from '../../hooks/useGameAnimations';
import { colors, fonts, spacing } from '../../theme';

interface GameResultsProps {
  title?: string;
  correct: number;
  total: number;
  onRetry?: () => void;
  extraLine?: string;
}

export function GameResults({
  title,
  correct,
  total,
  onRetry,
  extraLine,
}: GameResultsProps) {
  const router = useRouter();
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const isGood = percent >= 70;
  const isPerfect = percent === 100;
  const countUp = useCountUp(percent, 1200);

  useEffect(() => {
    // Start the count-up animation after a brief delay for the entrance animations
    const timer = setTimeout(() => countUp.start(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.center}>
        {/* Trophy with bounce */}
        <Animated.View entering={ZoomIn.springify().damping(8).delay(100)}>
          <MaterialIcons
            name={isPerfect ? 'emoji-events' : isGood ? 'emoji-events' : 'school'}
            size={72}
            color={isPerfect ? '#FFD700' : isGood ? colors.tertiary : colors.primary}
          />
        </Animated.View>

        {title && <Text style={styles.title}>{title}</Text>}

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.headline}>
            {isPerfect ? 'Perfekt!' : isGood ? 'Super gemacht!' : 'Weiter üben!'}
          </Text>
        </Animated.View>

        {/* Animated count-up percentage */}
        <Text style={styles.percent}>{countUp.displayValue}%</Text>

        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <Text style={styles.detail}>
            {correct} von {total} richtig
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(400)} style={styles.progressWrap}>
          <ProgressBar percent={percent} height={10} />
        </Animated.View>

        {extraLine && (
          <Animated.View entering={FadeInDown.delay(1000).duration(400)}>
            <Text style={styles.extra}>{extraLine}</Text>
          </Animated.View>
        )}

        {isPerfect && (
          <Animated.View entering={ZoomIn.springify().damping(6).delay(1200)} style={styles.perfectBadge}>
            <Text style={styles.perfectText}>⭐ Perfekte Runde! ⭐</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(1400).duration(400)} style={styles.actions}>
          {onRetry && <GradientButton title="Nochmal spielen" onPress={onRetry} size="lg" />}
          <GradientButton
            title="Zurück zur Übersicht"
            onPress={() => router.back()}
            gradient={['#333', '#555']}
            size="lg"
          />
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  center: { alignItems: 'center', gap: 8 },
  title: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 10,
  },
  headline: {
    color: colors.text,
    fontSize: 26,
    fontFamily: fonts.headlineBlack,
    marginTop: 4,
  },
  percent: {
    color: colors.primary,
    fontSize: 64,
    fontFamily: fonts.headlineBlack,
    marginTop: 6,
  },
  detail: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  progressWrap: { width: '100%', paddingHorizontal: spacing.md },
  extra: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  perfectBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    marginTop: 8,
  },
  perfectText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: fonts.headlineBlack,
  },
  actions: { gap: 10, width: '100%', marginTop: 24 },
});
