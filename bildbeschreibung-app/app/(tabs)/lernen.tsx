import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { phases } from '../../data/phases';
import { getExercisesForPhase } from '../../data/exercises';
import { useTranslation } from '../../hooks/useTranslation';
import { colors, fonts, spacing, radius } from '../../theme';

const grammarTopics = [
  { id: 'akkusativ', label: 'Akkusativ', icon: 'arrow-forward', description: 'den/einen/keinen + maskulin' },
  { id: 'dativ', label: 'Dativ', icon: 'swap-horiz', description: 'dem/einem/keinem + Dativ-Präpositionen' },
  { id: 'praepositionen', label: 'Präpositionen', icon: 'place', description: 'auf, in, an, neben, unter, über …' },
  { id: 'adjektivdeklination', label: 'Adjektivdeklination', icon: 'palette', description: 'Adjektivendungen nach Artikel' },
  { id: 'satzstellung', label: 'Satzstellung', icon: 'reorder', description: 'Verb an Position 2, Inversion' },
];

function getIconName(icon: string): any {
  return icon;
}

export default function LernenScreen() {
  const router = useRouter();
  const getPhasePercent = useAppStore((s) => s.getPhasePercent);
  const fokusStats = useAppStore((s) => s.getFokusGrammarStats());
  const { tPhase, meta } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Lernen</Text>
        <Text style={styles.subtitle}>Phasen, Grammatik und Beispiel-Übungen</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 4 Phases Section */}
        <Text style={styles.sectionLabel}>Die 4 Phasen</Text>
        {phases.map((phase, index) => {
          const exercises = getExercisesForPhase(phase.id);
          const percent = getPhasePercent(phase.id);
          const phaseTrans = tPhase(phase.id);
          return (
            <Animated.View
              key={phase.id}
              entering={FadeInDown.delay(index * 60).duration(400)}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/exercise/${phase.id}`)}
              >
                <GlassCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBg, { backgroundColor: phase.color + '20' }]}>
                      <MaterialIcons
                        name={getIconName(phase.icon)}
                        size={20}
                        color={phase.color}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>Phase {index + 1}: {phase.label}</Text>
                      {phaseTrans && meta && (
                        <Text
                          style={[
                            styles.cardTranslation,
                            meta.rtl && { writingDirection: 'rtl', textAlign: 'left' as const },
                          ]}
                        >
                          {meta.flag}  {phaseTrans}
                        </Text>
                      )}
                      <Text style={styles.cardMeta}>{exercises.length} Übungen · 3 Level · {percent}% abgeschlossen</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={colors.textDim} />
                  </View>
                  <ProgressBar percent={percent} height={4} />
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Beispiel-Übungen */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Gesamte Bildbeschreibungen</Text>
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/exercise/extra')}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBg, { backgroundColor: '#ffb87020' }]}>
                  <MaterialIcons name="auto-fix-high" size={20} color={colors.tertiary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Beispiel-Übungen</Text>
                  <Text style={styles.cardMeta}>
                    Phasenübergreifende Komplett-Übungen · 3 Level
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.textDim} />
              </View>
              <ProgressBar percent={getPhasePercent('extra')} height={4} />
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>

        {/* Grammar Topics */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Grammatik-Themen</Text>
        {grammarTopics.map((topic, index) => {
          const stats = fokusStats[topic.id];
          const percent = stats && stats.attempts > 0
            ? Math.round((stats.correct / stats.attempts) * 100)
            : 0;
          const attempted = stats?.attempts || 0;
          return (
            <Animated.View
              key={topic.id}
              entering={FadeInDown.delay(500 + index * 40).duration(400)}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/grammar/${topic.id}`)}
              >
                <GlassCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconBg, { backgroundColor: 'rgba(237,177,255,0.12)' }]}>
                      <MaterialIcons
                        name={topic.icon as any}
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{topic.label}</Text>
                      <Text style={styles.cardMeta}>{topic.description}</Text>
                    </View>
                    <MaterialIcons name="play-arrow" size={22} color={colors.primary} />
                  </View>
                  {attempted > 0 ? (
                    <View style={{ gap: 4 }}>
                      <ProgressBar percent={percent} height={4} />
                      <Text style={styles.topicStatsText}>
                        {stats!.correct}/{stats!.attempts} richtig ({percent}%)
                      </Text>
                    </View>
                  ) : null}
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
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
  sectionLabel: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    marginTop: 4,
  },
  card: { padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  cardTranslation: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
    marginTop: 2,
  },
  cardMeta: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  topicStatsText: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.body,
    textAlign: 'right',
  },
});
