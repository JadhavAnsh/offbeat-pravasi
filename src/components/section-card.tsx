import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@src/constants/theme';
import { nativeWindClasses, useAppTheme } from '@src/theme/theme-manager';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function SectionCard({ title, description, children }: SectionCardProps) {
  const { palette } = useAppTheme();

  return (
    <View
      className={nativeWindClasses.card}
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: palette.muted }]}>{description}</Text>
        ) : null}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    gap: 12,
  },
});
