import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Colors, Fonts } from '@src/constants/theme';
import { useColorScheme } from '@src/hooks/use-color-scheme';
import { APP_ROUTES } from '@src/navigation/routes';

export function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Shared app layers</Text>
        <Text style={[styles.copy, { color: palette.muted }]}>
          This modal summarizes the cross-cutting modules that were added for future features.
        </Text>
      </View>

      <SectionCard title="Included modules">
        <Text style={[styles.item, { color: palette.text }]}>`src/lib/react-query` for query client defaults and query factories.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`src/store` and `src/services/storage.service.ts` for persisted global state.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`src/validations` for Zod schemas and form resolver helpers.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`src/utils` for formatting, guards, error parsing, and form helpers.</Text>
      </SectionCard>

      <Link href={APP_ROUTES.home} dismissTo style={[styles.link, { color: palette.tint }]}>
        Back to overview
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '800',
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
  },
  item: {
    fontSize: 14,
    lineHeight: 22,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },
});
