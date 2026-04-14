import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAppStore } from '../../stores/useAppStore';
import { GradientButton } from '../../components/ui/GradientButton';
import { colors, fonts, radius, spacing } from '../../theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.iconWrap}>
          <LinearGradient
            colors={['#9d50bb', '#8b0e45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBg}
          >
            <MaterialIcons name="school" size={44} color="#fff" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.title}>Willkommen{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!</Text>
          <Text style={styles.subtitle}>
            Diese App hilft dir, dich systematisch auf die{'\n'}
            Bildbeschreibung im DTZ (A2/B1) vorzubereiten.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.featureList}>
          <Feature
            icon="menu-book"
            title="Bildbeschreibung in 4 Phasen"
            description="Einleitung, Positionen, Präpositionen und Adjektive systematisch lernen"
          />
          <Feature
            icon="style"
            title="Wortschatz mit Übersetzung"
            description="357 Vokabeln in 15 Sprachen, mit Karteikarten und Übungen zum Einprägen"
          />
          <Feature
            icon="functions"
            title="Grammatik gezielt üben"
            description="Akkusativ, Dativ, Präpositionen, Adjektivdeklination und Satzstellung"
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.bottom}>
        <GradientButton
          title="Los geht's"
          onPress={() => router.push('/onboarding/language' as any)}
          size="lg"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIconBg}>
        <MaterialIcons name={icon as any} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowTopLeft: {
    position: 'absolute',
    top: '-15%',
    left: '-15%',
    width: '60%',
    height: '50%',
    backgroundColor: 'rgba(237,177,255,0.06)',
    borderRadius: 999,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '50%',
    height: '40%',
    backgroundColor: 'rgba(255,177,197,0.04)',
    borderRadius: 999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconWrap: { alignItems: 'center', marginBottom: 30 },
  iconBg: {
    width: 92,
    height: 92,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontFamily: fonts.headlineBlack,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  featureList: {
    gap: 16,
    marginTop: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(237,177,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
  featureDescription: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
    lineHeight: 15,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
