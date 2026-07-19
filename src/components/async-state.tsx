import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { useAppTheme } from '@src/theme/theme-manager';

type AsyncStateProps = {
  actionLabel?: string;
  description: string;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  onAction?: () => void;
  title: string;
};

export function AsyncState({ actionLabel, description, icon = 'landscape', onAction, title }: AsyncStateProps) {
  const { palette } = useAppTheme();
  return (
    <View accessibilityRole="summary" style={styles.container}>
      <View style={[styles.icon, { backgroundColor: palette.surfaceMuted }]}>
        <MaterialIcons color={palette.tint} name={icon} size={30} />
      </View>
      <Text selectable style={[styles.title, { color: palette.text }]}>{title}</Text>
      <Text selectable style={[styles.description, { color: palette.muted }]}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={[styles.button, { backgroundColor: palette.tint }]}>
          <Text style={[styles.buttonText, { color: palette.background }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, gap: Spacing.sm, justifyContent: 'center', minHeight: 280, padding: Spacing['2xl'] },
  icon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, height: 58, justifyContent: 'center', width: 58 },
  title: { fontFamily: Fonts.rounded, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  description: { fontSize: 14, lineHeight: 20, maxWidth: 330, textAlign: 'center' },
  button: { borderRadius: Radius.pill, minHeight: 44, justifyContent: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.xl, paddingVertical: 11 },
  buttonText: { fontSize: 14, fontWeight: '800' },
});
