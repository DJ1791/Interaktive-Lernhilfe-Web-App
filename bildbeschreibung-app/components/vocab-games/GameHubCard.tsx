import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlassCard } from '../ui/GlassCard';
import { colors, fonts, radius } from '../../theme';

interface GameHubCardProps {
  icon?: string;
  emoji?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  badge?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function GameHubCard({
  icon,
  emoji,
  title,
  subtitle,
  trailing,
  badge,
  onPress,
  disabled,
}: GameHubCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          {emoji ? (
            <Text style={styles.emoji}>{emoji}</Text>
          ) : icon ? (
            <View style={styles.iconBg}>
              <MaterialIcons name={icon as any} size={18} color={colors.primary} />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {trailing ?? (
            <MaterialIcons name="chevron-right" size={22} color={colors.textDim} />
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 28 },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(237,177,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.headlineMedium,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 11,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(237,177,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fonts.headline,
  },
});
