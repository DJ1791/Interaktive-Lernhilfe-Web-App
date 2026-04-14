import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { phases } from '../../data/phases';
import { colors, fonts, spacing } from '../../theme';

export default function ProgressScreen() {
  const progress = useAppStore((s) => s.progress);
  const getPhasePercent = useAppStore((s) => s.getPhasePercent);
  const getOverallPercent = useAppStore((s) => s.getOverallPercent);

  const overallPercent = getOverallPercent();
  const totalExercises = Object.values(progress.phases).reduce((sum, phase) => {
    return sum + phase.level1.total + phase.level2.total + phase.level3.total;
  }, 0);
  const totalCorrect = Object.values(progress.phases).reduce((sum, phase) => {
    return sum + phase.level1.correct + phase.level2.correct + phase.level3.correct;
  }, 0);
  const vocabCount = Object.keys(progress.vocab.words).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Fortschritt</Text>
        <Text style={styles.subtitle}>Deine Lernstatistiken im Überblick</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <GlassCard style={styles.overallCard}>
            <Text style={styles.overallLabel}>Gesamtfortschritt</Text>
            <Text style={styles.overallPercent}>{overallPercent}%</Text>
            <ProgressBar percent={overallPercent} height={12} />
            <View style={styles.overallStats}>
              <StatItem icon="check-circle" value={totalCorrect} label="Richtig" color={colors.success} />
              <StatItem icon="edit" value={totalExercises} label="Versuche" color={colors.primary} />
              <StatItem icon="star" value={progress.xp} label="XP" color={colors.tertiary} />
              <StatItem icon="local-fire-department" value={progress.streak} label="Streak" color={colors.secondary} />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <GlassCard style={styles.levelCard}>
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>{progress.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelLabel}>Level {progress.level}</Text>
                <Text style={styles.levelXP}>{progress.xp} / {progress.level * 100} XP</Text>
                <ProgressBar percent={(progress.xp % 100)} height={6} />
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Text style={styles.sectionTitle}>Phasen</Text>
        {phases.map((phase, index) => {
          const percent = getPhasePercent(phase.id);
          const phaseData = progress.phases[phase.id];
          const phaseTotal = phaseData
            ? phaseData.level1.total + phaseData.level2.total + phaseData.level3.total
            : 0;
          const phaseCorrect = phaseData
            ? phaseData.level1.correct + phaseData.level2.correct + phaseData.level3.correct
            : 0;

          return (
            <Animated.View key={phase.id} entering={FadeInDown.delay(300 + index * 60).duration(400)}>
              <GlassCard style={styles.phaseCard}>
                <View style={styles.phaseHeader}>
                  <View style={[styles.phaseIcon, { backgroundColor: phase.color + '20' }]}>
                    <Text style={[styles.phaseNumber, { color: phase.color }]}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.phaseName}>{phase.label}</Text>
                    <Text style={styles.phaseStats}>
                      {phaseCorrect}/{phaseTotal} richtig
                    </Text>
                  </View>
                  <Text style={[styles.phasePercent, { color: phase.color }]}>{percent}%</Text>
                </View>
                <ProgressBar percent={percent} height={4} />

                {phaseData && (
                  <View style={styles.levelBreakdown}>
                    {[1, 2, 3].map((level) => {
                      const lKey = `level${level}` as 'level1' | 'level2' | 'level3';
                      const ld = phaseData[lKey];
                      const lPercent = ld.total > 0 ? Math.round((ld.correct / ld.total) * 100) : 0;
                      return (
                        <View key={level} style={styles.levelItem}>
                          <Text style={styles.levelItemLabel}>L{level}</Text>
                          <View style={{ flex: 1 }}>
                            <ProgressBar percent={lPercent} height={3} />
                          </View>
                          <Text style={styles.levelItemPercent}>{lPercent}%</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </GlassCard>
            </Animated.View>
          );
        })}

        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <GlassCard style={styles.vocabCard}>
            <MaterialIcons name="menu-book" size={20} color={colors.tertiary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vocabLabel}>Vokabeln geübt</Text>
              <Text style={styles.vocabCount}>{vocabCount} Wörter</Text>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <MaterialIcons name={icon as any} size={16} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: 10 },
  overallCard: { padding: 20, alignItems: 'center' },
  overallLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  overallPercent: {
    color: colors.text,
    fontSize: 48,
    fontFamily: fonts.headlineBlack,
    marginVertical: 8,
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 16, fontFamily: fonts.headlineBlack },
  statLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelCard: { padding: 16 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(237,177,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    color: colors.primary,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
  },
  levelLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  levelXP: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginVertical: 4,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  phaseCard: { padding: 14, gap: 10 },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phaseIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseNumber: { fontSize: 14, fontFamily: fonts.headlineBlack },
  phaseName: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  phaseStats: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 1,
  },
  phasePercent: { fontSize: 16, fontFamily: fonts.headlineBlack },
  levelBreakdown: {
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  levelItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelItemLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.headline,
    width: 20,
  },
  levelItemPercent: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.headline,
    width: 30,
    textAlign: 'right',
  },
  vocabCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vocabLabel: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.headlineMedium,
  },
  vocabCount: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
  },
});
