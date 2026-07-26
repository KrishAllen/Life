import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Platform, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedInputProps extends TextInputProps {
  multiline?: boolean;
  showChevron?: boolean;
}

export function AnimatedInput({ multiline, showChevron, style, ...props }: AnimatedInputProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    focusAnim.value = withSpring(1, { damping: 20, stiffness: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    focusAnim.value = withSpring(0, { damping: 20, stiffness: 200 });
    props.onBlur?.(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      ['#E5E5EA', '#A0A0B0']
    );
    return {
      borderColor,
      transform: [{ scale: 1 + focusAnim.value * 0.008 }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        multiline ? styles.containerMultiline : undefined,
        animatedContainerStyle,
        { backgroundColor: theme.background },
      ]}
    >
      <AnimatedTextInput
        multiline={multiline}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { color: theme.text },
          multiline && styles.multilineInput,
          style,
          // Suppress browser's default sharp focus ring — animated border handles it
          Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {showChevron && !multiline && (
        <View style={styles.chevronContainer}>
          <Text style={[styles.chevronText, { color: theme.textSecondary }]}>›</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
    overflow: 'hidden',
  },
  containerMultiline: {
    borderRadius: 24,
    height: undefined,
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  chevronContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 24,
    lineHeight: 28,
    transform: [{ rotate: '90deg' }],
    fontWeight: '300',
  },
});
