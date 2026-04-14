/**
 * Game-Feel Animation Hooks
 *
 * Reusable animation primitives for exercises and vocab games.
 * All animations run on the UI thread via Reanimated worklets.
 */

import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ---------------------------------------------------------------------------
// 1. Scale-on-Press — makes any button feel "physical"
// ---------------------------------------------------------------------------
export function useScaleOnPress(pressedScale = 0.95) {
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(pressedScale, { damping: 15, stiffness: 400 });
  }, [pressedScale, scale]);

  const onPressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Non-worklet wrappers for TouchableOpacity onPressIn/Out (they run on JS thread)
  const pressIn = useCallback(() => {
    scale.value = withTiming(pressedScale, { duration: 60 });
  }, [pressedScale, scale]);

  const pressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return { animatedStyle, onPressIn: pressIn, onPressOut: pressOut };
}

// ---------------------------------------------------------------------------
// 2. Correct-Answer Bounce — celebratory scale + glow
// ---------------------------------------------------------------------------
export function useCorrectBounce() {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const trigger = useCallback(() => {
    // Fast, snappy: total ~200ms, no lingering spring
    scale.value = withSequence(
      withTiming(1.03, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );
    glowOpacity.value = withSequence(
      withTiming(0.25, { duration: 60 }),
      withTiming(0, { duration: 140 })
    );
  }, [scale, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return { trigger, animatedStyle, glowStyle };
}

// ---------------------------------------------------------------------------
// 3. Shake — wrong-answer horizontal shake
// ---------------------------------------------------------------------------
export function useShake() {
  const translateX = useSharedValue(0);

  const trigger = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-4, { duration: 40 }),
      withTiming(4, { duration: 40 }),
      withTiming(-3, { duration: 40 }),
      withTiming(3, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { trigger, animatedStyle };
}

// ---------------------------------------------------------------------------
// 4. Floating Text — "+10 XP" that rises and fades
// ---------------------------------------------------------------------------
export function useFloatingText() {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [visible, setVisible] = useState(false);

  const trigger = useCallback(() => {
    setVisible(true);
    translateY.value = 0;
    opacity.value = 0;
    // Fast float: total ~550ms
    translateY.value = withTiming(-40, { duration: 550, easing: Easing.out(Easing.cubic) });
    opacity.value = withSequence(
      withTiming(1, { duration: 80 }),
      withDelay(200, withTiming(0, { duration: 270 }))
    );
    const hide = () => setVisible(false);
    setTimeout(hide, 600);
  }, [translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return { trigger, animatedStyle, visible };
}

// ---------------------------------------------------------------------------
// 5. Streak Counter — animated scale bump
// ---------------------------------------------------------------------------
export function useStreakCounter() {
  const [streak, setStreak] = useState(0);
  const scale = useSharedValue(1);

  const bump = useCallback(() => {
    setStreak((s) => s + 1);
    scale.value = withSequence(
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );
  }, [scale]);

  const reset = useCallback(() => {
    setStreak(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { streak, bump, reset, animatedStyle };
}

// ---------------------------------------------------------------------------
// 6. Count-Up — animated number from 0 to target
// ---------------------------------------------------------------------------
export function useCountUp(target: number, duration = 1200) {
  const progress = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  const start = useCallback(() => {
    progress.value = 0;
    progress.value = withTiming(target, { duration, easing: Easing.out(Easing.cubic) });
    // Polling the value for display (Reanimated doesn't have a direct text-animation API)
    let frame = 0;
    const interval = 16; // ~60fps
    const steps = Math.ceil(duration / interval);
    const timer = setInterval(() => {
      frame++;
      const t = Math.min(1, frame / steps);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(eased * target));
      if (frame >= steps) {
        clearInterval(timer);
        setDisplayValue(target);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration, progress]);

  return { start, displayValue };
}
