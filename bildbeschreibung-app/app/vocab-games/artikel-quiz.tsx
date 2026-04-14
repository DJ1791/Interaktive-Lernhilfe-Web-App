import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconButton } from '../../components/ui/IconButton';
import { GameHubCard } from '../../components/vocab-games/GameHubCard';
import { useAppStore } from '../../stores/useAppStore';
import vocabularyData from '../../data/vocabulary.json';
import { colors, fonts, spacing } from '../../theme';

type Category = {
  id: string;
  label: string;
  labelEN: string;
  icon: string;
  nomen: Array<{ word: string; article?: string; plural?: string }>;
};

export default function ArtikelQuizHub() {
  const router = useRouter();
  const getVocabGameStats = useAppStore((s) => s.getVocabGameStats);
  const categories = (vocabularyData as Category[]).filter(
    (c) => (c.nomen || []).filter((n) => n.article).length >= 4
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Artikel-Quiz</Text>
          <Text style={styles.subtitle}>der · die · das · die·Pl</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Wähle eine Kategorie. Du bekommst 10 Nomen nacheinander und musst jedes Mal den richtigen
          Artikel antippen. Schnelles Reaktionstraining für Genus.
        </Text>

        {categories.map((cat, idx) => {
          const stats = getVocabGameStats(`artikel-quiz:${cat.id}`);
          const bestScore = stats?.bestScore ?? 0;
          return (
            <Animated.View key={cat.id} entering={FadeInDown.delay(idx * 40).duration(400)}>
              <GameHubCard
                emoji={cat.icon}
                title={cat.label}
                subtitle={`${(cat.nomen || []).length} Nomen${bestScore > 0 ? ` · Beste: ${bestScore}%` : ''}`}
                badge={bestScore === 100 ? 'Gold' : undefined}
                onPress={() => router.push(`/wortschatz/artikel-quiz/${cat.id}` as any)}
              />
            </Animated.View>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 1,
  },
  scroll: { padding: spacing.lg },
  intro: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
});
