import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onPress?: () => void;
}

interface PaywallScreenProps {
  onClose?: () => void;
  onSelectPlan?: (planId: string) => void;
}

const PaywallScreen: React.FC<PaywallScreenProps> = ({ onClose, onSelectPlan }) => {
  const theme = useAppTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'Always',
      description: 'Get started with basic features',
      features: [
        '✓ 10 messages per day',
        '✓ Basic chat features',
        '✓ Standard response time',
        '✗ No voice input',
        '✗ No priority support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$4.99',
      period: '/month',
      description: 'Unlock all features',
      features: [
        '✓ Unlimited messages',
        '✓ Voice input & transcription',
        '✓ Faster response times',
        '✓ Ad-free experience',
        '✓ Priority support',
        '✓ Early access to new features',
      ],
      isPopular: true,
    },
    {
      id: 'annual',
      name: 'Pro Annual',
      price: '$49.99',
      period: '/year',
      description: 'Best value - Save 17%',
      features: [
        '✓ All Pro features',
        '✓ Annual billing save',
        '✓ Priority support',
        '✓ Exclusive content',
        '✓ Lifetime discount',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    onSelectPlan?.(planId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Upgrade to Pro
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.icon }]}>
            Unlock unlimited conversations and premium features
          </Text>
        </View>

        {/* Pricing Cards */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => handleSelectPlan(plan.id)}
              activeOpacity={0.7}
              style={[
                styles.planCard,
                {
                  borderColor: selectedPlan === plan.id ? '#4CAF50' : '#e0e0e0',
                  borderWidth: selectedPlan === plan.id ? 2 : 1,
                  backgroundColor:
                    plan.isPopular && selectedPlan !== plan.id
                      ? '#F5F5F5'
                      : selectedPlan === plan.id
                      ? '#E8F5E9'
                      : theme.colors.card,
                },
              ]}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}

              <Text style={[styles.planName, { color: theme.colors.text }]}>
                {plan.name}
              </Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={[styles.planPeriod, { color: theme.colors.icon }]}>
                {plan.period}
              </Text>
              <Text style={[styles.planDescription, { color: theme.colors.icon }]}>
                {plan.description}
              </Text>

              {/* Features List */}
              <View style={styles.featuresListContainer}>
                {plan.features.map((feature, index) => (
                  <Text
                    key={index}
                    style={[styles.feature, { color: theme.colors.text }]}
                  >
                    {feature}
                  </Text>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  {
                    backgroundColor:
                      selectedPlan === plan.id ? '#4CAF50' : '#f0f0f0',
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedPlan === plan.id ? '#fff' : '#666',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comparison Table */}
        <View style={styles.comparisonSection}>
          <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
            Feature Comparison
          </Text>

          <View style={styles.comparisonTable}>
            <View style={styles.comparisonRow}>
              <Text style={[styles.comparisonLabel, { color: theme.colors.text }]}>
                Daily Messages
              </Text>
              <Text style={styles.comparisonCell}>10</Text>
              <Text style={styles.comparisonCell}>Unlimited</Text>
              <Text style={styles.comparisonCell}>Unlimited</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={[styles.comparisonLabel, { color: theme.colors.text }]}>
                Voice Input
              </Text>
              <Text style={styles.comparisonCell}>✗</Text>
              <Text style={styles.comparisonCell}>✓</Text>
              <Text style={styles.comparisonCell}>✓</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={[styles.comparisonLabel, { color: theme.colors.text }]}>
                Ad-Free
              </Text>
              <Text style={styles.comparisonCell}>✗</Text>
              <Text style={styles.comparisonCell}>✓</Text>
              <Text style={styles.comparisonCell}>✓</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={[styles.comparisonLabel, { color: theme.colors.text }]}>
                Priority Support
              </Text>
              <Text style={styles.comparisonCell}>✗</Text>
              <Text style={styles.comparisonCell}>✓</Text>
              <Text style={styles.comparisonCell}>✓</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={[styles.comparisonLabel, { color: theme.colors.text }]}>
                Early Access
              </Text>
              <Text style={styles.comparisonCell}>✗</Text>
              <Text style={styles.comparisonCell}>✓</Text>
              <Text style={styles.comparisonCell}>✓</Text>
            </View>
          </View>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            alert(`Subscribed to ${plans.find((p) => p.id === selectedPlan)?.name}`);
          }}
        >
          <Text style={styles.subscribeButtonText}>
            Continue with {plans.find((p) => p.id === selectedPlan)?.name}
          </Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={[styles.footerText, { color: theme.colors.icon }]}>
          Subscription auto-renews. Cancel anytime in settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    paddingTop: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 12,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 12,
    marginBottom: 16,
  },
  featuresListContainer: {
    marginBottom: 16,
    gap: 8,
  },
  feature: {
    fontSize: 13,
    lineHeight: 18,
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  comparisonSection: {
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  comparisonTable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  comparisonLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  comparisonCell: {
    flex: 0.8,
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },
  subscribeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PaywallScreen;
