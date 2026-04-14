import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconButton } from '../../components/ui/IconButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAppStore } from '../../stores/useAppStore';
import { availableLanguages, LanguageCode } from '../../data/i18n';
import { colors, fonts, radius, spacing } from '../../theme';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const nativeLanguage = useAppStore((s) => s.nativeLanguage);
  const setNativeLanguage = useAppStore((s) => s.setNativeLanguage);
  const setShowTranslations = useAppStore((s) => s.setShowTranslations);

  const handleSelect = (code: LanguageCode) => {
    Haptics.selectionAsync();
    setNativeLanguage(code);
    // Auto-enable translations when picking a language for the first time
    setShowTranslations(true);
  };

  const handleClear = () => {
    Haptics.selectionAsync();
    setNativeLanguage(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="arrow-back" onPress={() => router.back()} color={colors.textMuted} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Muttersprache</Text>
          <Text style={styles.subtitle}>Für Übersetzungen von Vokabeln</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Wähle deine Muttersprache, um deutsche Vokabeln mit Übersetzungen angezeigt zu bekommen.
          Du kannst das jederzeit im Profil wieder ausschalten.
        </Text>

        {nativeLanguage && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            style={styles.clearButton}
          >
            <MaterialIcons name="close" size={14} color={colors.textDim} />
            <Text style={styles.clearButtonText}>Auswahl entfernen</Text>
          </TouchableOpacity>
        )}

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

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={14} color={colors.textDim} />
          <Text style={styles.infoText}>
            Italienisch und Vietnamesisch sind aktuell noch nicht verfügbar.
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.full,
  },
  clearButtonText: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.bodyMedium,
  },
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.md,
  },
  infoText: {
    flex: 1,
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    lineHeight: 16,
  },
});
