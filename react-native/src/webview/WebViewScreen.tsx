import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';

const WebViewScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');

  const styles = createStyles(colors);

  const handleGo = () => {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    setCurrentUrl(formattedUrl);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button and URL input */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={
              isDark
                ? require('../assets/back_dark.png')
                : require('../assets/back.png')
            }
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.urlInput}
          value={url}
          onChangeText={setUrl}
          placeholder="Enter website URL"
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleGo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        
        <TouchableOpacity onPress={handleGo} style={styles.goButton}>
          <Image
            source={
              isDark
                ? require('../assets/send_dark.png')
                : require('../assets/send.png')
            }
            style={styles.goIcon}
          />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: currentUrl }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        onLoadStart={(syntheticEvent) => {
          const { url } = syntheticEvent.nativeEvent;
          setUrl(url);
        }}
        onLoadEnd={(syntheticEvent) => {
          const { url } = syntheticEvent.nativeEvent;
          setUrl(url);
        }}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    backButton: {
      padding: 8,
      marginRight: 10,
    },
    backIcon: {
      width: 24,
      height: 24,
    },
    urlInput: {
      flex: 1,
      height: 40,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      paddingHorizontal: 12,
      color: colors.text,
      fontSize: 14,
    },
    goButton: {
      padding: 8,
      marginLeft: 10,
    },
    goIcon: {
      width: 24,
      height: 24,
    },
    webview: {
      flex: 1,
    },
  });

export default WebViewScreen;
