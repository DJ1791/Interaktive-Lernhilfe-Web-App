import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { GameHubCard } from '../../components/vocab-games/GameHubCard';
import { useTranslation } from '../../hooks/useTranslation';
import vocabularyData from '../../data/vocabulary.json';
import { vocabGames } from '../../data/vocab-games';
import { colors, fonts, spacing, radius } from '../../theme';

type GrammarTab = 'grammatik' | 'wortschatz';
type VocabMode = 'karten' | 'spiele';
type WordType = 'nomen' | 'verben' | 'adjektive';

export default function GrammarScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GrammarTab>('grammatik');
  const [vocabMode, setVocabMode] = useState<VocabMode>('karten');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWordType, setSelectedWordType] = useState<WordType>('nomen');
  const fokusStats = useAppStore((s) => s.getFokusGrammarStats());

  const categories = vocabularyData as any[];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Fokus-Training</Text>
        <Text style={styles.subtitle}>Grammatik & Wortschatz gezielt üben</Text>
      </View>

      <View style={styles.tabRow}>
        {([
          { id: 'grammatik' as GrammarTab, label: 'Grammatik', icon: 'functions' },
          { id: 'wortschatz' as GrammarTab, label: 'Wortschatz', icon: 'menu-book' },
        ]).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.id ? colors.primary : colors.textDim}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'wortschatz' && (
        <View style={styles.subTabRow}>
          {([
            { id: 'karten' as VocabMode, label: 'Karteikarten', icon: 'style' },
            { id: 'spiele' as VocabMode, label: 'Spiele', icon: 'sports-esports' },
          ]).map((st) => (
            <TouchableOpacity
              key={st.id}
              style={[styles.subTab, vocabMode === st.id && styles.subTabActive]}
              onPress={() => setVocabMode(st.id)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={st.icon as any}
                size={14}
                color={vocabMode === st.id ? colors.primary : colors.textDim}
              />
              <Text style={[styles.subTabText, vocabMode === st.id && styles.subTabTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'grammatik' ? (
          <GrammarContent fokusStats={fokusStats} router={router} />
        ) : vocabMode === 'karten' ? (
          <VocabularyContent
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedWordType={selectedWordType}
            onSelectWordType={setSelectedWordType}
          />
        ) : (
          <VocabGamesContent router={router} />
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function GrammarContent({
  fokusStats,
  router,
}: {
  fokusStats: Record<string, { correct: number; attempts: number }>;
  router: ReturnType<typeof useRouter>;
}) {
  const topics = [
    { id: 'akkusativ', label: 'Akkusativ', icon: 'arrow-forward', description: 'den/einen/keinen + maskulin' },
    { id: 'dativ', label: 'Dativ', icon: 'swap-horiz', description: 'dem/einem/keinem + Dativ-Präpositionen' },
    { id: 'praepositionen', label: 'Präpositionen', icon: 'place', description: 'auf, in, an, neben, unter, über, vor, hinter, zwischen' },
    { id: 'adjektivdeklination', label: 'Adjektivdeklination', icon: 'palette', description: 'Adjektivendungen nach bestimmtem/unbestimmtem Artikel' },
    { id: 'satzstellung', label: 'Satzstellung', icon: 'reorder', description: 'Verb an Position 2, Inversion' },
  ];

  return (
    <View style={styles.grammarContent}>
      {topics.map((topic, index) => {
        const stats = fokusStats[topic.id];
        const percent = stats && stats.attempts > 0
          ? Math.round((stats.correct / stats.attempts) * 100)
          : 0;
        const attempted = stats?.attempts || 0;

        return (
          <Animated.View key={topic.id} entering={FadeInDown.delay(index * 60).duration(400)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/grammar/${topic.id}`)}
            >
              <GlassCard style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <View style={styles.topicIconBg}>
                    <MaterialIcons name={topic.icon as any} size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.topicLabel}>{topic.label}</Text>
                    <Text style={styles.topicDesc}>{topic.description}</Text>
                  </View>
                  <MaterialIcons name="play-arrow" size={22} color={colors.primary} />
                </View>
                {attempted > 0 ? (
                  <View style={styles.topicStats}>
                    <ProgressBar percent={percent} height={4} />
                    <Text style={styles.topicStatsText}>
                      {stats!.correct}/{stats!.attempts} richtig ({percent}%)
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.topicNotStarted}>Noch nicht gestartet</Text>
                )}
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

function VocabularyContent({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedWordType,
  onSelectWordType,
}: {
  categories: any[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedWordType: WordType;
  onSelectWordType: (type: WordType) => void;
}) {
  const { tVocab, tCategory, meta } = useTranslation();
  const activeCategory = categories.find((c) => c.id === selectedCategory);

  if (activeCategory) {
    const words = activeCategory[selectedWordType] || [];
    const catTranslation = tCategory(activeCategory.id);
    return (
      <View>
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={18} color={colors.primary} />
          <Text style={styles.backText}>Zurück</Text>
        </TouchableOpacity>

        <Text style={styles.categoryTitle}>
          {activeCategory.icon} {activeCategory.label}
        </Text>
        {catTranslation && meta && (
          <Text
            style={[
              styles.categoryTitleTranslation,
              meta.rtl && { writingDirection: 'rtl', textAlign: 'left' as const },
            ]}
          >
            {meta.flag}  {catTranslation}
          </Text>
        )}

        <View style={styles.wordTypeTabs}>
          {(['nomen', 'verben', 'adjektive'] as WordType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.wordTypeTab, selectedWordType === type && styles.wordTypeTabActive]}
              onPress={() => onSelectWordType(type)}
            >
              <Text style={[styles.wordTypeTabText, selectedWordType === type && styles.wordTypeTabTextActive]}>
                {type === 'nomen' ? 'Nomen' : type === 'verben' ? 'Verben' : 'Adjektive'}
              </Text>
              <Text style={styles.wordTypeCount}>({(activeCategory[type] || []).length})</Text>
            </TouchableOpacity>
          ))}
        </View>

        {words.length === 0 ? (
          <Text style={styles.emptyText}>Keine {selectedWordType} in dieser Kategorie.</Text>
        ) : (
          words.map((word: any, index: number) => {
            const translation = tVocab(word.word);
            return (
              <Animated.View key={word.word || index} entering={FadeInDown.delay(index * 30).duration(300)}>
                <GlassCard style={styles.wordCard}>
                  <View style={styles.wordHeader}>
                    {word.article && (
                      <Text style={styles.wordArticle}>{word.article}</Text>
                    )}
                    <Text style={styles.wordText}>{word.word}</Text>
                  </View>
                  {translation && meta && (
                    <View style={styles.translationRow}>
                      <Text style={styles.translationFlag}>{meta.flag}</Text>
                      <Text
                        style={[
                          styles.translationText,
                          meta.rtl && { writingDirection: 'rtl', textAlign: 'left' as const },
                        ]}
                      >
                        {translation}
                      </Text>
                    </View>
                  )}
                  {word.plural && <Text style={styles.wordMeta}>Plural: {word.plural}</Text>}
                  {word.partizipII && <Text style={styles.wordMeta}>Partizip II: {word.partizipII}</Text>}
                  {word.erSieEs && <Text style={styles.wordMeta}>er/sie/es: {word.erSieEs}</Text>}
                  {word.beispiel && <Text style={styles.wordExample}>{word.beispiel}</Text>}
                </GlassCard>
              </Animated.View>
            );
          })
        )}
      </View>
    );
  }

  return (
    <View>
      {categories.map((cat, index) => {
        const catTranslation = tCategory(cat.id);
        return (
          <Animated.View key={cat.id} entering={FadeInDown.delay(index * 50).duration(400)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelectCategory(cat.id)}
            >
              <GlassCard style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  {catTranslation && meta && (
                    <Text
                      style={[
                        styles.categorySubLabel,
                        meta.rtl && { writingDirection: 'rtl', textAlign: 'left' as const },
                      ]}
                    >
                      {meta.flag}  {catTranslation}
                    </Text>
                  )}
                  <Text style={styles.categoryMeta}>
                    {(cat.nomen || []).length}N · {(cat.verben || []).length}V · {(cat.adjektive || []).length}A
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.textDim} />
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

function VocabGamesContent({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <View style={styles.gamesContent}>
      <Text style={styles.gamesIntro}>
        Wortschatz spielerisch üben. Jedes Spiel hilft dir anders — von Artikel-Drill über Sortieren bis zum freien Schreiben.
      </Text>
      {vocabGames.map((g, index) => (
        <Animated.View
          key={g.type}
          entering={FadeInDown.delay(index * 60).duration(400)}
        >
          <GameHubCard
            emoji={g.emoji}
            title={g.label}
            subtitle={g.subtitle}
            onPress={() => router.push(g.route as any)}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: 'rgba(237,177,255,0.12)' },
  tabText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.headlineMedium,
  },
  tabTextActive: { color: colors.primary },
  subTabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: 8,
    gap: 8,
  },
  subTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.full,
  },
  subTabActive: { backgroundColor: 'rgba(237,177,255,0.15)' },
  subTabText: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headlineMedium,
  },
  subTabTextActive: { color: colors.primary },
  gamesContent: { gap: 4 },
  gamesIntro: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: 10 },
  grammarContent: { gap: 10 },
  topicCard: { padding: 16 },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  topicIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(237,177,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  topicDesc: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 1,
  },
  topicStats: { gap: 4 },
  topicStatsText: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    textAlign: 'right',
  },
  topicNotStarted: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    fontStyle: 'italic',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
  categoryTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.headlineBlack,
    marginBottom: 4,
  },
  categoryTitleTranslation: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    marginBottom: 12,
  },
  categorySubLabel: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,177,255,0.12)',
  },
  translationFlag: { fontSize: 13 },
  translationText: {
    flex: 1,
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
  },
  wordTypeTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  wordTypeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  wordTypeTabActive: { backgroundColor: 'rgba(237,177,255,0.15)' },
  wordTypeTabText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.headlineMedium,
  },
  wordTypeTabTextActive: { color: colors.primary },
  wordTypeCount: { color: colors.textDim, fontSize: 10, fontFamily: fonts.body },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    paddingVertical: 20,
    textAlign: 'center',
  },
  wordCard: { padding: 14, marginBottom: 2 },
  wordHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  wordArticle: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
  },
  wordText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  wordMeta: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 3,
  },
  wordExample: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },
  categoryCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: { fontSize: 24 },
  categoryLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  categoryMeta: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 2,
  },
});
