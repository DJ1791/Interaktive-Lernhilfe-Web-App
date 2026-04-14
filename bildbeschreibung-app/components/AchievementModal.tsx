import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useAppStore } from '../stores/useAppStore';
import { getAchievementDef } from '../data/achievements';
import { colors, fonts, radius, spacing } from '../theme';

/**
 * Polls the store for pendingUnlockedAchievements; if any exist, show modal one-by-one.
 * Mount this once high in the tree (e.g. in the root or tabs layout).
 */
export function AchievementModal() {
  const consumePendingUnlocks = useAppStore((s) => s.consumePendingUnlocks);
  const pending = useAppStore((s) => s.pendingUnlockedAchievements);
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (pending.length > 0 && queue.length === 0) {
      const unlocks = consumePendingUnlocks();
      if (unlocks.length > 0) {
        setQueue(unlocks);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [pending.length, queue.length, consumePendingUnlocks]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
    }
  }, [current, queue]);

  const handleDismiss = () => {
    const rest = queue.slice(1);
    setCurrent(null);
    setQueue(rest);
  };

  if (!current) return null;
  const def = getAchievementDef(current);
  if (!def) return null;

  return (
    <Modal
      visible={!!current}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.card}>
          <Text style={styles.label}>Erfolg freigeschaltet!</Text>
          <View style={[styles.iconBg, { backgroundColor: def.color + '25' }]}>
            <MaterialIcons name={def.icon as any} size={56} color={def.color} />
          </View>
          <Text style={styles.title}>{def.label}</Text>
          <Text style={styles.description}>{def.description}</Text>
          <TouchableOpacity
            onPress={handleDismiss}
            style={[styles.button, { backgroundColor: def.color }]}
            activeOpacity={0.85}
            accessibilityLabel="Erfolg schließen"
          >
            <Text style={styles.buttonText}>Weiter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.xl,
    padding: 28,
    alignItems: 'center',
    width: '90%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    color: colors.tertiary,
    fontSize: 11,
    fontFamily: fonts.headline,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  iconBg: {
    width: 110,
    height: 110,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontFamily: fonts.headlineBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.body,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 22,
  },
  button: {
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fonts.headlineMedium,
  },
});
