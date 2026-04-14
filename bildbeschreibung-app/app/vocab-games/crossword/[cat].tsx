import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { GameShell } from '../../../components/vocab-games/GameShell';
import { GameResults } from '../../../components/vocab-games/GameResults';
import { GradientButton } from '../../../components/ui/GradientButton';
import { useAppStore } from '../../../stores/useAppStore';
import { crosswords } from '../../../data/vocab-games/crosswords';
import { CrosswordClue } from '../../../data/vocab-games';
import { colors, fonts, radius, spacing } from '../../../theme';

function normalizeLetter(s: string): string {
  return s
    .toUpperCase()
    .replace(/Ä/g, 'AE')
    .replace(/Ö/g, 'OE')
    .replace(/Ü/g, 'UE')
    .replace(/ß/g, 'SS')
    .slice(0, 1);
}

const screenWidth = Dimensions.get('window').width;

export default function CrosswordGame() {
  const { cat } = useLocalSearchParams<{ cat: string }>();
  const puzzle = crosswords.find((c) => c.id === cat);
  const updateVocabGame = useAppStore((s) => s.updateVocabGame);

  const [userGrid, setUserGrid] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<{
    row: number;
    col: number;
    direction: 'across' | 'down';
  } | null>(null);
  const hiddenInputRef = useRef<TextInput>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!puzzle) {
    return (
      <GameShell title="Kreuzworträtsel">
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyText}>Nicht gefunden.</Text>
        </View>
      </GameShell>
    );
  }

  const key = (r: number, c: number) => `${r},${c}`;

  // Find which clue covers a cell in a given direction
  const findClueForCell = useCallback(
    (row: number, col: number, direction: 'across' | 'down'): CrosswordClue | null => {
      for (const clue of puzzle.clues) {
        if (clue.direction !== direction) continue;
        const L = clue.answer.length;
        if (direction === 'across' && clue.startRow === row) {
          if (col >= clue.startCol && col < clue.startCol + L) return clue;
        }
        if (direction === 'down' && clue.startCol === col) {
          if (row >= clue.startRow && row < clue.startRow + L) return clue;
        }
      }
      return null;
    },
    [puzzle]
  );

  const activeClue = useMemo<CrosswordClue | null>(() => {
    if (!focus) return null;
    return findClueForCell(focus.row, focus.col, focus.direction);
  }, [focus, findClueForCell]);

  const handleCellTap = (row: number, col: number) => {
    if (submitted) return;
    if (puzzle.grid[row][col] === null) return;

    // If same cell → toggle direction; otherwise set new focus
    let newDir: 'across' | 'down' = 'across';
    if (focus && focus.row === row && focus.col === col) {
      newDir = focus.direction === 'across' ? 'down' : 'across';
    } else {
      // Pick direction where a clue exists for this cell
      const acrossClue = findClueForCell(row, col, 'across');
      const downClue = findClueForCell(row, col, 'down');
      if (acrossClue && !downClue) newDir = 'across';
      else if (!acrossClue && downClue) newDir = 'down';
      else newDir = focus?.direction ?? 'across';
    }
    setFocus({ row, col, direction: newDir });
    hiddenInputRef.current?.focus();
  };

  // Tap a clue → jump to its first cell
  const handleClueTap = (clue: CrosswordClue) => {
    if (submitted) return;
    setFocus({ row: clue.startRow, col: clue.startCol, direction: clue.direction });
    hiddenInputRef.current?.focus();
  };

  const handleInputChange = (text: string) => {
    if (!focus || submitted || !activeClue) return;
    if (text.length === 0) {
      // Backspace
      const curKey = key(focus.row, focus.col);
      if (userGrid[curKey]) {
        // Delete current cell
        setUserGrid((g) => {
          const next = { ...g };
          delete next[curKey];
          return next;
        });
      } else {
        // Move back and delete
        moveToPrev();
      }
      return;
    }
    const letter = normalizeLetter(text);
    if (!letter) return;
    Haptics.selectionAsync();
    setUserGrid((g) => ({ ...g, [key(focus.row, focus.col)]: letter }));
    // Auto-advance to next cell in the current word
    moveToNext();
  };

  const moveToNext = () => {
    if (!focus || !activeClue) return;
    const L = activeClue.answer.length;
    const offset =
      activeClue.direction === 'across'
        ? focus.col - activeClue.startCol + 1
        : focus.row - activeClue.startRow + 1;
    if (offset >= L) return; // end of word reached
    const next =
      activeClue.direction === 'across'
        ? { row: focus.row, col: focus.col + 1 }
        : { row: focus.row + 1, col: focus.col };
    setFocus({ ...next, direction: activeClue.direction });
  };

  const moveToPrev = () => {
    if (!focus || !activeClue) return;
    const prev =
      activeClue.direction === 'across'
        ? { row: focus.row, col: focus.col - 1 }
        : { row: focus.row - 1, col: focus.col };
    if (
      (activeClue.direction === 'across' && prev.col < activeClue.startCol) ||
      (activeClue.direction === 'down' && prev.row < activeClue.startRow)
    )
      return;
    setFocus({ ...prev, direction: activeClue.direction });
    // Delete the cell we moved to
    setUserGrid((g) => {
      const next = { ...g };
      delete next[key(prev.row, prev.col)];
      return next;
    });
  };

  // Check if a clue is fully and correctly filled
  const isClueCorrect = (clue: CrosswordClue): boolean => {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
      const c = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
      if (userGrid[key(r, c)] !== clue.answer[i]) return false;
    }
    return true;
  };

  const isClueFullyFilled = (clue: CrosswordClue): boolean => {
    for (let i = 0; i < clue.answer.length; i++) {
      const r = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
      const c = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
      if (!userGrid[key(r, c)]) return false;
    }
    return true;
  };

  const evaluate = () => {
    return puzzle.clues.filter((c) => isClueCorrect(c)).length;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    setSubmitted(true);
    const correct = evaluate();
    Haptics.notificationAsync(
      correct === puzzle.clues.length
        ? Haptics.NotificationFeedbackType.Success
        : correct > puzzle.clues.length / 2
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Error
    );
  };

  const handleShowResults = () => {
    const correct = evaluate();
    updateVocabGame(`crossword:${puzzle.id}`, correct, puzzle.clues.length);
    setFinished(true);
  };

  const handleRetry = () => {
    setUserGrid({});
    setFocus(null);
    setSubmitted(false);
    setFinished(false);
  };

  if (finished) {
    const correct = evaluate();
    return (
      <GameShell title="Kreuzworträtsel" subtitle={puzzle.title}>
        <GameResults
          title={puzzle.title}
          correct={correct}
          total={puzzle.clues.length}
          onRetry={handleRetry}
        />
      </GameShell>
    );
  }

  const across = puzzle.clues.filter((c) => c.direction === 'across');
  const down = puzzle.clues.filter((c) => c.direction === 'down');

  // Focused cells
  const focusedCells = new Set<string>();
  if (activeClue) {
    for (let i = 0; i < activeClue.answer.length; i++) {
      const r = activeClue.direction === 'across' ? activeClue.startRow : activeClue.startRow + i;
      const c = activeClue.direction === 'across' ? activeClue.startCol + i : activeClue.startCol;
      focusedCells.add(key(r, c));
    }
  }

  // Responsive cell size: use available screen width minus padding
  const availableWidth = screenWidth - spacing.md * 2 - 4;
  const cellSize = Math.max(28, Math.min(40, Math.floor(availableWidth / puzzle.width)));

  return (
    <GameShell title="Kreuzworträtsel" subtitle={puzzle.title}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Direction indicator */}
          {focus && activeClue && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.directionIndicator}>
              <MaterialIcons
                name={activeClue.direction === 'across' ? 'arrow-forward' : 'arrow-downward'}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.directionText}>
                {activeClue.direction === 'across' ? 'Waagerecht' : 'Senkrecht'}
                {' · '}
                {activeClue.number}. {activeClue.clue}
              </Text>
            </Animated.View>
          )}

          {/* Grid */}
          <View style={styles.gridWrap}>
            <View style={[styles.grid, { width: cellSize * puzzle.width + puzzle.width * 2 }]}>
              {puzzle.grid.map((row, r) => (
                <View key={r} style={{ flexDirection: 'row' }}>
                  {row.map((cell, c) => {
                    if (cell === null) {
                      return (
                        <View
                          key={c}
                          style={[styles.cell, styles.cellBlack, { width: cellSize, height: cellSize }]}
                        />
                      );
                    }
                    const cellKey = key(r, c);
                    const userLetter = userGrid[cellKey] ?? '';
                    const isFocused = focus?.row === r && focus?.col === c;
                    const isInFocusedWord = focusedCells.has(cellKey);
                    const isCorrect = submitted && userLetter === cell.letter;
                    const isWrong = submitted && userLetter !== '' && userLetter !== cell.letter;
                    return (
                      <TouchableOpacity
                        key={c}
                        activeOpacity={0.7}
                        onPress={() => handleCellTap(r, c)}
                        style={[
                          styles.cell,
                          { width: cellSize, height: cellSize },
                          styles.cellOpen,
                          isInFocusedWord && styles.cellInFocusedWord,
                          isFocused && styles.cellFocused,
                          isCorrect && styles.cellCorrect,
                          isWrong && styles.cellWrong,
                        ]}
                      >
                        {cell.number !== undefined && (
                          <Text style={styles.cellNumber}>{cell.number}</Text>
                        )}
                        <Text
                          style={[
                            styles.cellLetter,
                            { fontSize: cellSize * 0.42 },
                            isCorrect && styles.cellLetterCorrect,
                            isWrong && styles.cellLetterWrong,
                          ]}
                        >
                          {submitted && isWrong ? cell.letter : userLetter}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* Hidden input for keyboard */}
          <TextInput
            ref={hiddenInputRef}
            value=""
            onChangeText={handleInputChange}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={1}
            style={styles.hiddenInput}
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Clues — now tappable */}
          <View style={styles.cluesSection}>
            <Text style={styles.cluesHeader}>Waagerecht</Text>
            {across.map((clue) => {
              const filled = isClueFullyFilled(clue);
              const correct = submitted && isClueCorrect(clue);
              const isActive = activeClue?.number === clue.number && activeClue?.direction === 'across';
              return (
                <TouchableOpacity
                  key={`a-${clue.number}`}
                  onPress={() => handleClueTap(clue)}
                  activeOpacity={0.7}
                  style={[styles.clueRow, isActive && styles.clueRowActive]}
                >
                  <Text style={[
                    styles.clueNum,
                    filled && !submitted && styles.clueNumFilled,
                    correct && styles.clueNumCorrect,
                  ]}>
                    {clue.number}.
                  </Text>
                  <Text style={[
                    styles.clueText,
                    filled && !submitted && styles.clueTextFilled,
                    correct && styles.clueTextCorrect,
                  ]}>
                    {clue.clue}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <Text style={[styles.cluesHeader, { marginTop: 14 }]}>Senkrecht</Text>
            {down.map((clue) => {
              const filled = isClueFullyFilled(clue);
              const correct = submitted && isClueCorrect(clue);
              const isActive = activeClue?.number === clue.number && activeClue?.direction === 'down';
              return (
                <TouchableOpacity
                  key={`d-${clue.number}`}
                  onPress={() => handleClueTap(clue)}
                  activeOpacity={0.7}
                  style={[styles.clueRow, isActive && styles.clueRowActive]}
                >
                  <Text style={[
                    styles.clueNum,
                    filled && !submitted && styles.clueNumFilled,
                    correct && styles.clueNumCorrect,
                  ]}>
                    {clue.number}.
                  </Text>
                  <Text style={[
                    styles.clueText,
                    filled && !submitted && styles.clueTextFilled,
                    correct && styles.clueTextCorrect,
                  ]}>
                    {clue.clue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!submitted && (
            <GradientButton
              title="Prüfen"
              onPress={handleSubmit}
              size="lg"
              style={{ marginTop: 20 }}
            />
          )}

          {submitted && (
            <GradientButton
              title="Weiter zu den Ergebnissen"
              onPress={handleShowResults}
              size="lg"
              style={{ marginTop: 20 }}
            />
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GameShell>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, alignItems: 'center' },
  directionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(237,177,255,0.08)',
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  directionText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 18,
  },
  gridWrap: {
    marginVertical: 8,
    alignItems: 'center',
  },
  grid: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 2,
    borderRadius: 4,
  },
  cell: {
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBlack: {
    backgroundColor: 'transparent',
  },
  cellOpen: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cellInFocusedWord: {
    backgroundColor: 'rgba(237,177,255,0.08)',
  },
  cellFocused: {
    backgroundColor: 'rgba(237,177,255,0.28)',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cellCorrect: {
    backgroundColor: 'rgba(74,222,128,0.15)',
    borderColor: colors.success,
  },
  cellWrong: {
    backgroundColor: 'rgba(255,180,171,0.15)',
    borderColor: colors.error,
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    color: colors.textDim,
    fontSize: 8,
    fontFamily: fonts.body,
  },
  cellLetter: {
    color: colors.text,
    fontFamily: fonts.bodyBold,
  },
  cellLetterCorrect: { color: colors.success },
  cellLetterWrong: { color: colors.error },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  cluesSection: {
    width: '100%',
    marginTop: 20,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.md,
  },
  cluesHeader: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  clueRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    marginBottom: 2,
    minHeight: 40,
    alignItems: 'flex-start',
  },
  clueRowActive: {
    backgroundColor: 'rgba(237,177,255,0.1)',
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  clueNum: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    minWidth: 22,
  },
  clueNumFilled: { color: colors.textMuted },
  clueNumCorrect: { color: colors.success },
  clueText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
    lineHeight: 19,
  },
  clueTextFilled: { color: colors.textDim },
  clueTextCorrect: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  emptyCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, fontFamily: fonts.body },
});
