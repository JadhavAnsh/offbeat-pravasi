import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { env } from '@src/config/env';
import { Radius, Spacing } from '@src/constants/theme';
import { useAppTheme } from '@src/theme/theme-manager';

import { getTrekValidationCopy } from '../services/validation-status';
import type { TrekValidationStatus } from '../types';

type ValidationBadgeProps = {
  status: 'error' | 'pending' | 'validated';
  validation?: TrekValidationStatus;
};

export function TrekValidationBadge({ status, validation }: ValidationBadgeProps) {
  const { mode, palette } = useAppTheme();
  const isError = status === 'error';
  const isPending = status === 'pending';
  const isDemo = validation?.source === 'demo' || env.demoData;
  const copy = getTrekValidationCopy(status, validation, env.appEnv, env.demoData);
  const foreground = isError
    ? mode === 'dark' ? '#FFB4AB' : '#B3261E'
    : isPending
      ? palette.muted
      : mode === 'dark' ? '#A8DAB5' : '#176B2C';
  const background = isError
    ? mode === 'dark' ? '#3A1715' : '#FCE8E6'
    : isPending
      ? palette.surfaceMuted
      : mode === 'dark' ? '#15351D' : '#E8F5EA';

  return (
    <View
      accessibilityLabel={copy.accessibilityLabel}
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      style={[styles.badge, { backgroundColor: background, borderColor: palette.border }]}>
      <MaterialIcons
        color={foreground}
        name={isError ? 'error-outline' : isPending ? 'sync' : isDemo ? 'science' : 'verified'}
        size={14}
      />
      <Text selectable style={[styles.text, { color: foreground }]}>{copy.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.xs,
    minHeight: 28,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  text: { fontSize: 9, fontWeight: '900', letterSpacing: 0.65 },
});
