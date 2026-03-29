import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { RFValue } from '../../src/utils/responsive';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SkinHairScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const InfoCard = ({ icon, title, value, index }: { icon: any, title: string, value: string, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: theme.colors.tint + '1a' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={theme.colors.tint} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.icon }]}>{title}</Text>
        <Text style={[styles.cardValue, { color: theme.colors.text }]}>{value}</Text>
      </View>
      <Feather name="check-circle" size={20} color={theme.colors.tint} />
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.springify()} style={[styles.header, { borderBottomColor: theme.colors.border, paddingTop: insets.top || 60 }]}>
        <TouchableOpacity 
          style={[styles.backBtn, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]} 
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile Details</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.completedHeader}>
          <View style={[styles.successBadge, { backgroundColor: theme.colors.tint + '22' }]}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.tint} />
            <Text style={[styles.successText, { color: theme.colors.tint }]}>Profile Completed</Text>
          </View>
          <Text style={[styles.subText, { color: theme.colors.icon }]}>Your recommendations are now personalized based on these metrics.</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <InfoCard index={1} icon="face-woman-outline" title="Skin Type" value="Combination / Sensitive" />
          <InfoCard index={2} icon="water-outline" title="Hydration Levels" value="Moderately Dry" />
          <InfoCard index={3} icon="weather-sunny" title="Sun Sensitivity" value="High (Burns Easily)" />
          <InfoCard index={4} icon="hair-dryer-outline" title="Hair Type" value="Wavy / Medium Porosity" />
          <InfoCard index={5} icon="weather-partly-cloudy" title="Climate Exposure" value="Humid / Urban" />
        </View>

        <TouchableOpacity style={[styles.editBtn, { borderColor: theme.colors.tint }]}>
          <Text style={[styles.editBtnText, { color: theme.colors.tint }]}>Retake Questionnaire</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontFamily: 'System',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
  },
  completedHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  successText: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: RFValue(14),
  },
  subText: {
    textAlign: 'center',
    fontSize: RFValue(13),
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: RFValue(12),
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: RFValue(15),
  },
  editBtn: {
    marginTop: 32,
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: RFValue(14),
  }
});
