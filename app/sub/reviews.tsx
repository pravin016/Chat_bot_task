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
import { Ionicons } from '@expo/vector-icons';

const REVIEWS = [
  { id: '1', product: 'Hydrating Cleanser X', rating: 5, text: 'Absolutely love this! Helped clear my acne within 2 weeks.', date: 'Oct 12, 2025' },
  { id: '2', product: 'Vitamin C Glow Serum', rating: 4, text: 'Good texture, smells nice, but slightly sticky before it dries.', date: 'Sep 28, 2025' },
  { id: '3', product: 'Matte Sunscreen SPF 50', rating: 5, text: 'No white cast and works perfectly under makeup.', date: 'Aug 04, 2025' },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  // This component renders hardcoded reviews for the assignment showcase
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={[styles.header, { borderBottomColor: theme.colors.border, paddingTop: 60 }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Reviews</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.list}>
        {REVIEWS.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInUp.delay(index * 150).springify()} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.productName, { color: theme.colors.text }]}>{item.product}</Text>
              <Text style={[styles.dateText, { color: theme.colors.icon }]}>{item.date}</Text>
            </View>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={[styles.reviewText, { color: theme.colors.text }]}>"{item.text}"</Text>
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
    padding: 16, borderRadius: 16, borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  productName: { fontSize: RFValue(16), fontFamily: 'System', fontWeight: 'bold', flex: 1, marginRight: 8 },
  dateText: { fontSize: RFValue(12), fontFamily: 'System' },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 12 },
  reviewText: { fontSize: RFValue(14), lineHeight: 22, fontStyle: 'italic' },
});
