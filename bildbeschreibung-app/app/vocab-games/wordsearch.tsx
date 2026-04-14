import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconButton } from '../../components/ui/IconButton';
import { GameHubCard } from '../../components/vocab-games/GameHubCard';
import { useAppStore } from '../../stores/useAppStore';
import { wordSearchGrids } from '../../data/vocab-games/wordSearchGrids';
import { colors, fonts, spacing } from '../../theme';

export default function WordSearchHub() {
  const router = useRouter();
  const getVocabGameStats = useAppStore((s) => s.getVocabGameStats);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Gitternetz</Text>
          <Text style={styles.subtitle}>Wörter im Buchstabengrid finden</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Finde alle Wörter im Buchstabengrid. Tippe den ersten Buchstaben, dann den letzten. Bei Nomen kommt danach eine Artikel-Frage.
        </Text>
        {wordSearchGrids.map((grid, idx) => {
          const stats = getVocabGameStats(`wordsearch:${grid.id}`);
          const bestScore = stats?.bestScore ?? 0;
          return (
            <Animated.View key={grid.id} entering={FadeInDown.delay(idx * 40).duration(400)}>
              <GameHubCard
                icon="grid-on"
                title={grid.title}
                subtitle={`${grid.subtitle}${bestScore > 0 ? ` · Beste: ${bestScore}%` : ''}`}
                badge={bestScore === 100 ? 'Komplett' : undefined}
                onPress={() => router.push(`/wortschatz/wordsearch/${grid.id}` as any)}
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
  title: { color: colors.text, fontSize: 15, fontFamily: fonts.headlineMedium },
  subtitle: { color: colors.textDim, fontSize: 11, fontFamily: fonts.body, marginTop: 1 },
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
