import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';

interface FieldLabelProps {
  label: string;
  emoji: string;
  emojiBgColor?: string;
}

export function FieldLabel({ label, emoji, emojiBgColor = '#F2F2F7' }: FieldLabelProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.emojiContainer, { backgroundColor: emojiBgColor }]}>
        <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      </View>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 16,
    lineHeight: 20, // To center properly vertically
  },
  label: {
    fontSize: 18,
    fontFamily: 'Lexend_600SemiBold',
    fontWeight: '600',
  },
});
