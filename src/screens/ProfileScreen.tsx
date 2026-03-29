import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import PaywallModal from '../components/PaywallModal';
import { useAppTheme } from '../hooks/useAppTheme';
import { supabase } from '../lib/supabase';
import { logout } from '../store/authSlice';

const ProfileScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userEmail] = useState('user@gmail.com');

  const handleUpgradePress = () => {
    setShowPaywall(true);
  };

  const handlePlanSelect = (planId: string) => {
    if (planId !== 'free') {
      setIsPro(true);
      alert('Thank you for upgrading to Pro! ✨');
      setShowPaywall(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              console.log('[Auth] Signing out...');
              await supabase.auth.signOut();
              dispatch(logout());
              router.replace('/login');
            } catch (error) {
              console.error('[Auth] Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Profile
        </Text>

        {/* Pro Member Card */}
        <TouchableOpacity
          onPress={handleUpgradePress}
          activeOpacity={0.7}
          style={[
            styles.proBannerCard,
            {
              backgroundColor: isPro ? '#E8F5E9' : '#FFF3E0',
              borderColor: isPro ? '#4CAF50' : '#FF9800',
            },
          ]}
        >
          <View style={styles.proBannerContent}>
            <Text style={styles.proBannerEmoji}>
              {isPro ? '👑' : '✨'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.proBannerTitle,
                  { color: isPro ? '#2E7D32' : '#E65100' },
                ]}
              >
                {isPro ? 'Pro Member' : 'Unlock Pro'}
              </Text>
              <Text
                style={[
                  styles.proBannerSubtitle,
                  { color: isPro ? '#558B2F' : '#F57C00' },
                ]}
              >
                {isPro
                  ? 'Enjoy unlimited features'
                  : 'Get unlimited messages & voice input'}
              </Text>
            </View>
            <Text style={styles.proBannerArrow}>→</Text>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresPreview}>
            {(isPro
              ? [
                  '✓ Unlimited messages',
                  '✓ Voice transcription',
                  '✓ Priority support',
                ]
              : [
                  '• Unlimited messages',
                  '• Voice input (tap 🎤)',
                  '• Ad-free',
                ]
            ).map((feature, index) => (
              <Text
                key={index}
                style={[
                  styles.featureText,
                  { color: isPro ? '#2E7D32' : '#E65100' },
                ]}
              >
                {feature}
              </Text>
            ))}
          </View>

          {!isPro && (
            <TouchableOpacity
              style={[
                styles.upgradeButton,
                { backgroundColor: '#FF9800' },
              ]}
            >
              <Text style={styles.upgradeButtonText}>
                Upgrade Now - $4.99/month
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>

          <View
            style={[
              styles.accountCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <View style={styles.accountRow}>
              <Text style={[styles.accountLabel, { color: theme.colors.icon }]}>
                Email
              </Text>
              <Text style={[styles.accountValue, { color: theme.colors.text }]}>
                {userEmail}
              </Text>
            </View>

            <View
              style={[
                styles.accountRow,
                { borderTopWidth: 1, borderTopColor: '#e0e0e0' },
              ]}
            >
              <Text style={[styles.accountLabel, { color: theme.colors.icon }]}>
                Subscription
              </Text>
              <Text
                style={[
                  styles.accountValue,
                  { color: isPro ? '#4CAF50' : theme.colors.icon },
                  { fontWeight: 'bold' },
                ]}
              >
                {isPro ? 'Pro' : 'Free'}
              </Text>
            </View>

            <View
              style={[
                styles.accountRow,
                { borderTopWidth: 1, borderTopColor: '#e0e0e0' },
              ]}
            >
              <Text style={[styles.accountLabel, { color: theme.colors.icon }]}>
                Member Since
              </Text>
              <Text style={[styles.accountValue, { color: theme.colors.text }]}>
                Mar 2026
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>

          <View style={[styles.menuButton, { backgroundColor: theme.colors.card }]}>
            <Text style={{ fontSize: 18 }}>🌟</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Theme Settings
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>

          <View
            style={[
              styles.menuButton,
              { backgroundColor: theme.colors.card, marginTop: 8 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Notifications
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>

          <View
            style={[
              styles.menuButton,
              { backgroundColor: theme.colors.card, marginTop: 8 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📱</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Language
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>

          <View style={[styles.menuButton, { backgroundColor: theme.colors.card }]}>
            <Text style={{ fontSize: 18 }}>❓</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Help & FAQ
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>

          <View
            style={[
              styles.menuButton,
              { backgroundColor: theme.colors.card, marginTop: 8 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📧</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Contact Support
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>

          <View
            style={[
              styles.menuButton,
              { backgroundColor: theme.colors.card, marginTop: 8 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>📋</Text>
            <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>
              Terms & Privacy
            </Text>
            <Text style={[styles.menuArrow, { color: theme.colors.icon }]}>
              →
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: '#FF6B6B' }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Paywall Modal */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={handlePlanSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 8,
  },
  proBannerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  proBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  proBannerEmoji: {
    fontSize: 32,
  },
  proBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  proBannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  proBannerArrow: {
    fontSize: 20,
    opacity: 0.6,
  },
  featuresPreview: {
    gap: 6,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  upgradeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  accountCard: {
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accountLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 13,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  menuButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 14,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProfileScreen;