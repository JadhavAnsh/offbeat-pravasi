import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Colors, Fonts } from '@src/constants/theme';
import { APP_ROUTES } from '@src/navigation/routes';
import { useColorScheme } from '@src/hooks/use-color-scheme';

const folders = [
  'api',
  'app',
  'assets',
  'components',
  'config',
  'constants',
  'features',
  'hooks',
  'lib',
  'navigation',
  'screens',
  'services',
  'store',
  'types',
  'utils',
  'validations',
] as const;

export function ExploreScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: palette.tint }]}>Project foundation</Text>
        <Text style={[styles.title, { color: palette.text }]}>`src/` now owns app logic.</Text>
        <Text style={[styles.copy, { color: palette.muted }]}>
          Expo Router remains in root `app/`, while reusable code lives under the new feature and
          platform folders below.
        </Text>
      </View>

      <SectionCard
        title="Implemented folders"
        description="These directories are in place for API access, state, validations, reusable hooks, and screens.">
        <View style={styles.folderGrid}>
          {folders.map((folder) => (
            <View
              key={folder}
              style={[styles.folderPill, { backgroundColor: palette.background, borderColor: palette.border }]}>
              <Text style={[styles.folderText, { color: palette.text }]}>{folder}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Validation toolkit"
        description="Zod schemas and react-hook-form resolvers are centralized so forms stay consistent.">
        <Text style={[styles.code, { color: palette.text, borderColor: palette.border }]}>
          {`import { loginSchema, createFormResolver } from '@src/validations';`}
        </Text>
      </SectionCard>

      <SectionCard
        title="Reusable state"
        description="The Zustand store is persisted with SecureStore on native and localStorage on web.">
        <Text style={[styles.copy, { color: palette.muted }]}>
          Store selectors can be consumed from anywhere without passing navigation or context props
          through the tree.
        </Text>
        <Link href={APP_ROUTES.modal} style={[styles.link, { color: palette.tint }]}>
          Architecture notes
        </Link>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    fontWeight: '800',
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  folderPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  folderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  code: {
    borderRadius: 16,
    borderWidth: 1,
    fontFamily: Fonts.mono,
    fontSize: 12,
    overflow: 'hidden',
    padding: 12,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
  },
});
