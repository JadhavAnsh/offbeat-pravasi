import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@src/constants/theme';
import { useColorScheme } from '@src/hooks/use-color-scheme';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function SectionCard({ title, description, children }: SectionCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View
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
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    padding: 16,
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
