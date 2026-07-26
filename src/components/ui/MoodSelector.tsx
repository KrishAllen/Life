import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '../themed-text';

const MOODS = [
  { id: 'amazing', emoji: '✨', label: 'Amazing' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'rough', emoji: '🌧️', label: 'Rough' },
];

interface MoodSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MoodSelector({ selectedId, onSelect }: MoodSelectorProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {MOODS.map((mood) => {
        const isSelected = selectedId === mood.id;

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { scale: withSpring(isSelected ? 1.15 : 1, { damping: 15, stiffness: 200 }) },
            ],
            opacity: withTiming(selectedId ? (isSelected ? 1 : 0.4) : 1, { duration: 200 }),
          };
        });

        return (
          <AnimatedPressable
            key={mood.id}
            onPress={() => onSelect(mood.id)}
            style={[
              styles.moodItem,
              { backgroundColor: theme.backgroundElement },
              isSelected && { backgroundColor: theme.backgroundSelected },
              animatedStyle,
            ]}
          >
            <ThemedText style={styles.emoji}>{mood.emoji}</ThemedText>
            {isSelected && (
              <ThemedText style={styles.label}>{mood.label}</ThemedText>
            )}
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 64,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
