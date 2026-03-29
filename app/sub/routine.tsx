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

const ROUTINE_DATA = [
  { id: '1', time: 'Morning', title: 'Gentle Cleanser', desc: 'Wash face with cold water and gentle cleanser.', icon: 'sun' },
  { id: '2', time: 'Morning', title: 'Vitamin C Serum', desc: 'Apply evenly across face to brighten skin.', icon: 'droplet' },
  { id: '3', time: 'Morning', title: 'Sunscreen SPF 50', desc: 'Crucial step. Never skip this.', icon: 'shield' },
  { id: '4', time: 'Evening', title: 'Double Cleanse', desc: 'Use oil-based cleanser then water-based.', icon: 'moon' },
  { id: '5', time: 'Evening', title: 'Retinol', desc: 'Apply pea-sized amount avoiding eyes.', icon: 'star' },
  { id: '6', time: 'Evening', title: 'Heavy Moisturizer', desc: 'Lock everything in with a rich cream.', icon: 'cloud' },
];

export default function RoutineScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  // This screen displays the user's hardcoded skincare routine
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={[styles.header, { borderBottomColor: theme.colors.border, paddingTop: 60 }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Routine</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.list}>
        {ROUTINE_DATA.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInUp.delay(index * 100).springify()} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.tint + '1a' }]}>
              <Feather name={item.icon as any} size={24} color={theme.colors.tint} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.timeLabel, { color: theme.colors.tint }]}>{item.time}</Text>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
              <Text style={[styles.cardDesc, { color: theme.colors.icon }]}>{item.desc}</Text>
            </View>
          </Animated.View>
        ))}
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
  list: { padding: 20, gap: 16, paddingBottom: 100 },
  card: {
    flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center'
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16
  },
  cardContent: { flex: 1 },
  timeLabel: { fontSize: RFValue(12), fontFamily: 'System', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { fontSize: RFValue(16), fontFamily: 'System', fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: RFValue(13), lineHeight: 20 },
});
