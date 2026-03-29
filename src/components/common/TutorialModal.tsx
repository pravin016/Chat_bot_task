import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsFirstLaunch } from '../../store/slices/appSlice';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Fonts } from '../../../constants/theme';
import { RFValue } from '../../utils/responsive';
import Animated, { FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';

export const TutorialModal = () => {
  const dispatch = useAppDispatch();
  const { isFirstLaunch } = useAppSelector((state) => state.app);
  const theme = useAppTheme();

  if (!isFirstLaunch) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isFirstLaunch}
    >
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(600).springify()} style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
            <View style={styles.header}>
              <Animated.View entering={FadeInUp.delay(100).springify()} style={[styles.iconCircle, { backgroundColor: theme.colors.tint + '1a' }]}>
                <Ionicons name="sparkles" size={RFValue(32)} color={theme.colors.tint} />
              </Animated.View>
              <Animated.Text entering={FadeInUp.delay(200).springify()} style={[styles.title, { color: theme.colors.text }]}>Welcome to Helper Cane!</Animated.Text>
              <Animated.Text entering={FadeInUp.delay(300).springify()} style={[styles.subtitle, { color: theme.colors.icon }]}>Your AI-powered Food & Skincare assistant.</Animated.Text>
            </View>

            <View style={styles.featureList}>
              <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.featureItem}>
                <Ionicons name="chatbubbles" size={RFValue(24)} color={theme.colors.tint} style={{ marginTop: 2 }} />
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Smart AI Chat</Text>
                  <Text style={[styles.featureDesc, { color: theme.colors.icon }]}>Ask anything about your skin routines or healthy diets. Get precise AI answers instantly.</Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.featureItem}>
                <Ionicons name="volume-high" size={RFValue(24)} color={theme.colors.tint} style={{ marginTop: 2 }} />
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Voice Mode</Text>
                  <Text style={[styles.featureDesc, { color: theme.colors.icon }]}>Tap the megaphone icon in the chat header to have the AI speak replies to you aloud.</Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.featureItem}>
                <Ionicons name="person-circle" size={RFValue(24)} color={theme.colors.tint} style={{ marginTop: 2 }} />
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Personalized Profile</Text>
                  <Text style={[styles.featureDesc, { color: theme.colors.icon }]}>Head over to the Profile tab to select your own custom mascot and save metrics!</Text>
                </View>
              </Animated.View>
            </View>

            <Animated.View entering={FadeInUp.delay(700).springify()}>
              <TouchableOpacity 
                style={[styles.btn, { backgroundColor: theme.colors.tint }]} 
                onPress={() => dispatch(setIsFirstLaunch(false))}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Let's Started</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: RFValue(64),
    height: RFValue(64),
    borderRadius: RFValue(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: RFValue(20),
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: RFValue(14),
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  featureList: {
    gap: 24,
    marginBottom: 36,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: RFValue(16),
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: RFValue(13),
    fontFamily: Fonts.regular,
    lineHeight: RFValue(20),
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: RFValue(15),
    fontFamily: Fonts.bold,
  }
});
