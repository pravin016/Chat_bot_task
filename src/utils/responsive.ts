import { Dimensions, PixelRatio, Platform } from 'react-native';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard iPhone 11/12 scale
const scale = SCREEN_WIDTH / 375;

export function normalizeScale(size: number) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function wp(percentage: number) {
  return (SCREEN_WIDTH * percentage) / 100;
}

export function hp(percentage: number) {
  return (SCREEN_HEIGHT * percentage) / 100;
}

export { RFValue, RFPercentage };
