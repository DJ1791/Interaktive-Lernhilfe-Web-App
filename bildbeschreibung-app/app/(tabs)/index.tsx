import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { phases } from '../../data/phases';
import { colors, fonts, radius, spacing } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);
  const progress = useAppStore((s) => s.progress);
  const lastActivity = useAppStore((s) => s.lastActivity);
  const getPhasePercent = useAppStore((s) => s.getPhasePercent);
  const getOverallPercent = useAppStore((s) => s.getOverallPercent);
  const getTodayXp = useAppStore((s) => s.getTodayXp);
  const getWeekXp = useAppStore((s) => s.getWeekXp);

  const overallPercent = getOverallPercent();
  const todayXp = getTodayXp();
  const weekXp = getWeekXp();
  const dailyGoal = progress.dailyGoal ?? 20;
  const dailyPercent = Math.min(100, Math.round((todayXp / dailyGoal) * 100));

  // Route to onboarding only on FIRST ever login (not for returning users from before onboarding was added)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  useEffect(() => {
    if (!currentUser) return;
    // If user already has any progress (XP > 0), they are a returning user — skip onboarding
    if (!hasCompletedOnboarding && progress.xp > 0) {
      completeOnboarding();
      return;
    }
    // True first-time user (no XP yet, onboarding not done)
    if (!hasCompletedOnboarding && progress.xp === 0) {
      router.replace('/onboarding/welcome' as any);
    }
  }, [currentUser, hasCompletedOnboarding, progress.xp]);

  // Find recommended next phase: the first one with < 100% progress
  const recommendedPhase = phases.find((p) => getPhasePercent(p.id) < 100);

  // If lastActivity exists and is recent (within last 30 days), show Continue
  const lastActivityAge = lastActivity
    ? Date.now() - lastActivity.timestamp
    : Infinity;
  const hasValidLastActivity =
    lastActivity !== null && lastActivityAge < 30 * 86400000;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hallo, {currentUser?.displayName ?? 'du'}!</Text>
          <Text style={styles.headerSubtitle}>Bildbeschreibung · DTZ A2/B1</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Lv.{progress.level}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: Continue-where-you-left-off */}
        {hasValidLastActivity && (
          <Animated.View entering={FadeIn.duration(400)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(lastActivity!.routePath as any)}
              accessibilityLabel="Weiter lernen wo du aufgehört hast"
            >
              <LinearGradient
                colors={['#9d50bb', '#8b0e45']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueCard}
              >
                <View style={styles.continueLeft}>
                  <Text style={styles.continueLabel}>Weiter lernen</Text>
                  <Text style={styles.continueTitle}>{lastActivity!.title}</Text>
                  {lastActivity!.subtitle && (
                    <Text style={styles.continueSubtitle}>{lastActivity!.subtitle}</Text>
                  )}
                </View>
                <View style={styles.continuePlayButton}>
                  <MaterialIcons name="play-arrow" size={28} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Daily Goal Card */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <GlassCard style={styles.dailyGoalCard}>
            <View style={styles.dailyGoalHeader}>
              <View style={styles.dailyGoalHeaderLeft}>
                <MaterialIcons name="today" size={18} color={colors.tertiary} />
                <Text style={styles.dailyGoalLabel}>Tagesziel</Text>
              </View>
              <Text style={styles.dailyGoalValue}>
                {todayXp} / {dailyGoal} XP
              </Text>
            </View>
            <ProgressBar percent={dailyPercent} height={8} />
            <View style={styles.streakRow}>
              {weekXp.map((day) => {
                const hit = day.xp >= dailyGoal;
                const partial = day.xp > 0 && day.xp < dailyGoal;
                const isToday = day.date === new Date().toISOString().split('T')[0];
                return (
                  <View
                    key={day.date}
                    style={[
                      styles.streakDot,
                      hit && styles.streakDotHit,
                      partial && styles.streakDotPartial,
                      isToday && styles.streakDotToday,
                    ]}
                  />
                );
              })}
              <Text style={styles.streakText}>
                🔥 {progress.streak} {progress.streak === 1 ? 'Tag' : 'Tage'}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <Text style={styles.sectionLabel}>Schnellzugriff</Text>
          <View style={styles.quickActionsRow}>
            <QuickAction
              icon="menu-book"
              label="Bildbeschreibung"
              color={colors.primary}
              onPress={() => router.push('/(tabs)/lernen' as any)}
            />
            <QuickAction
              icon="style"
              label="Wortschatz"
              color={colors.secondary}
              onPress={() => router.push('/(tabs)/wortschatz' as any)}
            />
            <QuickAction
              icon="functions"
              label="Grammatik"
              color={colors.tertiary}
              onPress={() => router.push('/grammar/akkusativ' as any)}
            />
          </View>
        </Animated.View>

        {/* Overall progress */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionLabel}>Gesamtfortschritt</Text>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <Text style={styles.progressPercent}>{overallPercent}%</Text>
              <View style={{ flex: 1 }} />
              <View style={styles.progressMeta}>
                <Text style={styles.progressMetaValue}>{progress.xp}</Text>
                <Text style={styles.progressMetaLabel}>XP gesamt</Text>
              </View>
            </View>
            <ProgressBar percent={overallPercent} height={8} />
          </GlassCard>
        </Animated.View>

        {/* Recommendation */}
        {recommendedPhase && (
          <Animated.View entering={FadeInDown.delay(260).duration(400)}>
            <Text style={styles.sectionLabel}>Empfohlen für dich</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/exercise/${recommendedPhase.id}`)}
              accessibilityLabel={`Empfohlene Phase: ${recommendedPhase.label}`}
            >
              <GlassCard style={styles.recommendCard}>
                <View
                  style={[
                    styles.recommendIconBg,
                    { backgroundColor: recommendedPhase.color + '22' },
                  ]}
                >
                  <MaterialIcons
                    name="auto-awesome"
                    size={20}
                    color={recommendedPhase.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recommendLabel}>
                    Phase {phases.indexOf(recommendedPhase) + 1}
                  </Text>
                  <Text style={styles.recommendTitle}>{recommendedPhase.label}</Text>
                  <Text style={styles.recommendSubtitle}>
                    {getPhasePercent(recommendedPhase.id)}% abgeschlossen
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.textDim} />
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.quickActionCard}
      accessibilityLabel={label}
    >
      <View style={[styles.quickActionIconBg, { backgroundColor: color + '22' }]}>
        <MaterialIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  greeting: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.headlineBlack,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: 'rgba(237,177,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(237,177,255,0.3)',
  },
  levelBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.headlineMedium,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: 14 },
  // Continue
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: radius.xl,
    gap: 14,
  },
  continueLeft: { flex: 1 },
  continueLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  continueTitle: {
    color: '#fff',
    fontSize: 17,
    fontFamily: fonts.headlineBlack,
    marginTop: 3,
  },
  continueSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  continuePlayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Daily Goal
  dailyGoalCard: { padding: 16, gap: 10 },
  dailyGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyGoalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dailyGoalLabel: {
    color: colors.tertiary,
    fontSize: 11,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  dailyGoalValue: {
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.headlineMedium,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  streakDotPartial: { backgroundColor: 'rgba(255,184,112,0.4)' },
  streakDotHit: { backgroundColor: colors.tertiary },
  streakDotToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  streakText: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.headlineMedium,
    marginLeft: 6,
  },
  // Quick Actions
  sectionLabel: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    marginTop: 4,
  },
  quickActionsRow: { flexDirection: 'row', gap: 10 },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  quickActionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.headlineMedium,
  },
  // Progress Card
  progressCard: { padding: 16, gap: 10 },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  progressPercent: {
    color: colors.text,
    fontSize: 32,
    fontFamily: fonts.headlineBlack,
  },
  progressMeta: { alignItems: 'flex-end' },
  progressMetaValue: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.headlineBlack,
  },
  progressMetaLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Recommendation
  recommendCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendIconBg: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recommendTitle: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  recommendSubtitle: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 1,
  },
});
