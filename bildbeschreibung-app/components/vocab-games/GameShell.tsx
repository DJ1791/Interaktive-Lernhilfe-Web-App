import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '../ui/IconButton';
import { ProgressBar } from '../ui/ProgressBar';
import { colors, fonts, spacing } from '../../theme';

interface GameShellProps {
  title: string;
  subtitle?: string;
  progressPercent?: number;
  progressLabel?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

export function GameShell({
  title,
  subtitle,
  progressPercent,
  progressLabel,
  onClose,
  children,
}: GameShellProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          onPress={onClose ?? (() => router.back())}
          color={colors.textMuted}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        <View style={{ width: 40 }} />
      </View>

      {typeof progressPercent === 'number' && (
        <View style={styles.progressBar}>
          <ProgressBar percent={progressPercent} height={4} />
          {progressLabel && <Text style={styles.progressLabel}>{progressLabel}</Text>}
        </View>
      )}

      <View style={styles.content}>{children}</View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 1,
  },
  progressBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 4,
  },
  progressLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.headline,
    textAlign: 'right',
  },
  content: { flex: 1 },
});
