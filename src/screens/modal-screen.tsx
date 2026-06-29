import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@src/components/section-card';
import { Screen } from '@src/components/screen';
import { Fonts, Spacing } from '@src/constants/theme';
import { APP_ROUTES } from '@src/navigation/routes';
import { useAppTheme } from '@src/theme/theme-manager';

export function ModalScreen() {
  const { palette } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Theme implementation</Text>
        <Text style={[styles.copy, { color: palette.muted }]}>
          The attached visual board now has documentation, JSON tokens, a theme manager, and
          NativeWind aliases.
        </Text>
      </View>

      <SectionCard title="Included files">
        <Text style={[styles.item, { color: palette.text }]}>`design.md` describes the visual language and usage rules.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`src/theme/theme.json` stores colors, typography, spacing, and radii.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`src/theme/theme-manager.ts` exposes palette hooks and NativeWind class helpers.</Text>
        <Text style={[styles.item, { color: palette.text }]}>`tailwind.config.js` maps JSON tokens into NativeWind utility names.</Text>
      </SectionCard>

      <Link href={APP_ROUTES.home} dismissTo style={[styles.link, { color: palette.tint }]}>
        Back to overview
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
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
