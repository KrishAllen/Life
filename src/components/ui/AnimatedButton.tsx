import React, { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '../themed-text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  title: string;
  onPress: () => Promise<void> | void;
}

export function AnimatedButton({ title, onPress }: AnimatedButtonProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const scale = useSharedValue(1);
  const successOpacity = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = async () => {
    await onPress();
    // Play success animation
    setIsSuccess(true);
    successOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 300 })
    );
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: withSpring(successOpacity.value > 0 ? 1 : 0.8) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(successOpacity.value > 0 ? 0 : 1, { duration: 200 }),
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        styles.button,
        animatedStyle,
        { backgroundColor: theme.text }, // Inverting text/bg for primary button
      ]}
    >
      <View style={styles.contentContainer}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, successStyle]}>
          <ThemedText style={[styles.successText, { color: theme.background }]}>
            Saved ✨
          </ThemedText>
        </Animated.View>
        <Animated.View style={[styles.center, labelStyle]}>
          <ThemedText style={[styles.title, { color: theme.background }]}>
            {title}
          </ThemedText>
        </Animated.View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 32,
    overflow: 'hidden',
    height: 56,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
