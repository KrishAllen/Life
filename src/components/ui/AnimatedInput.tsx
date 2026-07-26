import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SymbolView } from 'expo-symbols';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedInputProps extends TextInputProps {
  multiline?: boolean;
  showChevron?: boolean;
}

export function AnimatedInput({ multiline, showChevron, style, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withSpring(1, { damping: 20, stiffness: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withSpring(0, { damping: 20, stiffness: 200 });
    props.onBlur?.(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      ['#E5E5EA', theme.backgroundSelected] // soft gray to selected border
    );
    
    return {
      borderColor,
      transform: [{ scale: 1 + focusAnim.value * 0.01 }],
    };
  });

  return (
    <Animated.View style={[
      styles.container, 
      multiline ? styles.containerMultiline : undefined,
      animatedContainerStyle, 
      { backgroundColor: theme.background }
    ]}>
      <AnimatedTextInput
        multiline={multiline}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          { color: theme.text },
          multiline && styles.multiline,
          style,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {showChevron && (
        <View style={styles.chevronContainer}>
          <SymbolView name="chevron.down" size={20} tintColor={theme.textSecondary} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999, // Pill shape
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
  },
  containerMultiline: {
    borderRadius: 24,
    height: undefined,
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lexend_400Regular',
    paddingVertical: 14, // For android center alignment
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  chevronContainer: {
    paddingLeft: 8,
  },
});
