import { StyleSheet, Text, View, memo } from 'react-native';
import { colors } from '../theme/colors';

const cleanMarkdown = (text: string) => {
  return text
    .replace(/\*\*/g, '') // Remove ** (bold)
    .replace(/\*/g, '')   // Remove * (italic)
    .replace(/##/g, '')   // Remove ## (heading)
    .replace(/\n\n/g, '\n'); // Normalize multiple newlines
};

const ChatBubble = memo(({ message }) => {
  const isUser = message.role === 'user';
  const cleanText = cleanMarkdown(message.text);

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.user : styles.bot,
      ]}
    >
      <Text style={styles.text}>{cleanText}</Text>
    </View>
  );
});

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    maxWidth: '75%',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.userBubble,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.botBubble,
  },
  text: {
    fontSize: 16,
  },
});