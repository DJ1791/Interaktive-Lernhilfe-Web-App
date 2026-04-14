import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { GameShell } from '../../../components/vocab-games/GameShell';
import { GameResults } from '../../../components/vocab-games/GameResults';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../../../stores/useAppStore';
import { wordSearchGrids } from '../../../data/vocab-games/wordSearchGrids';
import { WordSearchWord } from '../../../data/vocab-games';
import { colors, fonts, radius, spacing } from '../../../theme';

function normalizeUml(s: string): string {
  return s
    .toUpperCase()
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ß/g, 'SS');
}

interface Cell {
  row: number;
  col: number;
}

function cellsBetween(start: Cell, end: Cell): Cell[] | null {
  if (start.row === end.row) {
    const [c1, c2] = [Math.min(start.col, end.col), Math.max(start.col, end.col)];
    const cells: Cell[] = [];
    for (let c = c1; c <= c2; c++) cells.push({ row: start.row, col: c });
    // Reverse if end.col < start.col so direction matches user's tap order
    if (end.col < start.col) cells.reverse();
    return cells;
  }
  if (start.col === end.col) {
    const [r1, r2] = [Math.min(start.row, end.row), Math.max(start.row, end.row)];
    const cells: Cell[] = [];
    for (let r = r1; r <= r2; r++) cells.push({ row: r, col: start.col });
    if (end.row < start.row) cells.reverse();
    return cells;
  }
  return null; // nicht gerade
}

function extractWord(grid: string[][], cells: Cell[]): string {
  return cells.map((c) => grid[c.row][c.col]).join('');
}

