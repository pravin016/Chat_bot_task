import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import PaywallScreen from '../screens/PaywallScreen';
import {
  getOfferings,
  purchasePackage,
  checkSubscriptionStatus,
} from '../services/revenuecat';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  onSelectPlan,
}) => {
  const [offerings, setOfferings] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(
    null
  );
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadOfferings();
    }
  }, [visible]);

  const loadOfferings = async () => {
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        setLoading(true);
        const data = await getOfferings();
        
        if (data?.current) {
          setOfferings(data.current);
          // Pre-select the most popular package (Pro monthly)
          const proPackage = data.current.availablePackages.find((pkg) =>
            pkg.identifier.includes('pro') && !pkg.identifier.includes('annual')
          );
          if (proPackage) {
            setSelectedPackage(proPackage);
          }
          console.log('[Paywall] Offerings loaded successfully');
          return; // Success, exit loop
        } else if (retries < maxRetries - 1) {
          console.log(`[Paywall] No offerings, retrying... (${retries + 1}/${maxRetries})`);\n          await new Promise(resolve => setTimeout(resolve, 500));
          retries++;
        } else {
          throw new Error('Failed to load offerings after retries');
        }
      } catch (error) {
        console.error(`[Paywall] Error loading offerings (attempt ${retries + 1}):`, error);
        if (retries === maxRetries - 1) {
          Alert.alert('Error', 'Failed to load pricing information. Please try again.');
        }
        retries++;
      } finally {
        if (retries >= maxRetries || data?.current) {
          setLoading(false);
        }
      }
    }
  };

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a plan');
      return;
    }

    try {
      setIsPurchasing(true);
      const result = await purchasePackage(selectedPackage);

      if (result.success) {
        // Verify subscription status
        const status = await checkSubscriptionStatus();
        Alert.alert(
          '🎉 Success!',
          'Welcome to Pro! Enjoy unlimited messages and all premium features.',
          [
            {
              text: 'OK',
              onPress: () => {
                onSelectPlan?.(status);
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Purchase Failed', 'The purchase could not be completed.');
      }
    } catch (error) {
      console.error('[Paywall] Purchase error:', error);
      Alert.alert('Error', 'An error occurred during purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <PaywallScreen
          onClose={onClose}
          onSelectPlan={handleSelectPackage}
          offerings={offerings}
          selectedPackage={selectedPackage}
          onPurchase={handlePurchase}
          isLoading={loading || isPurchasing}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaywallModal;
