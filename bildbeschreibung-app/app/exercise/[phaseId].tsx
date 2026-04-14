import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInRight, FadeOut, ZoomIn, LinearTransition } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { useStreakCounter } from '../../hooks/useGameAnimations';
import { FillInBlank } from '../../components/exercises/FillInBlank';
import { MultipleChoice } from '../../components/exercises/MultipleChoice';
import { ErrorCorrection } from '../../components/exercises/ErrorCorrection';
import { WordOrder } from '../../components/exercises/WordOrder';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { IconButton } from '../../components/ui/IconButton';
import { getExercisesForLevel, Exercise } from '../../data/exercises';
import { phases, phaseLabels } from '../../data/phases';
import { getImage } from '../../data/images';
import { colors, fonts, spacing, radius } from '../../theme';

type ViewMode = 'levelSelect' | 'exercise' | 'results';

export default function ExerciseScreen() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const router = useRouter();
  const updateExerciseResult = useAppStore((s) => s.updateExerciseResult);
  const setLastActivity = useAppStore((s) => s.setLastActivity);

  const [viewMode, setViewMode] = useState<ViewMode>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const streakCounter = useStreakCounter();
  const [isImageMinimized, setIsImageMinimized] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Shrink image when keyboard opens, restore when it closes
  // ALSO scroll to the end so the input field becomes visible
  useEffect(() => {
    // Fire on keyboardWillShow (iOS) — ~250ms earlier than keyboardDidShow
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const showSub = Keyboard.addListener(showEvent, () => {
      setIsImageMinimized(true);
      // Instant scroll (no animation) — content is in position before user looks at it
      scrollRef.current?.scrollToEnd({ animated: false });
    });
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsImageMinimized(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const exercises = useMemo(
    () => getExercisesForLevel(phaseId!, selectedLevel),
    [phaseId, selectedLevel]
  );

  const phaseConfig = phases.find((p) => p.id === phaseId);
  const phaseLabel = phaseLabels[phaseId!]?.de || phaseConfig?.label || phaseId;
  const currentExercise = exercises[currentIndex];

  const handleStartLevel = (level: number) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
    setResults([]);
    setViewMode('exercise');
    // Track this as the user's last activity so Home can show a Continue button
    setLastActivity({
      type: 'phase',
      routePath: `/exercise/${phaseId}`,
      title: `${phaseLabel}`,
      subtitle: `Level ${level}`,
      timestamp: Date.now(),
    });
  };

  const handleAnswer = (correct: boolean) => {
    updateExerciseResult(phaseId!, selectedLevel, correct);
    const newResults = [...results, correct];
    setResults(newResults);
    if (correct) {
      streakCounter.bump();
    } else {
      streakCounter.reset();
    }

    setTimeout(() => {
      if (currentIndex + 1 < exercises.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setViewMode('results');
      }
    }, 200);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setResults([]);
    setViewMode('exercise');
  };

  if (viewMode === 'results') {
    const correctCount = results.filter(Boolean).length;
    const percent = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

    // Check if there's a next level within this phase
    const nextLevel = selectedLevel < 3 ? selectedLevel + 1 : null;
    const nextLevelExercises = nextLevel
      ? getExercisesForLevel(phaseId!, nextLevel)
      : [];
    const hasNextLevel = nextLevel !== null && nextLevelExercises.length > 0;

    const startNextLevel = () => {
      if (!nextLevel) return;
      setSelectedLevel(nextLevel);
      setCurrentIndex(0);
      setResults([]);
      setViewMode('exercise');
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton icon="close" onPress={() => router.back()} color={colors.textMuted} accessibilityLabel="Schließen" />
        </View>
        <ScrollView contentContainerStyle={styles.resultsContent}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.resultsCenter}>
            <MaterialIcons
              name={percent >= 70 ? 'emoji-events' : 'school'}
              size={56}
              color={percent >= 70 ? colors.tertiary : colors.primary}
            />
            <Text style={styles.resultsTitle}>
              {percent >= 70 ? 'Sehr gut!' : 'Weiter üben!'}
            </Text>
            <Text style={styles.resultsPercent}>{percent}%</Text>
            <Text style={styles.resultsDetail}>
              {correctCount} von {results.length} richtig
            </Text>
            <ProgressBar percent={percent} height={10} />

            <View style={styles.resultsActions}>
              {hasNextLevel && (
                <GradientButton
                  title={`Weiter zu Level ${nextLevel}`}
                  onPress={startNextLevel}
                  size="lg"
                />
              )}
              <GradientButton
                title="Nochmal"
                onPress={handleRetry}
                gradient={hasNextLevel ? ['#555', '#777'] : undefined}
                size="lg"
              />
              <GradientButton
                title="Zurück zur Übersicht"
                onPress={() => router.back()}
                gradient={['#333', '#555']}
                size="lg"
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (viewMode === 'exercise' && currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton
            icon="close"
            onPress={() => setViewMode('levelSelect')}
            color={colors.textMuted}
            accessibilityLabel="Übung abbrechen"
          />
          <View style={styles.exerciseHeaderCenter}>
            <Text style={styles.exerciseContextLabel}>
              {phaseLabel} · Level {selectedLevel}
            </Text>
            <View style={styles.exerciseProgress}>
              <ProgressBar
                percent={((currentIndex + 1) / exercises.length) * 100}
                height={4}
              />
            </View>
          </View>
          <Text style={styles.exerciseCounter}>
            {currentIndex + 1}/{exercises.length}
          </Text>
        </View>

        {/* Streak badge */}
        {streakCounter.streak >= 2 && (
          <Animated.View
            entering={ZoomIn.springify().damping(8)}
            exiting={FadeOut.duration(200)}
            style={styles.streakBadge}
          >
            <Animated.View style={streakCounter.animatedStyle}>
              <Text style={styles.streakText}>🔥 {streakCounter.streak} in Folge!</Text>
            </Animated.View>
          </Animated.View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.exerciseContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentExercise.img && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setIsImageMinimized((m) => !m)}
              accessibilityLabel={isImageMinimized ? 'Bild vergrößern' : 'Bild verkleinern'}
            >
              <Animated.View
                entering={FadeIn.duration(300)}
                layout={LinearTransition.duration(220)}
              >
                <Image
                  source={getImage(currentExercise.img)}
                  style={[
                    styles.exerciseImage,
                    isImageMinimized && styles.exerciseImageMinimized,
                  ]}
                  resizeMode="cover"
                />
                {isImageMinimized && (
                  <View style={styles.imageTapHint}>
                    <MaterialIcons name="zoom-out-map" size={14} color={colors.text} />
                    <Text style={styles.imageTapHintText}>Antippen zum Vergrößern</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}

          <ExerciseRenderer
            key={`${currentExercise.id}-${currentIndex}`}
            exercise={currentExercise}
            onAnswer={handleAnswer}
          />
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
        <Text style={styles.headerTitle}>{phaseLabel}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.levelContent}
        showsVerticalScrollIndicator={false}
      >
        {phaseConfig && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.phaseInfo}>
            <Text style={styles.phaseTitle}>{phaseLabel}</Text>
            <Text style={styles.phaseDesc}>{phaseConfig.description}</Text>
          </Animated.View>
        )}

        {[1, 2, 3].map((level) => {
          const levelExercises = getExercisesForLevel(phaseId!, level);
          if (levelExercises.length === 0) return null;

          const types = [...new Set(levelExercises.map((e) => e.type))];
          const typeLabels = types.map((t) => {
            switch (t) {
              case 'fillInBlank': return 'Lückentext';
              case 'multipleChoice': return 'Auswahl';
              case 'errorCorrection': return 'Fehlerkorrektur';
              case 'wordOrder': return 'Satzstellung';
              default: return t;
            }
          });

          return (
            <Animated.View key={level} entering={FadeInRight.delay(level * 100).duration(400)}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleStartLevel(level)}
              >
                <GlassCard style={styles.levelCard}>
                  <View style={styles.levelHeader}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>{level}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.levelName}>Level {level}</Text>
                      <Text style={styles.levelMeta}>
                        {levelExercises.length} Übungen · {typeLabels.join(', ')}
                      </Text>
                    </View>
                    <MaterialIcons name="play-arrow" size={24} color={colors.primary} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function ExerciseRenderer({ exercise, onAnswer }: { exercise: Exercise; onAnswer: (correct: boolean) => void }) {
  switch (exercise.type) {
    case 'fillInBlank':
      return <FillInBlank exercise={exercise} onAnswer={onAnswer} />;
    case 'multipleChoice':
      return <MultipleChoice exercise={exercise} onAnswer={onAnswer} />;
    case 'errorCorrection':
      return <ErrorCorrection exercise={exercise} onAnswer={onAnswer} />;
    case 'wordOrder':
      return <WordOrder exercise={exercise} onAnswer={onAnswer} />;
    default:
      return <Text style={{ color: colors.error }}>Unbekannter Übungstyp</Text>;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  levelContent: { padding: spacing.lg, gap: 12 },
  phaseInfo: { marginBottom: 8 },
  phaseTitle: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
  },
  phaseDesc: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: fonts.body,
    marginTop: 4,
    lineHeight: 20,
  },
  levelCard: { padding: 16 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(237,177,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: fonts.headlineBlack,
  },
  levelName: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.headlineMedium,
  },
  levelMeta: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  streakBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,184,112,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,184,112,0.3)',
    marginBottom: 6,
  },
  streakText: {
    color: colors.tertiary,
    fontSize: 13,
    fontFamily: fonts.headlineMedium,
  },
  exerciseHeaderCenter: {
    flex: 1,
    gap: 4,
  },
  exerciseContextLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  exerciseProgress: { width: '100%' },
  exerciseCounter: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headline,
    minWidth: 40,
    textAlign: 'right',
  },
  exerciseContent: { padding: spacing.lg, gap: 16 },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
  },
  exerciseImageMinimized: {
    height: 100,
  },
  imageTapHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  imageTapHintText: {
    color: colors.text,
    fontSize: 10,
    fontFamily: fonts.bodyMedium,
  },
  resultsContent: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  resultsCenter: { alignItems: 'center', gap: 12 },
  resultsTitle: {
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.headlineBlack,
  },
  resultsPercent: {
    color: colors.primary,
    fontSize: 56,
    fontFamily: fonts.headlineBlack,
  },
  resultsDetail: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.body,
    marginBottom: 8,
  },
  resultsActions: { gap: 10, width: '100%', marginTop: 24 },
});
