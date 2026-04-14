import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { IconButton } from '../../components/ui/IconButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAppStore } from '../../stores/useAppStore';
import { clozeExercises } from '../../data/vocab-games/clozeTexts';
import { getImage } from '../../data/images';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ClozeHub() {
  const router = useRouter();
  const getVocabGameStats = useAppStore((s) => s.getVocabGameStats);

  // Group by image
  const groups = clozeExercises.reduce<Record<string, typeof clozeExercises>>((acc, ex) => {
    if (!acc[ex.img]) acc[ex.img] = [];
    acc[ex.img].push(ex);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Lückentext</Text>
          <Text style={styles.subtitle}>Bildbeschreibungen vervollständigen</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Wähle eine Szene und einen Schwierigkeitsgrad. Level 1: Wörter auswählen. Level 2: Form anpassen. Level 3: frei eintippen.
        </Text>

        {Object.entries(groups).map(([img, exercises], idx) => (
          <Animated.View
            key={img}
            entering={FadeInDown.delay(idx * 60).duration(400)}
            style={styles.sceneBlock}
          >
            <GlassCard style={styles.sceneCard}>
              <Image source={getImage(img)} style={styles.sceneImage} resizeMode="cover" />
              <View style={styles.sceneInfo}>
                <Text style={styles.sceneTitle}>{exercises[0].title.split(' · ')[0]}</Text>
                <View style={styles.levelRow}>
                  {[1, 2, 3].map((level) => {
                    const ex = exercises.find((e) => e.level === level);
                    if (!ex) return null;
                    const stats = getVocabGameStats(`cloze:${ex.id}`);
                    const best = stats?.bestScore ?? 0;
                    return (
                      <TouchableOpacity
                        key={level}
                        activeOpacity={0.85}
                        onPress={() => router.push(`/wortschatz/cloze/${ex.id}` as any)}
                        style={[styles.levelBtn, best > 0 && styles.levelBtnDone]}
                      >
                        <Text style={styles.levelBtnLabel}>Level {level}</Text>
                        {best > 0 && <Text style={styles.levelBtnScore}>{best}%</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
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
  sceneBlock: { marginBottom: 12 },
  sceneCard: { padding: 0, overflow: 'hidden' },
  sceneImage: {
    width: '100%',
    height: 140,
  },
  sceneInfo: { padding: 14 },
  sceneTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
    marginBottom: 10,
  },
  levelRow: { flexDirection: 'row', gap: 8 },
  levelBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  levelBtnDone: {
    backgroundColor: 'rgba(237,177,255,0.1)',
    borderColor: 'rgba(237,177,255,0.3)',
  },
  levelBtnLabel: {
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.headlineMedium,
  },
  levelBtnScore: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 2,
  },
});
