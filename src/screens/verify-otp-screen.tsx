import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/animated-pressable';
import { BrandMark } from '@/components/brand-mark';
import { useResendOtp, useVerifyOtp } from '@/features/auth/hooks';
import { toErrorMessage } from '@/utils/error';
import { otpSchema } from '@/validations/common';

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

export function VerifyOtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const otpInputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const otpDigits = Array.from({ length: OTP_LENGTH }, (_value, index) => otp[index] ?? '');

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
    setError(null);
  };

  const submit = async () => {
    const result = otpSchema.safeParse(otp);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Enter the 6 digit code');
      return;
    }
    if (!email) {
      setError('Your email is missing. Return to sign up and try again.');
      return;
    }

    setError(null);
    try {
      await verifyMutation.mutateAsync({ email, otp: result.data });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/home');
    } catch (verificationError) {
      setError(toErrorMessage(verificationError, 'Unable to verify that code.'));
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const resend = async () => {
    if (!email || seconds > 0) return;
    setError(null);
    setNotice(null);
    try {
      await resendMutation.mutateAsync(email);
      setSeconds(RESEND_SECONDS);
      setNotice('A new verification code was sent.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (resendError) {
      setError(toErrorMessage(resendError, 'Unable to resend the code.'));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sunGlow} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 22, paddingBottom: insets.bottom + 24 }]}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.brandRow}>
          <BrandMark size={48} />
          <View>
            <Text style={styles.brandName}>OffBeat Pravasi</Text>
            <Text style={styles.brandMeta}>TRAVEL DIFFERENTLY</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(420)} style={styles.card}>
          <View style={styles.iconShell}>
            <Ionicons name="mail-unread-outline" size={30} color="#285943" />
          </View>
          <View style={styles.headingWrap}>
            <Text style={styles.eyebrow}>ONE LAST STEP</Text>
            <Text style={styles.heading}>Check your email.</Text>
            <Text selectable style={styles.subheading}>Enter the 6-digit code sent to {email || 'your email'}.</Text>
          </View>

          <View style={styles.form}>
            <Pressable accessibilityRole="button" accessibilityLabel="Enter verification code" onPress={() => otpInputRef.current?.focus()} style={[styles.otpField, isOtpFocused && styles.otpFieldFocused]}>
              <TextInput
                ref={otpInputRef}
                autoFocus
                accessibilityLabel="Six digit verification code"
                autoComplete="one-time-code"
                caretHidden
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                onBlur={() => setIsOtpFocused(false)}
                onChangeText={handleOtpChange}
                onFocus={() => setIsOtpFocused(true)}
                onSubmitEditing={submit}
                selectionColor="#285943"
                style={styles.hiddenOtpInput}
                textContentType="oneTimeCode"
                value={otp}
              />

              <View pointerEvents="none" style={styles.otpBoxesRow}>
                {otpDigits.map((digit, index) => {
                  const isActive = isOtpFocused && (index === otp.length || (otp.length === OTP_LENGTH && index === OTP_LENGTH - 1));
                  return (
                    <View key={`otp-digit-${index}`} style={[styles.otpBox, isActive && styles.otpBoxActive]}>
                      <Text style={[styles.otpDigit, !digit && styles.otpDigitPlaceholder]}>
                        {digit || '0'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Pressable>

            {!!error && <Text selectable accessibilityRole="alert" style={styles.error}>{error}</Text>}
            {!!notice && <Text selectable accessibilityRole="alert" style={styles.notice}>{notice}</Text>}

            <AnimatedPressable
              accessibilityRole="button"
              disabled={verifyMutation.isPending || otp.length !== OTP_LENGTH}
              onPress={submit}
              style={[styles.primaryButton, otp.length !== OTP_LENGTH && styles.primaryButtonDisabled]}>
              {verifyMutation.isPending ? <ActivityIndicator color="#F8F3E8" /> : <Text style={styles.primaryText}>Verify email</Text>}
              {!verifyMutation.isPending && <Ionicons name="arrow-forward" size={20} color="#F8F3E8" />}
            </AnimatedPressable>

            <AnimatedPressable accessibilityRole="button" disabled={seconds > 0 || resendMutation.isPending} onPress={resend} style={styles.resendButton}>
              {resendMutation.isPending ? <ActivityIndicator color="#285943" /> : (
                <Text style={[styles.resendText, seconds > 0 && styles.resendTextDisabled]}>
                  {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
                </Text>
              )}
            </AnimatedPressable>
          </View>

          <AnimatedPressable accessibilityRole="button" onPress={() => router.replace('/auth')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={18} color="#607265" />
            <Text style={styles.backText}>Back to login</Text>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F1E8' },
  sunGlow: { position: 'absolute', width: 300, height: 300, borderRadius: 999, backgroundColor: '#F2C7A8', opacity: 0.32, top: -150, right: -90 },
  content: { flexGrow: 1, paddingHorizontal: 20, gap: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandName: { color: '#173D2B', fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  brandMeta: { color: '#78867D', fontSize: 8, fontWeight: '800', letterSpacing: 1.7, paddingTop: 2 },
  card: { backgroundColor: '#FFFCF7', borderRadius: 30, borderCurve: 'continuous', padding: 24, gap: 24, boxShadow: '0 16px 44px rgba(42,57,47,0.10)', borderWidth: 1, borderColor: 'rgba(23,61,43,0.06)' },
  iconShell: { width: 58, height: 58, borderRadius: 19, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6EFE8' },
  headingWrap: { gap: 8 },
  eyebrow: { color: '#D66D3F', fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  heading: { color: '#17251D', fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -1.1 },
  subheading: { color: '#68766D', fontSize: 14, lineHeight: 21 },
  form: { gap: 15 },
  otpField: { minHeight: 78, justifyContent: 'center', position: 'relative' },
  otpFieldFocused: {},
  hiddenOtpInput: { position: 'absolute', inset: 0, opacity: 0 },
  otpBoxesRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  otpBox: { flex: 1, aspectRatio: 0.82, minHeight: 70, maxHeight: 78, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFFCF7', borderWidth: 1.5, borderColor: '#D9E3DC', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(33, 63, 48, 0.06)' },
  otpBoxActive: { borderColor: '#285943', backgroundColor: '#FFFFFF', boxShadow: '0 10px 24px rgba(40, 89, 67, 0.12)' },
  otpDigit: { color: '#173D2B', fontSize: 30, fontWeight: '800', fontVariant: ['tabular-nums'] },
  otpDigitPlaceholder: { color: '#B2BAB4' },
  error: { color: '#9C2F23', backgroundColor: '#FBE9E5', borderRadius: 12, borderCurve: 'continuous', padding: 12, fontSize: 13, lineHeight: 19 },
  notice: { color: '#285943', backgroundColor: '#E7F1EA', borderRadius: 12, borderCurve: 'continuous', padding: 12, fontSize: 13, lineHeight: 19 },
  primaryButton: { minHeight: 58, borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#285943', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryButtonDisabled: { opacity: 0.48 },
  primaryText: { color: '#F8F3E8', fontSize: 15, fontWeight: '800' },
  resendButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  resendText: { color: '#285943', fontSize: 14, fontWeight: '800' },
  resendTextDisabled: { color: '#89938C' },
  backButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  backText: { color: '#607265', fontSize: 13, fontWeight: '700' },
});
