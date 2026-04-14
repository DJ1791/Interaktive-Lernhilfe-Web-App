import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { FillInBlank } from '../../components/exercises/FillInBlank';
import { MultipleChoice } from '../../components/exercises/MultipleChoice';
import { ErrorCorrection } from '../../components/exercises/ErrorCorrection';
import { WordOrder } from '../../components/exercises/WordOrder';
import { GradientButton } from '../../components/ui/GradientButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { IconButton } from '../../components/ui/IconButton';
import { Exercise } from '../../data/exercises';
import { getExercisesForTopic, grammarTopicLabels } from '../../data/exercises/grammar';
import { getImage } from '../../data/images';
import { colors, fonts, spacing, radius } from '../../theme';

type ViewMode = 'exercise' | 'results' | 'empty';

export default function GrammarTopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const updateFokusGrammar = useAppStore((s) => s.updateFokusGrammar);
  const setLastActivity = useAppStore((s) => s.setLastActivity);

  const exercises = useMemo(() => getExercisesForTopic(topicId || ''), [topicId]);
  const topicLabel = grammarTopicLabels[topicId || ''] || topicId || '';

  const [viewMode, setViewMode] = useState<ViewMode>(
    exercises.length === 0 ? 'empty' : 'exercise'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  // Track last activity for Home "Continue" button
  React.useEffect(() => {
    if (topicId && exercises.length > 0) {
      setLastActivity({
        type: 'grammar',
        routePath: `/grammar/${topicId}`,
        title: `Grammatik · ${topicLabel}`,
        timestamp: Date.now(),
      });
    }
  }, [topicId, exercises.length, topicLabel, setLastActivity]);

  const currentExercise = exercises[currentIndex];
  const [isImageMinimized, setIsImageMinimized] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => {
      setIsImageMinimized(true);
      scrollRef.current?.scrollToEnd({ animated: false });
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsImageMinimized(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAnswer = (correct: boolean) => {
    if (topicId) updateFokusGrammar(topicId, correct);
    const newResults = [...results, correct];
    setResults(newResults);

    setTimeout(() => {
      if (currentIndex + 1 < exercises.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setViewMode('results');
      }
    }, 300);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setResults([]);
    setViewMode('exercise');
  };

  if (viewMode === 'empty') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
          <Text style={styles.headerTitle}>{topicLabel}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyCenter}>
          <MaterialIcons name="inbox" size={48} color={colors.textDim} />
          <Text style={styles.emptyText}>
            Für dieses Thema sind keine Übungen verfügbar.
          </Text>
          <GradientButton title="Zurück" onPress={() => router.back()} size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  if (viewMode === 'results') {
    const correctCount = results.filter(Boolean).length;
    const percent = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <IconButton icon="close" onPress={() => router.back()} color={colors.textMuted} />
          <Text style={styles.headerTitle}>{topicLabel}</Text>
          <View style={{ width: 40 }} />
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
              <GradientButton title="Nochmal" onPress={handleRetry} size="lg" />
              <GradientButton
                title="Zurück"
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

  if (!currentExercise) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <IconButton icon="close" onPress={() => router.back()} color={colors.textMuted} />
        <View style={styles.exerciseProgress}>
          <ProgressBar
            percent={((currentIndex + 1) / exercises.length) * 100}
            height={4}
          />
        </View>
        <Text style={styles.exerciseCounter}>
          {currentIndex + 1}/{exercises.length}
        </Text>
      </View>

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
          <Text style={styles.topicBadge}>{topicLabel}</Text>

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
  exerciseProgress: { flex: 1 },
  exerciseCounter: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headline,
    minWidth: 40,
    textAlign: 'right',
  },
  exerciseContent: { padding: spacing.lg, gap: 16 },
  topicBadge: {
    alignSelf: 'flex-start',
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(237,177,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
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
    flexGrow: 1,
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
  emptyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: 'center',
  },
});
