import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useAppStore } from '../../stores/useAppStore';
import { availableLanguages, LanguageCode } from '../../data/i18n';
import { colors, fonts, radius, spacing } from '../../theme';

export default function LanguageSelectScreen() {
  const router = useRouter();
  const nativeLanguage = useAppStore((s) => s.nativeLanguage);
  const setNativeLanguage = useAppStore((s) => s.setNativeLanguage);
  const setShowTranslations = useAppStore((s) => s.setShowTranslations);

  const handleSelect = (code: LanguageCode) => {
    Haptics.selectionAsync();
    setNativeLanguage(code);
    setShowTranslations(true);
  };

  const handleContinue = () => {
    router.push('/onboarding/tour' as any);
  };

  const handleSkip = () => {
    setNativeLanguage(null);
    router.push('/onboarding/tour' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepLabel}>Schritt 1 von 2</Text>
        <Text style={styles.title}>Deine Muttersprache</Text>
        <Text style={styles.subtitle}>
          Wähle deine Muttersprache, um Vokabeln mit Übersetzungen zu sehen.
          Du kannst das jederzeit ändern oder ausschalten.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {availableLanguages.map((lang, idx) => {
          const isSelected = nativeLanguage === lang.code;
          return (
            <Animated.View
              key={lang.code}
              entering={FadeInDown.delay(idx * 20).duration(350)}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelect(lang.code)}
                accessibilityLabel={`Sprache: ${lang.name}`}
              >
                <GlassCard style={[styles.langCard, isSelected && styles.langCardSelected]}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.langName, isSelected && styles.langNameSelected]}
                    >
                      {lang.name}
                    </Text>
                    <Text
                      style={[
                        styles.langNative,
                        lang.rtl && { writingDirection: 'rtl', textAlign: 'left' as const },
                      ]}
                    >
                      {lang.nativeName}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.checkCircle}>
                      <MaterialIcons name="check" size={16} color={colors.primary} />
                    </View>
                  ) : (
                    <View style={styles.uncheckCircle} />
                  )}
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottom}>
        <GradientButton
          title={nativeLanguage ? 'Weiter' : 'Bitte Sprache wählen'}
          onPress={handleContinue}
          disabled={!nativeLanguage}
          size="lg"
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Ohne Übersetzungen fortfahren</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  stepLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.headlineBlack,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 4,
    lineHeight: 18,
  },
  scroll: { padding: spacing.lg },
  langCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  langCardSelected: {
    backgroundColor: 'rgba(237,177,255,0.1)',
    borderColor: 'rgba(237,177,255,0.35)',
  },
  flag: { fontSize: 28 },
  langName: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  langNameSelected: { color: colors.primary },
  langNative: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(237,177,255,0.2)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bottom: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.body,
  },
});
