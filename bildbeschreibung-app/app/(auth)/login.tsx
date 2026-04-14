import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../../stores/useAppStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { colors, fonts, radius } from '../../theme';

export default function LoginScreen() {
  const login = useAppStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleLogin = () => {
    Keyboard.dismiss();
    const success = login(username.trim().toLowerCase(), password);
    if (!success) {
      setError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.logoContainer}>
          <MaterialIcons name="school" size={32} color="#fff" />
          <Text style={styles.title}>Bildbeschreibung</Text>
          <Text style={styles.subtitle}>Lernhilfe</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={{ width: '100%', maxWidth: 340 }}>
          <Animated.View style={shakeStyle}>
            <GlassCard padding={24}>
              <Text style={styles.cardHint}>Melde dich mit deinen Zugangsdaten an</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Benutzername</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Benutzername"
                  placeholderTextColor={colors.textDim}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Passwort</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Passwort"
                  placeholderTextColor={colors.textDim}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>

              {error && (
                <Text style={styles.error}>Benutzername oder Passwort falsch.</Text>
              )}

              <GradientButton
                title="Anmelden"
                onPress={handleLogin}
                disabled={!username.trim() || !password}
                size="lg"
                style={styles.loginButton}
              />

              <Text style={styles.infoHint}>
                Deine Zugangsdaten hast du von deinem Integrationskurs oder deiner Lehrkraft erhalten.
              </Text>
            </GlassCard>
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <Text style={styles.footer}>B1 Deutschtest für Zuwanderer</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.headlineBlack,
    fontSize: 22,
    color: colors.text,
    marginTop: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.body,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontFamily: fonts.body,
    marginBottom: 12,
  },
  loginButton: {
    marginTop: 8,
  },
  infoHint: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footer: {
    color: colors.textDim,
    fontSize: 9,
    fontFamily: fonts.body,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 24,
  },
});
