import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { MoodSelector } from '@/components/ui/MoodSelector';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SymbolView } from 'expo-symbols';

export default function JournalScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [moodId, setMoodId] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [mainNote, setMainNote] = useState('');
  const [takeaway, setTakeaway] = useState('');

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // Entrance animations
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 200 }));
    opacity.value = withDelay(100, withSpring(1, { damping: 20, stiffness: 200 }));
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleSave = async () => {
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Saved entry:', { date, moodId, summary, mainNote, takeaway });
    
    // Clear all fields after save
    setMoodId(null);
    setSummary('');
    setMainNote('');
    setTakeaway('');
    setDate(new Date());
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setDate(currentDate);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#FAFAFC' }]}>
      <Stack.Screen options={{ title: 'Journal', headerShadowVisible: false, headerStyle: { backgroundColor: '#FAFAFC' } }} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.formContainer, animatedContainerStyle]}>
            
            {/* Date Field (Required) */}
            <View style={styles.field}>
              <FieldLabel label="Date *" emoji="📅" emojiBgColor="#E8DEF8" />
              {Platform.OS === 'ios' ? (
                <View style={styles.iosDatePickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    textColor={theme.text}
                    themeVariant={colorScheme ?? 'light'}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[styles.chubbyButton, { backgroundColor: theme.background, borderColor: '#E5E5EA' }]} 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <ThemedText style={styles.chubbyButtonText}>
                      {date.toLocaleDateString()}
                    </ThemedText>
                    <SymbolView name="xmark" size={16} tintColor={theme.text} />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </>
              )}
            </View>

            {/* Mood Field */}
            <View style={styles.field}>
              <FieldLabel label="Mood" emoji="🎭" emojiBgColor="#FFE082" />
              <MoodSelector selectedId={moodId} onSelect={setMoodId} />
            </View>

            {/* Summary Field */}
            <View style={styles.field}>
              <FieldLabel label="Summary" emoji="📝" emojiBgColor="#BBDEFB" />
              <AnimatedInput
                placeholder="A quick one-liner about today..."
                value={summary}
                onChangeText={setSummary}
                returnKeyType="next"
              />
            </View>

            {/* Main Note Field */}
            <View style={styles.field}>
              <FieldLabel label="Entry" emoji="✍️" emojiBgColor="#C8E6C9" />
              <AnimatedInput
                placeholder="What's on your mind?"
                value={mainNote}
                onChangeText={setMainNote}
                multiline
              />
            </View>

            {/* Takeaway Field */}
            <View style={styles.field}>
              <FieldLabel label="Takeaway / Gratitude" emoji="🙏" emojiBgColor="#FFCDD2" />
              <AnimatedInput
                placeholder="One thing I'm grateful for..."
                value={takeaway}
                onChangeText={setTakeaway}
                returnKeyType="done"
                showChevron={true}
              />
            </View>

            <View style={styles.footer}>
              <AnimatedButton title="Save Entry" onPress={handleSave} />
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  formContainer: {
    gap: 32,
    paddingBottom: 40,
  },
  field: {
    gap: 8,
  },
  chubbyButton: {
    paddingHorizontal: 24,
    height: 60,
    borderRadius: 999,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chubbyButtonText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
  },
  iosDatePickerContainer: {
    alignItems: 'flex-start',
    marginLeft: -8, // Slight offset to align with inputs
  },
  footer: {
    marginTop: 16,
  },
});
