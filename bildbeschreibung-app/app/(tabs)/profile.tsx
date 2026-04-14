import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { getLanguageMeta } from '../../data/i18n';
import { colors, fonts, spacing } from '../../theme';

export default function ProfileScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = useAppStore((s) => s.isTeacher);
  const progress = useAppStore((s) => s.progress);
  const nativeLanguage = useAppStore((s) => s.nativeLanguage);
  const showTranslations = useAppStore((s) => s.showTranslations);
  const setShowTranslations = useAppStore((s) => s.setShowTranslations);
  const logout = useAppStore((s) => s.logout);
  const resetProgress = useAppStore((s) => s.resetProgress);

  const langMeta = getLanguageMeta(nativeLanguage);

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
        <Text style={styles.title}>Profil</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <GlassCard style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.displayName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>{currentUser?.displayName}</Text>
            <Text style={styles.userRole}>{isTeacher ? 'Lehrkraft' : 'Schüler/in'}</Text>
            <View style={styles.userStats}>
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>Lv.{progress.level}</Text>
                <Text style={styles.userStatLabel}>Level</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{progress.xp}</Text>
                <Text style={styles.userStatLabel}>XP</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.userStat}>
                <Text style={styles.userStatValue}>{progress.streak}</Text>
                <Text style={styles.userStatLabel}>Streak</Text>
              </View>
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

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text style={styles.sectionTitle}>Sprache & Übersetzungen</Text>
          <GlassCard padding={0}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => router.push('/profile/settings' as any)}
              activeOpacity={0.7}
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

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          <GlassCard padding={0}>
            <SettingsItem
              icon="refresh"
              label="Fortschritt zurücksetzen"
              onPress={handleResetProgress}
              destructive
            />
          </GlassCard>
        </Animated.View>

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

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
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

function SettingsItem({
  icon, label, onPress, destructive = false,
}: {
  icon: string; label: string; onPress: () => void; destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons
        name={icon as any}
        size={20}
        color={destructive ? colors.error : colors.textMuted}
      />
      <Text style={[styles.settingsLabel, { flex: 1 }, destructive && { color: colors.error }]}>{label}</Text>
      <MaterialIcons name="chevron-right" size={18} color={colors.textDim} />
    </TouchableOpacity>
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
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: 10 },
  userCard: { padding: 24, alignItems: 'center' },
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
    gap: 20,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    width: '100%',
  },
  userStat: { alignItems: 'center' },
  userStatValue: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.headlineBlack,
  },
  userStatLabel: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.08)' },
  sectionTitle: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 4,
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
  teacherNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: 'rgba(255,184,112,0.08)',
    borderColor: 'rgba(255,184,112,0.25)',
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
