import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { BrandMark } from '@/components/brand-mark';

type AuthMode = 'login' | 'signup';

export function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('login');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const canScroll = contentHeight > viewportHeight + 1;

  const changeMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    void Haptics.selectionAsync();
    setMode(nextMode);
  };

  const submit = () => {
    setLoading(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      setLoading(false);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/home');
    }, 700);
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sunGlow} />
      <ScrollView
        bounces={canScroll}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={(_width, height) => setContentHeight(height)}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        scrollEnabled={canScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 22 }]}
        contentInsetAdjustmentBehavior="automatic">
        <Animated.View entering={FadeInDown.duration(450)} style={styles.brandRow}>
          <BrandMark size={48} />
          <View>
            <Text style={styles.brandName}>OffBeat Pravasi</Text>
            <Text style={styles.brandMeta}>TRAVEL DIFFERENTLY</Text>
          </View>
        </Animated.View>

        <Animated.View style={styles.card}>
          <View style={styles.headingWrap}>
            <Text style={styles.eyebrow}>{mode === 'login' ? 'WELCOME BACK' : 'YOUR NEXT CHAPTER'}</Text>
            <Text style={styles.heading}>{mode === 'login' ? 'The trail missed you.' : 'Go where stories begin.'}</Text>
            <Text style={styles.subheading}>
              {mode === 'login' ? 'Sign in and pick up where your map left off.' : 'Create an account for trips that feel truly yours.'}
            </Text>
          </View>

          <View accessibilityRole="tablist" style={styles.switcher}>
            {(['login', 'signup'] as const).map((item) => {
              const selected = mode === item;
              return (
                <AnimatedPressable
                  key={item}
                  haptic={false}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={item === 'login' ? 'Log in' : 'Sign up'}
                  onPress={() => changeMode(item)}
                  style={[styles.switchItem, selected && styles.switchItemActive]}>
                  <Text style={[styles.switchText, selected && styles.switchTextActive]}>{item === 'login' ? 'Log in' : 'Sign up'}</Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <View style={styles.form}>
            {mode === 'signup' && (
              <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)}>
                <Field icon="person-outline" label="Full name" placeholder="Your name" autoComplete="name" />
              </Animated.View>
            )}
            <Field icon="mail-outline" label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <Field
              icon="lock-closed-outline"
              label="Password"
              placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'}
              secureTextEntry={secure}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              trailing={
                <AnimatedPressable
                  hitSlop={8}
                  accessibilityLabel={secure ? 'Show password' : 'Hide password'}
                  onPress={() => setSecure((value) => !value)}
                  style={styles.eyeButton}>
                  <Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={21} color="#607265" />
                </AnimatedPressable>
              }
            />

            {mode === 'login' && (
              <AnimatedPressable accessibilityRole="button" style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </AnimatedPressable>
            )}

            <AnimatedPressable
              accessibilityRole="button"
              accessibilityLabel={mode === 'login' ? 'Log in' : 'Create account'}
              disabled={loading}
              onPress={submit}
              style={styles.primaryButton}>
              {loading ? <ActivityIndicator color="#F8F3E8" /> : <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Log in' : 'Create my account'}</Text>}
              {!loading && <Ionicons name="arrow-forward" size={20} color="#F8F3E8" />}
            </AnimatedPressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.divider} />
            </View>

            <AnimatedPressable accessibilityRole="button" accessibilityLabel="Continue with Google" style={styles.socialButton}>
              <Image source={require('@/assets/images/google-g.png')} style={styles.googleMark} contentFit="contain" />
              <Text style={styles.socialText}>Continue with Google</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(350).duration(300)} style={styles.termsWrap}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#718177" />
          <Text style={styles.terms}>By continuing, you agree to our <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; trailing?: React.ReactNode };

function Field({ icon, label, trailing, ...inputProps }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <Ionicons name={icon} size={20} color={focused ? '#285943' : '#718177'} />
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          placeholderTextColor="#94A198"
          selectionColor="#285943"
          style={styles.input}
          onFocus={(event) => { setFocused(true); inputProps.onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); inputProps.onBlur?.(event); }}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F1E8' },
  sunGlow: { position: 'absolute', width: 280, height: 280, borderRadius: 999, backgroundColor: '#F2C7A8', opacity: 0.32, top: -140, right: -100 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, gap: 20 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 2 },
  brandName: { color: '#173D2B', fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  brandMeta: { color: '#78867D', fontSize: 8, fontWeight: '800', letterSpacing: 1.7, paddingTop: 2 },
  card: { backgroundColor: '#FFFCF7', borderRadius: 30, borderCurve: 'continuous', padding: 22, gap: 22, boxShadow: '0 16px 44px rgba(42, 57, 47, 0.10)', borderWidth: 1, borderColor: 'rgba(23,61,43,0.06)' },
  headingWrap: { gap: 7 },
  eyebrow: { color: '#D66D3F', fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  heading: { color: '#17251D', fontSize: 32, lineHeight: 37, fontWeight: '800', letterSpacing: -1.2, maxWidth: 310 },
  subheading: { color: '#68766D', fontSize: 14, lineHeight: 21, maxWidth: 315 },
  switcher: { height: 52, padding: 4, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#EDECE5', flexDirection: 'row', gap: 4 },
  switchItem: { minHeight: 44, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderCurve: 'continuous' },
  switchItemActive: { backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(23,61,43,0.09)' },
  switchText: { color: '#758178', fontWeight: '700', fontSize: 14 },
  switchTextActive: { color: '#173D2B' },
  form: { gap: 15 },
  fieldWrap: { gap: 7 },
  label: { color: '#3D5044', fontSize: 12, fontWeight: '700', paddingLeft: 2 },
  field: { minHeight: 56, borderWidth: 1.5, borderColor: '#DDE2DB', borderRadius: 17, borderCurve: 'continuous', paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#FFFFFF' },
  fieldFocused: { borderColor: '#285943', backgroundColor: '#FCFFFC' },
  input: { flex: 1, minHeight: 52, paddingVertical: 0, color: '#17251D', fontSize: 15 },
  eyeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
  forgotButton: { minHeight: 44, alignSelf: 'flex-end', justifyContent: 'center', marginTop: -8 },
  forgotText: { color: '#285943', fontSize: 13, fontWeight: '800' },
  primaryButton: { minHeight: 58, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#285943', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 18px rgba(40,89,67,0.22)' },
  primaryButtonText: { color: '#F8F3E8', fontSize: 15, fontWeight: '800', letterSpacing: 0.1 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 2 },
  divider: { flex: 1, height: 1, backgroundColor: '#E3E5DF' },
  dividerText: { color: '#89938C', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  socialButton: { minHeight: 54, borderRadius: 17, borderCurve: 'continuous', borderWidth: 1.5, borderColor: '#DDE2DB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, backgroundColor: '#FFFFFF' },
  googleMark: { width: 20, height: 20 },
  socialText: { color: '#34483B', fontSize: 14, fontWeight: '800' },
  termsWrap: { paddingHorizontal: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 8 },
  terms: { flexShrink: 1, color: '#718177', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  termsLink: { color: '#285943', fontWeight: '800' },
});
