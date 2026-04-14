import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts } from '../../theme';

interface ProgressBarProps {
  percent: number;
  height?: number;
  showLabel?: boolean;
  gradientColors?: [string, string];
}

export function ProgressBar({
  percent,
  height = 8,
  showLabel = false,
  gradientColors,
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(100, Math.max(0, percent)), {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            { height, borderRadius: height / 2 },
            animatedStyle,
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>{Math.round(percent)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.secondary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: fonts.headline,
    marginTop: 4,
    textAlign: 'right',
  },
});
