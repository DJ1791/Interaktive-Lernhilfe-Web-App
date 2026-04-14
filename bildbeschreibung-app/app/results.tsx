import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientButton } from '../components/ui/GradientButton';
import { colors, fonts, spacing } from '../theme';

export default function ResultsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ergebnisse</Text>
        <Text style={styles.text}>
          Detaillierte Ergebnisse findest du im Fortschritt-Tab.
        </Text>
        <GradientButton
          title="Zurück zum Dashboard"
          onPress={() => router.replace('/(tabs)')}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.headlineBlack,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.body,
    textAlign: 'center',
  },
});
