import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fonts } from '../../theme';

interface XPBadgeProps {
  xp: number;
  level: number;
  compact?: boolean;
}

export function XPBadge({ xp, level, compact = false }: XPBadgeProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <MaterialIcons name="star" size={14} color={colors.tertiary} />
        <Text style={styles.compactText}>{xp} XP</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv.{level}</Text>
      </View>
      <View style={styles.xpContainer}>
        <MaterialIcons name="star" size={16} color={colors.tertiary} />
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(237,177,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  levelText: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.headline,
    fontWeight: '700',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  xpText: {
    color: colors.tertiary,
    fontSize: 12,
    fontFamily: fonts.headline,
    fontWeight: '700',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactText: {
    color: colors.tertiary,
    fontSize: 11,
    fontFamily: fonts.headline,
    fontWeight: '700',
  },
});
