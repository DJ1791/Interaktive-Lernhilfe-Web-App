import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { SlideInRight, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useScaleOnPress, useCorrectBounce, useShake } from '../../../hooks/useGameAnimations';
import { GameShell } from '../../../components/vocab-games/GameShell';
import { GameResults } from '../../../components/vocab-games/GameResults';
import { GlassCard } from '../../../components/ui/GlassCard';
import { GradientButton } from '../../../components/ui/GradientButton';
import { useAppStore } from '../../../stores/useAppStore';
import vocabularyData from '../../../data/vocabulary.json';
import { colors, fonts, radius, spacing } from '../../../theme';

type Article = 'der' | 'die' | 'das' | 'die·Pl';

interface QuizQuestion {
  word: string;
  correctArticle: Article;
  plural?: string;
}

function normalizeArticle(a?: string): Article | null {
  if (!a) return null;
  const x = a.toLowerCase().trim();
  if (x === 'der') return 'der';
  if (x === 'die') return 'die';
  if (x === 'das') return 'das';
  return null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(categoryId: string, count = 10): QuizQuestion[] {
  const cats = vocabularyData as any[];
  const cat = cats.find((c) => c.id === categoryId);
  if (!cat) return [];
  const nouns = (cat.nomen || []).filter((n: any) => !!n.article);

  // For variety, ca. 20% of questions should target Plural
  // But we need a plural form to use → put "die·Pl" as correct if the word has a plural
  const baseQuestions: QuizQuestion[] = nouns.map((n: any) => ({
    word: n.word,
    correctArticle: normalizeArticle(n.article) as Article,
    plural: n.plural,
  }));
  const withPlural = baseQuestions.filter((q) => !!q.plural);

  const shuffled = shuffle(baseQuestions);
  const pick = shuffled.slice(0, Math.min(count, shuffled.length));

  // Swap a few for plural-version: pick ~20% and flip to Plural-form
  if (withPlural.length > 0) {
    const targetPluralCount = Math.max(1, Math.floor(pick.length * 0.2));
    let swapped = 0;
    for (let i = 0; i < pick.length && swapped < targetPluralCount; i++) {
      if (pick[i].plural) {
        // Use plural form as display word, article = die·Pl
        pick[i] = {
          word: pick[i].plural!.replace(/^die\s+/i, ''), // drop "die " prefix
          correctArticle: 'die·Pl',
          plural: undefined,
        };
        swapped++;
      }
    }
  }

  return pick;
}

export default function ArtikelQuizGame() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const updateVocabGame = useAppStore((s) => s.updateVocabGame);

  const cats = vocabularyData as any[];
  const category = cats.find((c) => c.id === cat);

  const questions = useMemo(() => generateQuestions(cat || '', 10), [cat]);

  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<Article | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const progress = ((index + (submitted ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (article: Article) => {
    if (submitted) return;
    const isCorrect = article === current.correctArticle;
    setSelected(article);
    setSubmitted(true);
    Haptics.notificationAsync(
      isCorrect
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleContinue = () => {
    const isCorrect = selected === current.correctArticle;
    if (index + 1 >= questions.length) {
      updateVocabGame(
        `artikel-quiz:${cat}`,
        correctCount + (isCorrect && !submitted ? 1 : 0),
        questions.length
      );
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setSubmitted(false);
    setFinished(false);
  };

  if (!current && !finished) {
    return (
      <GameShell title="Artikel-Quiz">
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Keine Nomen in dieser Kategorie.</Text>
        </View>
      </GameShell>
    );
  }

  if (finished) {
    return (
      <GameShell title="Artikel-Quiz" subtitle={category?.label}>
        <GameResults
          title={category?.label}
          correct={correctCount}
          total={questions.length}
          onRetry={handleRetry}
        />
      </GameShell>
    );
  }

  const articles: Article[] = ['der', 'die', 'das', 'die·Pl'];

  return (
    <GameShell
      title="Artikel-Quiz"
      subtitle={category?.label}
      progressPercent={progress}
      progressLabel={`${index + 1} / ${questions.length}`}
    >
      <View style={styles.gameContent}>
        <Animated.View
          key={current.word}
          entering={SlideInRight.springify().damping(18)}
          style={styles.wordWrap}
        >
          <GlassCard style={styles.wordCard}>
            <Text style={styles.prompt}>Welcher Artikel?</Text>
            <Text style={styles.word}>{current.word}</Text>
          </GlassCard>
        </Animated.View>

        <View style={styles.buttonGrid}>
          {articles.map((art) => {
            const isSelected = selected === art;
            const isCorrectAnswer = art === current.correctArticle;
            let bgStyle = styles.btn;
            let textStyle = styles.btnText;

            if (submitted) {
              if (isCorrectAnswer) {
                bgStyle = { ...styles.btn, ...styles.btnCorrect };
                textStyle = { ...styles.btnText, ...styles.btnTextCorrect };
              } else if (isSelected) {
                bgStyle = { ...styles.btn, ...styles.btnWrong };
                textStyle = { ...styles.btnText, ...styles.btnTextWrong };
              } else {
                bgStyle = { ...styles.btn, ...styles.btnDim };
              }
            }

            return (
              <TouchableOpacity
                key={art}
                activeOpacity={0.85}
                onPress={() => handleSelect(art)}
                disabled={submitted}
                style={bgStyle}
              >
                <Text style={textStyle}>{art}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {submitted && (
          <>
            {selected === current.correctArticle ? (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.feedbackCorrect}>
                <Text style={styles.feedbackCorrectText}>Richtig!</Text>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.feedback}>
                <Text style={styles.feedbackText}>
                  Richtig: <Text style={styles.feedbackBold}>{current.correctArticle} {current.word}</Text>
                </Text>
              </Animated.View>
            )}
            <GradientButton
              title="Weiter"
              onPress={handleContinue}
              size="md"
              style={{ marginTop: 12 }}
            />
          </>
        )}
      </View>
    </GameShell>
  );
}

const styles = StyleSheet.create({
  gameContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  wordWrap: { alignItems: 'center', marginTop: 20 },
  wordCard: {
    padding: 32,
    alignItems: 'center',
    minWidth: 220,
  },
  prompt: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  word: {
    color: colors.text,
    fontSize: 36,
    fontFamily: fonts.headlineBlack,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flexBasis: '48%',
    paddingVertical: 18,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  btnText: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.headlineMedium,
  },
  btnCorrect: {
    backgroundColor: 'rgba(74,222,128,0.15)',
    borderColor: colors.success,
  },
  btnTextCorrect: { color: colors.success },
  btnWrong: {
    backgroundColor: 'rgba(255,180,171,0.15)',
    borderColor: colors.error,
  },
  btnTextWrong: { color: colors.error },
  btnDim: { opacity: 0.4 },
  feedback: {
    padding: 12,
    backgroundColor: 'rgba(255,180,171,0.08)',
    borderRadius: radius.md,
    alignItems: 'center',
  },
  feedbackCorrect: {
    padding: 12,
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: radius.md,
    alignItems: 'center',
  },
  feedbackCorrectText: {
    color: colors.success,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  feedbackText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
  },
  feedbackBold: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
  },
  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 14,
    fontFamily: fonts.body,
  },
});
