import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { getLanguageMeta } from '../../data/i18n';
import { phases } from '../../data/phases';
import { achievements as achievementDefs } from '../../data/achievements';
import { colors, fonts, spacing, radius } from '../../theme';

export default function IchScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = useAppStore((s) => s.isTeacher);
  const progress = useAppStore((s) => s.progress);
  const nativeLanguage = useAppStore((s) => s.nativeLanguage);
  const showTranslations = useAppStore((s) => s.showTranslations);
  const setShowTranslations = useAppStore((s) => s.setShowTranslations);
  const getPhasePercent = useAppStore((s) => s.getPhasePercent);
  const getOverallPercent = useAppStore((s) => s.getOverallPercent);
  const getWeekXp = useAppStore((s) => s.getWeekXp);
  const favoriteWords = useAppStore((s) => s.favoriteWords);
  const logout = useAppStore((s) => s.logout);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const langMeta = getLanguageMeta(nativeLanguage);

  const weekXp = getWeekXp();
  const weeklyTotalXp = weekXp.reduce((s, d) => s + d.xp, 0);
  const unlockedIds = Object.keys(progress.achievements || {});
  const unlockedCount = unlockedIds.length;

  const overallPercent = getOverallPercent();
  const totalCorrect = Object.values(progress.phases).reduce(
    (sum, p) => sum + p.level1.correct + p.level2.correct + p.level3.correct,
    0
  );
  const totalAttempts = Object.values(progress.phases).reduce(
    (sum, p) => sum + p.level1.total + p.level2.total + p.level3.total,
    0
  );
  const vocabCount = Object.keys(progress.vocab.words).length;

  const handleResetProgress = () => {
    Alert.alert(
      'Fortschritt zurücksetzen?',
      'Alle Lernfortschritte, XP und Streaks werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zurücksetzen', style: 'destructive', onPress: () => resetProgress() },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Abmelden?', 'Möchtest du dich wirklich abmelden?', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Abmelden', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ich</Text>
        <Text style={styles.subtitle}>Dein Profil, Fortschritt & Einstellungen</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <GlassCard style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.displayName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{currentUser?.displayName}</Text>
            <Text style={styles.userRole}>{isTeacher ? 'Lehrkraft' : 'Schüler/in'}</Text>
            <View style={styles.userStats}>
              <StatChip value={`Lv.${progress.level}`} label="Level" />
              <Divider />
              <StatChip value={progress.xp} label="XP" />
              <Divider />
              <StatChip value={progress.streak} label="Streak" />
            </View>
          </GlassCard>
        </Animated.View>

        {isTeacher && (
          <Animated.View entering={FadeInDown.delay(120).duration(400)}>
            <GlassCard style={styles.teacherNotice}>
              <MaterialIcons name="school" size={18} color={colors.tertiary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.teacherNoticeTitle}>Lehrkraft-Modus</Text>
                <Text style={styles.teacherNoticeText}>
                  Spezielle Funktionen für Lehrkräfte (Klassen-Übersicht, Schüler-Statistiken) folgen in einer späteren Version.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Progress Section */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={styles.sectionTitle}>Fortschritt</Text>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Gesamt</Text>
              <Text style={styles.progressBig}>{overallPercent}%</Text>
            </View>
            <ProgressBar percent={overallPercent} height={8} />
            <Text style={styles.progressDetail}>
              {totalCorrect} von {totalAttempts} Antworten richtig · {vocabCount} Vokabeln geübt
            </Text>
          </GlassCard>

          {phases.map((phase, index) => {
            const percent = getPhasePercent(phase.id);
            return (
              <GlassCard key={phase.id} style={styles.phaseStatCard}>
                <View style={styles.phaseStatHeader}>
                  <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
                  <Text style={styles.phaseStatName}>
                    Phase {index + 1}: {phase.label}
                  </Text>
                  <Text style={[styles.phaseStatPercent, { color: phase.color }]}>{percent}%</Text>
                </View>
                <ProgressBar percent={percent} height={3} />
              </GlassCard>
            );
          })}
        </Animated.View>

        {/* Weekly stats */}
        <Animated.View entering={FadeInDown.delay(170).duration(400)}>
          <Text style={styles.sectionTitle}>Diese Woche</Text>
          <GlassCard style={styles.weekCard}>
            <View style={styles.weekHeader}>
              <Text style={styles.weekLabel}>Aktivität der letzten 7 Tage</Text>
              <Text style={styles.weekTotal}>{weeklyTotalXp} XP</Text>
            </View>
            <View style={styles.weekBars}>
              {weekXp.map((day, i) => {
                const maxXp = Math.max(progress.dailyGoal ?? 20, ...weekXp.map((d) => d.xp));
                const barHeight = maxXp > 0 ? (day.xp / maxXp) * 60 : 0;
                const date = new Date(day.date);
                const weekdayShort = ['So','Mo','Di','Mi','Do','Fr','Sa'][date.getDay()];
                const goalHit = day.xp >= (progress.dailyGoal ?? 20);
                return (
                  <View key={day.date} style={styles.weekBarCol}>
                    <View style={styles.weekBarContainer}>
                      <View
                        style={[
                          styles.weekBar,
                          { height: Math.max(4, barHeight) },
                          goalHit && styles.weekBarHit,
                        ]}
                      />
                    </View>
                    <Text style={styles.weekBarLabel}>{weekdayShort}</Text>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)}>
          <Text style={styles.sectionTitle}>
            Erfolge ({unlockedCount}/{achievementDefs.length})
          </Text>
          <View style={styles.achievementsGrid}>
            {achievementDefs.map((a) => {
              const isUnlocked = unlockedIds.includes(a.id);
              return (
                <View
                  key={a.id}
                  style={[
                    styles.achievementItem,
                    isUnlocked ? styles.achievementUnlocked : styles.achievementLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIconBg,
                      { backgroundColor: isUnlocked ? a.color + '20' : 'rgba(255,255,255,0.04)' },
                    ]}
                  >
                    <MaterialIcons
                      name={a.icon as any}
                      size={20}
                      color={isUnlocked ? a.color : colors.textDim}
                    />
                  </View>
                  <Text
                    style={[
                      styles.achievementLabel,
                      !isUnlocked && { color: colors.textDim },
                    ]}
                    numberOfLines={2}
                  >
                    {a.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Favorites */}
        {favoriteWords.length > 0 && (
          <Animated.View entering={FadeInDown.delay(190).duration(400)}>
            <Text style={styles.sectionTitle}>
              Meine schweren Wörter ({favoriteWords.length})
            </Text>
            <GlassCard style={styles.favoritesCard}>
              <View style={styles.favoritesWrap}>
                {favoriteWords.slice(0, 20).map((w) => (
                  <View key={w} style={styles.favoriteChip}>
                    <MaterialIcons name="star" size={12} color={colors.tertiary} />
                    <Text style={styles.favoriteText}>{w}</Text>
                  </View>
                ))}
              </View>
              {favoriteWords.length > 20 && (
                <Text style={styles.favoritesMore}>
                  + {favoriteWords.length - 20} weitere
                </Text>
              )}
            </GlassCard>
          </Animated.View>
        )}

        {/* Language Settings */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>Sprache & Übersetzungen</Text>
          <GlassCard padding={0}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => router.push('/profile/settings' as any)}
              activeOpacity={0.7}
              accessibilityLabel="Muttersprache wählen"
            >
              <MaterialIcons name="translate" size={20} color={colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsLabel}>Muttersprache</Text>
                {langMeta ? (
                  <Text style={styles.settingsSubLabel}>
                    {langMeta.flag}  {langMeta.name} · {langMeta.nativeName}
                  </Text>
                ) : (
                  <Text style={styles.settingsSubLabelMuted}>Keine Sprache gewählt</Text>
                )}
              </View>
              <MaterialIcons name="chevron-right" size={18} color={colors.textDim} />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <View style={styles.settingsItem}>
              <MaterialIcons name="visibility" size={20} color={colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.settingsLabel}>Übersetzungen anzeigen</Text>
                <Text style={styles.settingsSubLabelMuted}>
                  {nativeLanguage
                    ? 'Wortübersetzungen bei Vokabeln einblenden'
                    : 'Erst eine Muttersprache wählen'}
                </Text>
              </View>
              <Switch
                value={showTranslations && !!nativeLanguage}
                onValueChange={setShowTranslations}
                disabled={!nativeLanguage}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          <GlassCard padding={0}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleResetProgress}
              activeOpacity={0.7}
              accessibilityLabel="Fortschritt zurücksetzen"
            >
              <MaterialIcons name="refresh" size={20} color={colors.error} />
              <Text style={[styles.settingsLabel, { color: colors.error, flex: 1 }]}>
                Fortschritt zurücksetzen
              </Text>
              <MaterialIcons name="chevron-right" size={18} color={colors.textDim} />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.sectionTitle}>Über die App</Text>
          <GlassCard style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              DTZ Bildbeschreibung Lernhilfe{'\n'}
              Interaktive App zur Vorbereitung auf den{'\n'}
              Deutsch-Test für Zuwanderer (A2/B1)
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <GradientButton
            title="Abmelden"
            onPress={handleLogout}
            gradient={['#8b0e45', '#5a0930']}
            size="lg"
            style={styles.logoutButton}
          />
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  userCard: { padding: 22, alignItems: 'center' },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(237,177,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 26,
    fontFamily: fonts.headlineBlack,
  },
  userName: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.headlineBlack,
  },
  userRole: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    width: '100%',
  },
  statChip: { alignItems: 'center' },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.headlineBlack,
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.08)' },
  sectionTitle: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 10,
    marginBottom: 6,
  },
  progressCard: { padding: 16, gap: 8, marginBottom: 8 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  progressLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  progressBig: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
  },
  progressDetail: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  phaseStatCard: {
    padding: 12,
    gap: 8,
    marginBottom: 6,
  },
  phaseStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseStatName: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    fontFamily: fonts.body,
  },
  phaseStatPercent: {
    fontSize: 12,
    fontFamily: fonts.headline,
  },
  // Weekly stats
  weekCard: { padding: 16, gap: 14 },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
  },
  weekTotal: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.headlineBlack,
  },
  weekBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    gap: 4,
  },
  weekBarCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekBarContainer: {
    height: 60,
    justifyContent: 'flex-end',
    width: '100%',
  },
  weekBar: {
    width: '100%',
    backgroundColor: 'rgba(237,177,255,0.3)',
    borderRadius: 3,
  },
  weekBarHit: {
    backgroundColor: colors.tertiary,
  },
  weekBarLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
  },
  // Achievements
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementItem: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    gap: 4,
    borderWidth: 1,
  },
  achievementUnlocked: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  achievementLocked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderColor: 'rgba(255,255,255,0.04)',
    opacity: 0.5,
  },
  achievementIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLabel: {
    color: colors.text,
    fontSize: 9,
    fontFamily: fonts.headlineMedium,
    textAlign: 'center',
    lineHeight: 11,
  },
  // Favorites
  favoritesCard: { padding: 14 },
  favoritesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  favoriteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,184,112,0.1)',
    borderRadius: radius.full,
  },
  favoriteText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
  },
  favoritesMore: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  teacherNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,184,112,0.08)',
    borderColor: 'rgba(255,184,112,0.25)',
    marginTop: 4,
  },
  teacherNoticeTitle: {
    color: colors.tertiary,
    fontSize: 12,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  teacherNoticeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: fonts.body,
    lineHeight: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  settingsLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.body,
  },
  settingsSubLabel: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
  },
  settingsSubLabelMuted: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: 16,
  },
  aboutCard: { padding: 16, alignItems: 'center' },
  aboutText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  versionText: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    marginTop: 8,
  },
  logoutButton: { marginTop: 8 },
});