export default function WordSearchGame() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const puzzle = wordSearchGrids.find((g) => g.id === cat);
  const updateVocabGame = useAppStore((s) => s.updateVocabGame);

  const [found, setFound] = useState<Record<string, Cell[]>>({});
  const [firstTap, setFirstTap] = useState<Cell | null>(null);
  const [articleModal, setArticleModal] = useState<null | {
    word: WordSearchWord;
    cells: Cell[];
  }>(null);
  const [articleResults, setArticleResults] = useState<Record<string, boolean>>({});
  const [errorFlash, setErrorFlash] = useState<Cell[]>([]);
  const [finished, setFinished] = useState(false);

  const foundWordIds = Object.keys(found);

  const checkMatch = (cells: Cell[]): WordSearchWord | null => {
    if (!puzzle) return null;
    const attempt = normalizeUml(extractWord(puzzle.grid, cells));
    // Each word's internal form is already normalized, compare directly
    for (const w of puzzle.words) {
      if (foundWordIds.includes(w.word)) continue;
      const canonical = normalizeUml(w.word);
      if (attempt === canonical || attempt === canonical.split('').reverse().join('')) {
        return w;
      }
    }
    return null;
  };

  const handleCellTap = (row: number, col: number) => {
    if (!puzzle || articleModal) return;
    Haptics.selectionAsync();
    if (!firstTap) {
      setFirstTap({ row, col });
      return;
    }
    const cells = cellsBetween(firstTap, { row, col });
    if (!cells || cells.length < 2) {
      setFirstTap({ row, col });
      return;
    }
    const match = checkMatch(cells);
    if (match) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setFound((f) => ({ ...f, [match.word]: cells }));
      if (match.article) {
        setArticleModal({ word: match, cells });
      }
      setFirstTap(null);
      // Finish check
      const nowFound = Object.keys(found).length + 1;
      if (nowFound >= puzzle.words.length) {
        setTimeout(() => handleFinish(), 800);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setErrorFlash(cells);
      setTimeout(() => setErrorFlash([]), 400);
      setFirstTap(null);
    }
  };

  const handleArticleAnswer = (article: string) => {
    if (!articleModal) return;
    const correct = articleModal.word.article?.toLowerCase() === article.toLowerCase();
    Haptics.notificationAsync(
      correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );
    setArticleResults((r) => ({ ...r, [articleModal.word.word]: correct }));
    setArticleModal(null);
  };

  const handleFinish = () => {
    if (!puzzle) return;
    const articleCorrect = Object.values(articleResults).filter(Boolean).length;
    const wordCount = puzzle.words.length;
    // Score = words found + article points (double weight for words)
    const correctTotal = wordCount + articleCorrect;
    const totalPossible = wordCount + puzzle.words.filter((w) => w.article).length;
    updateVocabGame(`wordsearch:${puzzle.id}`, correctTotal, totalPossible);
    setFinished(true);
  };

  const handleRetry = () => {
    setFound({});
    setFirstTap(null);
    setArticleModal(null);
    setArticleResults({});
    setErrorFlash([]);
    setFinished(false);
  };

  if (!puzzle) {
    return (
      <GameShell title="Gitternetz">
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Nicht gefunden.</Text>
        </View>
      </GameShell>
    );
  }

  if (finished) {
    const wordCount = puzzle.words.length;
    const articleCorrect = Object.values(articleResults).filter(Boolean).length;
    const articleTotal = puzzle.words.filter((w) => w.article).length;
    return (
      <GameShell title="Gitternetz" subtitle={puzzle.title}>
        <GameResults
          title={puzzle.title}
          correct={wordCount + articleCorrect}
          total={wordCount + articleTotal}
          onRetry={handleRetry}
          extraLine={`${wordCount}/${wordCount} Wörter gefunden · ${articleCorrect}/${articleTotal} Artikel richtig`}
        />
      </GameShell>
    );
  }

  const isInFound = (row: number, col: number): boolean => {
    for (const cells of Object.values(found)) {
      if (cells.some((c) => c.row === row && c.col === col)) return true;
    }
    return false;
  };
  const isFirstTap = (row: number, col: number): boolean =>
    !!firstTap && firstTap.row === row && firstTap.col === col;
  const isErrorFlash = (row: number, col: number): boolean =>
    errorFlash.some((c) => c.row === row && c.col === col);

  return (
    <GameShell
      title="Gitternetz"
      subtitle={puzzle.title}
      progressPercent={(foundWordIds.length / puzzle.words.length) * 100}
      progressLabel={`${foundWordIds.length} / ${puzzle.words.length}`}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {firstTap ? (
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>
              Jetzt auf den <Text style={{ fontFamily: fonts.bodyBold }}>letzten Buchstaben</Text> des Wortes tippen
            </Text>
          </View>
        ) : (
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>
              Tippe den <Text style={{ fontFamily: fonts.bodyBold }}>ersten Buchstaben</Text> eines Wortes · nur waagerecht & senkrecht
            </Text>
          </View>
        )}
        <View style={styles.grid}>
          {puzzle.grid.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((letter, c) => {
                const foundCell = isInFound(r, c);
                const isFirst = isFirstTap(r, c);
                const isError = isErrorFlash(r, c);
                return (
                  <TouchableOpacity
                    key={c}
                    activeOpacity={0.7}
                    onPress={() => handleCellTap(r, c)}
                    style={[
                      styles.cell,
                      foundCell && styles.cellFound,
                      isFirst && styles.cellFirstTap,
                      isError && styles.cellError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        foundCell && styles.cellTextFound,
                      ]}
                    >
                      {letter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.wordList}>
          <Text style={styles.wordListLabel}>Zu finden:</Text>
          <View style={styles.wordListGrid}>
            {puzzle.words.map((w) => {
              const isFound = !!found[w.word];
              return (
                <View
                  key={w.word}
                  style={[styles.wordItem, isFound && styles.wordItemFound]}
                >
                  {isFound && <MaterialIcons name="check" size={12} color={colors.success} />}
                  <Text
                    style={[
                      styles.wordItemText,
                      isFound && styles.wordItemTextFound,
                    ]}
                  >
                    {w.word}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!articleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setArticleModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.modalCard}>
            <Text style={styles.modalLabel}>Richtig gefunden!</Text>
            <Text style={styles.modalWord}>{articleModal?.word.word}</Text>
            <Text style={styles.modalQuestion}>Welcher Artikel?</Text>
            <View style={styles.articleGrid}>
              {['der', 'die', 'das'].map((a) => (
                <TouchableOpacity
                  key={a}
                  style={styles.articleBtn}
                  onPress={() => handleArticleAnswer(a)}
                >
                  <Text style={styles.articleBtnText}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {
                setArticleResults((r) => ({ ...r, [articleModal!.word.word]: false }));
                setArticleModal(null);
              }}
              style={styles.skipArticleBtn}
            >
              <Text style={styles.skipArticleText}>Weiß ich nicht</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </GameShell>
  );
}

const CELL_SIZE = 32;

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, alignItems: 'center' },
  grid: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 6,
    borderRadius: radius.md,
  },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cellText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.bodyBold,
  },
  cellFound: {
    backgroundColor: 'rgba(74,222,128,0.25)',
  },
  cellTextFound: { color: colors.success },
  cellFirstTap: {
    backgroundColor: 'rgba(237,177,255,0.35)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cellError: {
    backgroundColor: 'rgba(255,180,171,0.3)',
  },
  wordList: {
    width: '100%',
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.md,
  },
  wordListLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headline,
    marginBottom: 8,
  },
  wordListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.full,
  },
  wordItemFound: {
    backgroundColor: 'rgba(74,222,128,0.12)',
  },
  wordItemText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  wordItemTextFound: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 280,
  },
  modalLabel: {
    color: colors.success,
    fontSize: 11,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  modalWord: {
    color: colors.text,
    fontSize: 28,
    fontFamily: fonts.headlineBlack,
    marginBottom: 16,
  },
  modalQuestion: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
    marginBottom: 16,
  },
  articleGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  articleBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(237,177,255,0.12)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(237,177,255,0.3)',
    alignItems: 'center',
  },
  articleBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.headlineMedium,
  },
  tapHint: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(237,177,255,0.06)',
    borderRadius: radius.md,
    marginBottom: 8,
  },
  tapHintText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 17,
  },
  skipArticleBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipArticleText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
  },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, fontFamily: fonts.body },
});
