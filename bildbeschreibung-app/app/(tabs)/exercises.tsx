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
import { colors, fonts, spacing } from '../../theme';

export default function ExercisesScreen() {
  const router = useRouter();
  const getPhasePercent = useAppStore((s) => s.getPhasePercent);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Übungen</Text>
        <Text style={styles.subtitle}>Wähle eine Phase oder ein Übungspaket</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>4 Phasen</Text>
        {phases.map((phase, index) => {
          const exercises = getExercisesForPhase(phase.id);
          const percent = getPhasePercent(phase.id);
          return (
            <Animated.View
              key={phase.id}
              entering={FadeInDown.delay(index * 80).duration(400)}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/exercise/${phase.id}`)}
              >
                <GlassCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.phaseIconBg, { backgroundColor: phase.color + '20' }]}>
                      <MaterialIcons
                        name={getIconName(phase.icon)}
                        size={20}
                        color={phase.color}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>Phase {index + 1}: {phase.label}</Text>
                      <Text style={styles.cardMeta}>{exercises.length} Übungen · 3 Level</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={colors.textDim} />
                  </View>
                  <ProgressBar percent={percent} height={4} />
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Gesamte Bildbeschreibungen</Text>
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/exercise/extra')}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.phaseIconBg, { backgroundColor: '#ffb87020' }]}>
                  <MaterialIcons name="auto-fix-high" size={20} color={colors.tertiary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Beispiel-Übungen</Text>
                  <Text style={styles.cardMeta}>Phasenübergreifende Komplett-Übungen</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.textDim} />
              </View>
              <ProgressBar percent={getPhasePercent('extra')} height={4} />
            </GlassCard>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getIconName(icon: string): any {
  const mapping: Record<string, string> = {
    visibility: 'visibility',
    'pin-drop': 'pin-drop',
    'swap-horiz': 'swap-horiz',
    palette: 'palette',
  };
  return mapping[icon] || 'circle';
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
    fontSize: 10,
    fontFamily: fonts.headlineBlack,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  card: { padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  phaseIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  cardMeta: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
});
