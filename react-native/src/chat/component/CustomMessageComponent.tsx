import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Share from 'react-native-share';
import { MessageProps } from 'react-native-gifted-chat';
import { CustomMarkdownRenderer } from './markdown/CustomMarkdownRenderer.tsx';
import { MarkedStyles } from 'react-native-marked/src/theme/types.ts';
import { ChatStatus, PressMode, SwiftChatMessage } from '../../types/Chat.ts';
import { trigger } from '../util/HapticUtils.ts';
import { HapticFeedbackTypes } from 'react-native-haptic-feedback/src/types.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  CustomFileListComponent,
  DisplayMode,
} from './CustomFileListComponent.tsx';
import FileViewer from 'react-native-file-viewer';
import { isMac } from '../../App.tsx';
import { CustomTokenizer } from './markdown/CustomTokenizer.ts';
import Markdown from './markdown/Markdown.tsx';
import ImageSpinner from './ImageSpinner.tsx';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { getModelIcon, getModelTagByUserName } from '../../utils/ModelUtils.ts';
import { isAndroid } from '../../utils/PlatformUtils.ts';
import { useAppContext } from '../../history/AppProvider.tsx';
import { useTheme, ColorScheme } from '../../theme';

interface CustomMessageProps extends MessageProps<SwiftChatMessage> {
  chatStatus: ChatStatus;
  isLastAIMessage?: boolean;
  onRegenerate?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const CustomMessageComponent: React.FC<CustomMessageProps> = ({
  currentMessage,
  chatStatus,
  isLastAIMessage,
  onRegenerate,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [copied, setCopied] = useState(false);
  const [clickTitleCopied, setClickTitleCopied] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [inputHeight, setInputHeight] = useState(0);
  const chatStatusRef = useRef(chatStatus);
  const textInputRef = useRef<TextInput>(null);
  const [inputTextSelection, setInputTextSelection] = useState<
    { start: number; end: number } | undefined
  >(undefined);
  const isLoading =
    chatStatus === ChatStatus.Running && currentMessage?.text === '...';
  const [forceShowButtons, setForceShowButtons] = useState(false);
  const isUser = useRef(currentMessage?.user?._id === 1);
  const { drawerType } = useAppContext();
  const chatScreenWidth =
    isMac && drawerType === 'permanent' ? screenWidth - 300 : screenWidth;

  const setIsEditValue = useCallback(
    (value: boolean) => {
      if (chatStatus !== ChatStatus.Running) {
        setIsEdit(value);
        if (!value) {
          setInputTextSelection(undefined);
        }
      }
    },
    [chatStatus]
  );

  // Use useEffect with setTimeout to ensure selection happens after TextInput is fully rendered
  useEffect(() => {
    if (!isAndroid && isEdit && currentMessage?.text) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
        setInputTextSelection({
          start: 0,
          end: currentMessage.text.length,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEdit, currentMessage?.text]);

  const toggleButtons = useCallback(() => {
    setForceShowButtons(prev => !prev);
  }, []);

  // Handle selection changes made by the user
  const handleSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      const { selection } = event.nativeEvent;
      setInputTextSelection(selection);
    },
    []
  );

  const handleCopy = useCallback(() => {
    const copyText = currentMessage?.reasoning
      ? 'Reasoning: ' +
          currentMessage.reasoning +
          '\n\n' +
          currentMessage?.text || ''
      : currentMessage?.text || '';
    Clipboard.setString(copyText);
  }, [currentMessage?.reasoning, currentMessage?.text]);

  const currentUser = currentMessage?.user;
  const showRefresh =
    !isUser.current && !currentUser?.name?.includes('Nova Sonic');

  const userInfo = useMemo(() => {
    if (!currentMessage || !currentMessage.user) {
      return {
        userName: '',
        modelIcon: isDark
          ? require('../../assets/broperty_dark.png')
          : require('../../assets/broperty.png'),
        avatarEmoji: null,
      };
    }
    const user = currentMessage.user;
    const userName = user.name ?? 'Broperty Ai';
    const currentModelTag = getModelTagByUserName(user.modelTag, userName);

    const modelIcon = getModelIcon(currentModelTag, undefined, isDark);
    const avatarEmoji = user.avatar || null;
    return { userName, modelIcon, avatarEmoji };
  }, [currentMessage, isDark]);

  const headerContent = useMemo(() => {
    return (
      <>
       {userInfo.avatarEmoji ? (
          <View style={styles.avatarEmojiContainer}>
            <Text style={styles.avatarEmoji}>{userInfo.avatarEmoji}</Text>
          </View>
        ) : (
          <Image source={userInfo.modelIcon} style={styles.avatar} />
        )}
        <Text style={styles.name}>{userInfo.userName}</Text>
      </>
    );
   }, [userInfo, styles.avatar, styles.name, styles.avatarEmojiContainer, styles.avatarEmoji]);

  const copyButton = useMemo(() => {
    return clickTitleCopied ? (
      <Image
        source={
          isDark
            ? require('../../assets/done_dark.png')
            : require('../../assets/done.png')
        }
        style={styles.copy}
      />
    ) : null;
  }, [clickTitleCopied, isDark, styles.copy]);

  const handleImagePress = useCallback((pressMode: PressMode, url: string) => {
    if (pressMode === PressMode.Click) {
      FileViewer.open(url)
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    } else if (pressMode === PressMode.LongPress) {
      trigger(HapticFeedbackTypes.notificationSuccess);
      const shareOptions = { url: url, type: 'image/png', title: 'AI Image' };
      Share.open(shareOptions)
        .then(res => console.log(res))
        .catch(err => err && console.log(err));
    }
  }, []);

  const customMarkdownRenderer = useMemo(
    () => new CustomMarkdownRenderer(handleImagePress, colors, isDark),
    [handleImagePress, colors, isDark]
  );

  const customTokenizer = useMemo(() => new CustomTokenizer(), []);

  const reasoningSection = useMemo(() => {
    if (
      !currentMessage?.reasoning ||
      currentMessage?.reasoning.length === 0 ||
      isUser.current
    ) {
      return null;
    }

    return (
      <View style={styles.reasoningContainer}>
        <View style={styles.reasoningHeader}>
          <Text style={styles.reasoningTitle}>Reasoning</Text>
        </View>

        <View style={styles.reasoningContent}>
          <Markdown
            value={currentMessage.reasoning}
            flatListProps={{
              style: {
                backgroundColor: colors.reasoningBackground,
              },
            }}
            styles={customMarkedStyles}
            renderer={customMarkdownRenderer}
            tokenizer={customTokenizer}
            chatStatus={chatStatusRef.current}
          />
        </View>
      </View>
    );
  }, [
    currentMessage,
    customMarkdownRenderer,
    customTokenizer,
    colors.reasoningBackground,
    styles.reasoningContainer,
    styles.reasoningHeader,
    styles.reasoningTitle,
    styles.reasoningContent,
  ]);

  const handleShowButton = useCallback(() => {
    if (!isLoading) {
      toggleButtons();
    }
  }, [isLoading, toggleButtons]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (clickTitleCopied) {
      handleCopy();
      const timer = setTimeout(() => {
        setClickTitleCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [handleCopy, clickTitleCopied]);

  const messageContent = useMemo(() => {
    if (!currentMessage) {
      return null;
    }

    if (!isUser.current) {
      return (
        <Markdown
          value={currentMessage.text}
          styles={customMarkedStyles}
          renderer={customMarkdownRenderer}
          tokenizer={customTokenizer}
          chatStatus={chatStatusRef.current}
        />
      );
    }

    return (
      <Text
        style={{
          ...styles.questionText,
          ...{ maxWidth: (chatScreenWidth * 3) / 4 },
        }}
        selectable>
        {currentMessage.text}
      </Text>
    );
  }, [
    currentMessage,
    customMarkdownRenderer,
    customTokenizer,
    chatScreenWidth,
    styles.questionText,
  ]);

  const messageActionButtons = useMemo(() => {
    const metricsText = currentMessage?.metrics
      ? `latency ${currentMessage.metrics.latencyMs}s | ${currentMessage.metrics.speed} tok/s`
      : null;
    return (
      <View
        style={{
          ...styles.actionButtonsContainer,
          ...{ justifyContent: isUser.current ? 'flex-end' : 'space-between' },
        }}>
        <View style={styles.actionButtonInnerContainer}>
          <TouchableOpacity
            onPress={() => {
              handleCopy();
              setCopied(true);
            }}
            style={styles.actionButton}>
            <Image
              source={
                copied
                  ? isDark
                    ? require('../../assets/done_dark.png')
                    : require('../../assets/done.png')
                  : require('../../assets/copy_grey.png')
              }
              style={styles.actionButtonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsEditValue(!isEdit)}
            style={styles.actionButton}>
            <Image
              source={
                isEdit
                  ? isDark
                    ? require('../../assets/select_dark.png')
                    : require('../../assets/select.png')
                  : require('../../assets/select_grey.png')
              }
              style={styles.actionButtonIcon}
            />
          </TouchableOpacity>

          {showRefresh && (
            <TouchableOpacity
              onPress={onRegenerate}
              style={styles.actionButton}>
              <Image
                source={require('../../assets/refresh.png')}
                style={styles.actionButtonIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {metricsText && !isUser.current && (
          <Text style={styles.metricsText}>{metricsText}</Text>
        )}
      </View>
    );
  }, [
    handleCopy,
    copied,
    isEdit,
    onRegenerate,
    setIsEditValue,
    showRefresh,
    currentMessage?.metrics,
    isDark,
    styles.actionButtonsContainer,
    styles.actionButtonInnerContainer,
    styles.actionButton,
    styles.actionButtonIcon,
    styles.metricsText,
  ]);

  if (!currentMessage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={1}
        onPress={() => setClickTitleCopied(true)}>
        {!isUser.current && headerContent}
        {copyButton}
      </TouchableOpacity>
      <View style={styles.marked_box}>
        {isLoading && (
          <View style={styles.loading}>
            <ImageSpinner
              visible={true}
              size={18}
              source={require('../../assets/loading.png')}
            />
          </View>
        )}
        {!isLoading && reasoningSection}
        {!isLoading && !isEdit && (
          <TapGestureHandler
            numberOfTaps={2}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                handleShowButton();
              }
            }}>
            <View>{messageContent}</View>
          </TapGestureHandler>
        )}
        {isEdit && (
          <TextInput
            ref={textInputRef}
            selection={inputTextSelection}
            onSelectionChange={handleSelectionChange}
            editable={Platform.OS === 'android'}
            multiline
            showSoftInputOnFocus={false}
            onContentSizeChange={event => {
              const { height } = event.nativeEvent.contentSize;
              setInputHeight(height);
            }}
            style={{
              ...styles.inputText,
              ...{
                fontWeight: isMac ? '300' : 'normal',
                lineHeight: isMac ? 26 : Platform.OS === 'android' ? 24 : 28,
                paddingTop: Platform.OS === 'android' ? 7 : 3,
                marginBottom:
                  -inputHeight * (isAndroid ? 0 : isMac ? 0.115 : 0.138) +
                  (isMac ? 10 : 8),
              },
              ...(isUser.current && {
                flex: 1,
                alignSelf: 'flex-end',
                maxWidth: (chatScreenWidth * 3) / 4,
              }),
            }}
            textAlignVertical="top">
            {currentMessage.text}
          </TextInput>
        )}
        {((isLastAIMessage && chatStatus !== ChatStatus.Running) ||
          forceShowButtons) &&
          messageActionButtons}
        {currentMessage.image && (
          <CustomFileListComponent
            files={JSON.parse(currentMessage.image)}
            mode={DisplayMode.Display}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      marginLeft: 12,
      marginVertical: 4,
    },
    marked_box: {
      marginLeft: 28,
      marginRight: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 22,
      height: 22,
      borderRadius: 11,
      marginRight: 6,
    },
     avatarEmojiContainer: {
      width: 22,
      height: 22,
      borderRadius: 11,
      marginRight: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
    },
    avatarEmoji: {
      fontSize: 14,
    },
    copy: {
      width: 18,
      height: 18,
      marginRight: 20,
      marginLeft: 'auto',
    },
    name: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    questionText: {
      flex: 1,
      alignSelf: 'flex-end',
      backgroundColor: colors.messageBackground,
      borderRadius: 22,
      overflow: 'hidden',
      marginVertical: 8,
      paddingHorizontal: 16,
      lineHeight: 24,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
    },
    inputText: {
      fontSize: 16,
      lineHeight: 26,
      textAlignVertical: 'top',
      marginTop: 1,
      padding: 0,
      fontWeight: '300',
      color: colors.text,
      letterSpacing: 0,
    },
    reasoningContainer: {
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: colors.reasoningBackground,
      overflow: 'hidden',
      marginTop: 8,
    },
    reasoningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      backgroundColor: colors.borderLight,
    },
    reasoningTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    reasoningContent: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    loading: {
      marginTop: 12,
      marginBottom: 10,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -8,
      marginTop: -2,
      marginBottom: 4,
    },
    actionButtonInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
    },
    actionButtonIcon: {
      width: 16,
      height: 16,
    },
    metricsText: {
      fontSize: 12,
      color: colors.textTertiary,
      marginRight: 4,
    },
  });

const customMarkedStyles: MarkedStyles = {
  table: { marginVertical: 4 },
  li: { paddingVertical: 4 },
  h1: { fontSize: 28 },
  h2: { fontSize: 24 },
  h3: { fontSize: 20 },
  h4: { fontSize: 18 },
  blockquote: { marginVertical: 8 },
  paragraph: { paddingVertical: 6 },
};

export default React.memo(CustomMessageComponent, (prevProps, nextProps) => {
  return (
    prevProps.currentMessage?.text === nextProps.currentMessage?.text &&
    prevProps.currentMessage?.image === nextProps.currentMessage?.image &&
    prevProps.currentMessage?.reasoning ===
      nextProps.currentMessage?.reasoning &&
    prevProps.chatStatus === nextProps.chatStatus &&
    prevProps.isLastAIMessage === nextProps.isLastAIMessage &&
    prevProps.onRegenerate === nextProps.onRegenerate
  );
});
