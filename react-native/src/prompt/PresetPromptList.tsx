import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme, ColorScheme } from '../theme';
import { PRESET_PROMPTS, PROMPT_CATEGORIES, PresetPrompt } from './PresetPrompts';
import { useAppContext } from '../history/AppProvider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Drawer: undefined;
  TokenUsage: undefined;
  Prompt: { prompt?: any };
  PresetPrompts: undefined;
};

type PresetPromptListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PresetPromptListProps {}

const PresetPromptList: React.FC<PresetPromptListProps> = () => {
  const navigation = useNavigation<PresetPromptListNavigationProp>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { sendEvent } = useAppContext();

  const filteredPrompts = selectedCategory === 'All' 
    ? PRESET_PROMPTS 
    : PRESET_PROMPTS.filter(prompt => prompt.category === selectedCategory);

  const handlePromptSelect = (prompt: PresetPrompt) => {
    // Create a new chat session with the selected prompt
    sendEvent('startNewChatWithPrompt', { prompt });

    // Send the preset prompt data via the event system
    sendEvent('navigateToBedrockWithPrompt', {
      sessionId: Date.now(),
      presetPrompt: prompt,
    });
    
   // Navigate back to the drawer
    navigation.goBack();
     };
     
  const renderPromptItem = ({ item }: { item: PresetPrompt }) => (
    <TouchableOpacity
      style={styles.promptItem}
      onPress={() => handlePromptSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
      </View>
      <View style={styles.promptContent}>
        <Text style={styles.promptName}>{item.name}</Text>
        <Text style={styles.promptDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Pilih Dibawah Ini</Text>
      
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {PROMPT_CATEGORIES.map(renderCategoryButton)}
      </ScrollView>

      {/* Prompt List */}
      <FlatList
        data={filteredPrompts}
        renderItem={renderPromptItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.promptList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginVertical: 16,
    },
    categoryContainer: {
      maxHeight: 50,
      marginBottom: 16,
    },
    categoryContent: {
      paddingHorizontal: 16,
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedCategoryButton: {
      backgroundColor: colors.promptScreenSaveButton,
      borderColor: colors.promptScreenSaveButton,
    },
    categoryText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    selectedCategoryText: {
      color: colors.promptScreenSaveButtonText,
    },
    promptList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    promptItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 12,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatar: {
      fontSize: 24,
    },
    promptContent: {
      flex: 1,
    },
    promptName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    promptDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

export default PresetPromptList;
