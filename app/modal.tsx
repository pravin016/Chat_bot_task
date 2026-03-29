import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const STACK = [
  'Expo + React Native + Expo Router',
  'FastAPI backend with Gemini API',
  'Supabase Auth + Postgres + RLS',
  'RevenueCat paywall (Weekly + Yearly)',
  'Sentry backend monitoring + alerts',
  'Ngrok tunnel for mobile testing',
];

const FEATURES = [
  'Auth + profile + subscription state',
  'Offline-aware chat experience',
  'AI avatar chat interface',
  'Polished dark theme and micro-interactions',
];

export default function ModalScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings & About</Text>
      <Text style={styles.subtitle}>Aurora AI Chatbot Assignment Build</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tech Stack</Text>
        {STACK.map((item) => (
          <Text key={item} style={styles.item}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Product Highlights</Text>
        {FEATURES.map((item) => (
          <Text key={item} style={styles.item}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reviewer Notes</Text>
        <Text style={styles.item}>
          Sign in from Profile tab, purchase Weekly or Yearly in sandbox, then chat from Chat tab.
          Backend requests are authenticated and logged to Supabase with Sentry monitoring enabled.
        </Text>
      </View>

      <Link href="/(tabs)/profile" dismissTo style={styles.link}>
        <Text style={styles.linkText}>Back to Profile</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050816',
  },
  container: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A8B4D7',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#10182D',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#24385F',
  },
  sectionTitle: {
    color: '#DDE9FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  item: {
    color: '#C5D3F3',
    lineHeight: 21,
    marginBottom: 4,
  },
  link: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#5A8CFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  linkText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
