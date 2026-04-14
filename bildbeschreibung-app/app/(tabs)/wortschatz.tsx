import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../../components/ui/GlassCard';
import { GameHubCard } from '../../components/vocab-games/GameHubCard';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import vocabularyData from '../../data/vocabulary.json';
import { vocabGames } from '../../data/vocab-games';
import { colors, fonts, radius, spacing } from '../../theme';

type WordType = 'nomen' | 'verben' | 'adjektive';
type VocabMode = 'karten' | 'spiele' | 'suche';

interface Category {
  id: string;
  label: string;
  labelEN: string;
  icon: string;
  nomen: any[];
  verben: any[];
  adjektive: any[];
}

export default function WortschatzScreen() {
  const router = useRouter();
  const categories = vocabularyData as Category[];
  const { tVocab, tCategory, meta } = useTranslation();
  const favoriteWords = useAppStore((s) => s.favoriteWords);
  const toggleFavoriteWord = useAppStore((s) => s.toggleFavoriteWord);

  const [mode, setMode] = useState<VocabMode>('karten');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWordType, setSelectedWordType] = useState<WordType>('nomen');
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || mode !== 'suche') return [];
    const q = searchQuery.toLowerCase().trim();
    const results: Array<{ word: any; category: Category; type: WordType }> = [];
    for (const cat of categories) {
      for (const type of ['nomen', 'verben', 'adjektive'] as WordType[]) {
        for (const w of (cat[type] || [])) {
          if (
            w.word?.toLowerCase().includes(q) ||
            (w.article && `${w.article} ${w.word}`.toLowerCase().includes(q))
          ) {
            results.push({ word: w, category: cat, type });
          }
        }
      }
    }
    return results.slice(0, 50);
  }, [searchQuery, mode, categories]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Wortschatz</Text>
        <Text style={styles.subtitle}>Vokabeln lernen, üben & spielen</Text>
      </View>

      {/* Mode toggle */}
      {!activeCategory && (
        <View style={styles.modeRow}>
          {(
            [
              { id: 'karten' as VocabMode, label: 'Karteikarten', icon: 'style' },
              { id: 'spiele' as VocabMode, label: 'Spiele', icon: 'sports-esports' },
              { id: 'suche' as VocabMode, label: 'Suche', icon: 'search' },
            ]
          ).map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeTab, mode === m.id && styles.modeTabActive]}
              onPress={() => setMode(m.id)}
              activeOpacity={0.7}
              accessibilityLabel={`Modus: ${m.label}`}
            >
              <MaterialIcons
                name={m.icon as any}
                size={14}
                color={mode === m.id ? colors.primary : colors.textDim}
              />
              <Text
                style={[styles.modeTabText, mode === m.id && styles.modeTabTextActive]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeCategory ? (
          <CategoryDetailView
            category={activeCategory}
            selectedWordType={selectedWordType}
            onSelectWordType={setSelectedWordType}
            onBack={() => setSelectedCategory(null)}
            tVocab={tVocab}
            tCategory={tCategory}
            meta={meta}
            favoriteWords={favoriteWords}
            toggleFavoriteWord={toggleFavoriteWord}
          />
        ) : mode === 'karten' ? (
          <CategoriesList
            categories={categories}
            onSelectCategory={setSelectedCategory}
            tCategory={tCategory}
            meta={meta}
          />
        ) : mode === 'spiele' ? (
          <GamesList router={router} />
        ) : (
          <SearchView
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            tVocab={tVocab}
            meta={meta}
          />
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ----- Sub-Views -----

function CategoriesList({
  categories,
  onSelectCategory,
  tCategory,
  meta,
}: {
  categories: Category[];
  onSelectCategory: (id: string) => void;
  tCategory: (id: string) => string | null;
  meta: ReturnType<typeof useTranslation>['meta'];
}) {
  return (
    <View>
      {categories.map((cat, index) => {
        const catTranslation = tCategory(cat.id);
        return (
          <Animated.View key={cat.id} entering={FadeInDown.delay(index * 35).duration(350)}>
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

function GamesList({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <View>
      <Text style={styles.gamesIntro}>
        Wortschatz spielerisch üben. Jedes Spiel hilft dir anders — von Artikel-Drill über
        Sortieren bis zum freien Schreiben.
      </Text>
      {vocabGames.map((g, index) => (
        <Animated.View
          key={g.type}
          entering={FadeInDown.delay(index * 50).duration(400)}
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

function SearchView({
  query,
  onQueryChange,
  results,
  tVocab,
  meta,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  results: Array<{ word: any; category: Category; type: WordType }>;
  tVocab: (w: string) => string | null;
  meta: ReturnType<typeof useTranslation>['meta'];
}) {
  return (
    <View>
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={18} color={colors.textDim} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Wort suchen..."
          placeholderTextColor={colors.textDim}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => onQueryChange('')}
            accessibilityLabel="Suche leeren"
          >
            <MaterialIcons name="close" size={18} color={colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {query.trim().length > 0 ? (
        results.length === 0 ? (
          <Text style={styles.searchEmpty}>Keine Treffer für „{query}"</Text>
        ) : (
          <>
            <Text style={styles.searchCount}>
              {results.length} {results.length === 1 ? 'Treffer' : 'Treffer'}
            </Text>
            {results.map((r, i) => {
              const translation = tVocab(r.word.word);
              return (
                <Animated.View
                  key={`${r.category.id}-${r.type}-${r.word.word}-${i}`}
                  entering={FadeInDown.delay(i * 15).duration(300)}
                >
                  <GlassCard style={styles.searchCard}>
                    <View style={styles.wordHeader}>
                      {r.word.article && (
                        <Text style={styles.wordArticle}>{r.word.article}</Text>
                      )}
                      <Text style={styles.wordText}>{r.word.word}</Text>
                    </View>
                    <Text style={styles.searchCategoryTag}>
                      {r.category.icon}  {r.category.label} · {r.type}
                    </Text>
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
                    {r.word.beispiel && (
                      <Text style={styles.searchExample}>{r.word.beispiel}</Text>
                    )}
                  </GlassCard>
                </Animated.View>
              );
            })}
          </>
        )
      ) : (
        <Text style={styles.searchHint}>
          Suche nach deutschen Wörtern in allen 12 Kategorien. Beispiel: „Hund", „kochen", „schön"…
        </Text>
      )}
    </View>
  );
}

function CategoryDetailView({
  category,
  selectedWordType,
  onSelectWordType,
  onBack,
  tVocab,
  tCategory,
  meta,
  favoriteWords,
  toggleFavoriteWord,
}: {
  category: Category;
  selectedWordType: WordType;
  onSelectWordType: (t: WordType) => void;
  onBack: () => void;
  tVocab: (w: string) => string | null;
  tCategory: (id: string) => string | null;
  meta: ReturnType<typeof useTranslation>['meta'];
  favoriteWords: string[];
  toggleFavoriteWord: (w: string) => void;
}) {
  const words = category[selectedWordType] || [];
  const catTranslation = tCategory(category.id);
  return (
    <View>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        activeOpacity={0.7}
        accessibilityLabel="Zurück zur Kategorie-Übersicht"
      >
        <MaterialIcons name="arrow-back" size={18} color={colors.primary} />
        <Text style={styles.backText}>Zurück</Text>
      </TouchableOpacity>

      <Text style={styles.categoryTitle}>
        {category.icon} {category.label}
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
            <Text
              style={[
                styles.wordTypeTabText,
                selectedWordType === type && styles.wordTypeTabTextActive,
              ]}
            >
              {type === 'nomen' ? 'Nomen' : type === 'verben' ? 'Verben' : 'Adjektive'}
            </Text>
            <Text style={styles.wordTypeCount}>({(category[type] || []).length})</Text>
          </TouchableOpacity>
        ))}
      </View>

      {words.length === 0 ? (
        <Text style={styles.emptyText}>Keine {selectedWordType} in dieser Kategorie.</Text>
      ) : (
        words.map((word: any, index: number) => {
          const translation = tVocab(word.word);
          const isFavorite = favoriteWords.includes(word.word);
          return (
            <Animated.View
              key={word.word || index}
              entering={FadeInDown.delay(index * 20).duration(300)}
            >
              <GlassCard style={styles.wordCard}>
                <View style={styles.wordHeader}>
                  {word.article && <Text style={styles.wordArticle}>{word.article}</Text>}
                  <Text style={styles.wordText}>{word.word}</Text>
                  <TouchableOpacity
                    onPress={() => toggleFavoriteWord(word.word)}
                    style={styles.favoriteButton}
                    accessibilityLabel={isFavorite ? 'Favorit entfernen' : 'Als schwer markieren'}
                  >
                    <MaterialIcons
                      name={isFavorite ? 'star' : 'star-border'}
                      size={20}
                      color={isFavorite ? colors.tertiary : colors.textDim}
                    />
                  </TouchableOpacity>
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
                {word.partizipII && (
                  <Text style={styles.wordMeta}>Partizip II: {word.partizipII}</Text>
                )}
                {word.erSieEs && <Text style={styles.wordMeta}>er/sie/es: {word.erSieEs}</Text>}
                {word.komparativ && word.komparativ !== '–' && (
                  <Text style={styles.wordMeta}>Komparativ: {word.komparativ}</Text>
                )}
                {word.superlativ && word.superlativ !== '–' && (
                  <Text style={styles.wordMeta}>Superlativ: {word.superlativ}</Text>
                )}
                {word.beispiel && <Text style={styles.wordExample}>{word.beispiel}</Text>}
              </GlassCard>
            </Animated.View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
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
  modeRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: 12,
    gap: 8,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.full,
  },
  modeTabActive: { backgroundColor: 'rgba(237,177,255,0.15)' },
  modeTabText: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headlineMedium,
  },
  modeTabTextActive: { color: colors.primary },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: 10 },
  // Categories
  categoryCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  categoryIcon: { fontSize: 26 },
  categoryLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  categorySubLabel: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
  },
  categoryMeta: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  // Games
  gamesIntro: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.body,
    padding: 0,
  },
  searchHint: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    padding: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  searchEmpty: {
    color: colors.textDim,
    fontSize: 13,
    fontFamily: fonts.body,
    padding: 20,
    textAlign: 'center',
  },
  searchCount: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  searchCard: { padding: 14, marginBottom: 8 },
  searchCategoryTag: {
    color: colors.tertiary,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    marginTop: 4,
  },
  searchExample: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 16,
  },
  // Category detail
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
    fontSize: 20,
    fontFamily: fonts.headlineBlack,
    marginBottom: 4,
  },
  categoryTitleTranslation: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    marginBottom: 12,
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
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
  },
  wordText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.headlineMedium,
    flex: 1,
  },
  favoriteButton: { padding: 4 },
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
});
