import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ComingSoon } from '../../src/components/common/ComingSoon';
import { useAppSelector } from '../../src/store/hooks';
import { useAppTheme } from '../../src/hooks/useAppTheme';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ScrollView, Text } from 'react-native';
import { RFValue } from '../../src/utils/responsive';

export default function TermsScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  // This screen provides terms of service
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={[styles.header, { borderBottomColor: theme.colors.border, paddingTop: 60 }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.list}>
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Text style={[styles.title, { color: theme.colors.text }]}>1. General Acceptance</Text>
          <Text style={[styles.bodyText, { color: theme.colors.icon }]}>By using this app, you agree to these Terms. Do not use the app if you disagree with any conditions.</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={{ marginTop: 24 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>2. Medical Disclaimer</Text>
          <Text style={[styles.bodyText, { color: theme.colors.icon }]}>Helper Cane provides AI-based recommendations and does not substitute professional medical advice. Always consult a certified dermatologist.</Text>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(300).springify()} style={{ marginTop: 24 }}>
          <Text style={[styles.title, { color: theme.colors.text }]}>3. Pro Subscription</Text>
          <Text style={[styles.bodyText, { color: theme.colors.icon }]}>Payments are processed via RevenueCat and managed via your respective App Store. Auto-renewable subscriptions apply.</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: RFValue(18), fontFamily: 'System', fontWeight: '600' },
  list: { padding: 24, paddingBottom: 100 },
  title: { fontSize: RFValue(18), fontFamily: 'System', fontWeight: 'bold', marginBottom: 8 },
  bodyText: { fontSize: RFValue(15), lineHeight: 24 },
});
