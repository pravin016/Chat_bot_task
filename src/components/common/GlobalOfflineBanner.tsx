import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export const GlobalOfflineBanner = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline !== false) return null;

  return (
    <Animated.View 
      entering={FadeInDown.duration(400)} 
      exiting={FadeOutUp.duration(400)}
      style={styles.banner}
    >
      <Ionicons name="cloud-offline" size={16} color="#FFF" />
      <Text style={styles.text}>No internet connection. Operating offline.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444', // Red-500
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight + 5 : Constants.statusBarHeight + 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 9999,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  }
});
