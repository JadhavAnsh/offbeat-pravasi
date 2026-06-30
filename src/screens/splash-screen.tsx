import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { BrandMark } from '@/components/brand-mark';

export function SplashScreen() {
  const router = useRouter();
  const drift = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!reduced && mounted) {
        drift.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.sin) }), -1, true);
      }
    });
    const timeout = setTimeout(() => router.replace('/auth'), 2100);
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [drift, router]);

  const markStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drift.value * -7 }] }));

  return (
    <View style={styles.container}>
      <View style={[styles.contour, styles.contourOne]} />
      <View style={[styles.contour, styles.contourTwo]} />
      <Animated.View entering={FadeIn.duration(500)} style={markStyle}>
        <BrandMark size={104} inverted />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(180).duration(500)} style={styles.copy}>
        <Text style={styles.kicker}>OFFBEAT</Text>
        <Text style={styles.title}>Pravasi</Text>
        <Text style={styles.tagline}>Find the road less scrolled.</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(650).duration(400)} style={styles.footer}>
        <View style={styles.dot} />
        <Text style={styles.footerText}>MADE FOR CURIOUS TRAVELLERS</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#173D2B', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  contour: { position: 'absolute', borderWidth: 1, borderColor: 'rgba(248,243,232,0.13)', borderRadius: 999 },
  contourOne: { width: 520, height: 520, transform: [{ rotate: '-12deg' }] },
  contourTwo: { width: 350, height: 640, transform: [{ rotate: '38deg' }] },
  copy: { alignItems: 'center', paddingTop: 26 },
  kicker: { color: '#F4B08B', fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: 4 },
  title: { color: '#F8F3E8', fontSize: 48, lineHeight: 54, fontWeight: '800', letterSpacing: -1.5 },
  tagline: { color: 'rgba(248,243,232,0.7)', fontSize: 15, paddingTop: 7, letterSpacing: 0.2 },
  footer: { position: 'absolute', bottom: 54, flexDirection: 'row', alignItems: 'center', gap: 9 },
  dot: { width: 5, height: 5, borderRadius: 999, backgroundColor: '#F28C5B' },
  footerText: { color: 'rgba(248,243,232,0.55)', fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
});
