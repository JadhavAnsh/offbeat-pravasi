import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@src/components/animated-pressable';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { tokens, useAppTheme } from '@src/theme/theme-manager';
import { formatCurrency, formatDateRange } from '@src/utils/format';

import type { TrekSummary } from '../types';

type TrekCardProps = {
  onPress: () => void;
  onToggleSaved?: () => void;
  saved?: boolean;
  saving?: boolean;
  trek: TrekSummary;
};

export function getPrimaryTrekImage(trek: TrekSummary) {
  return trek.images.find((image) => image.isPrimary && image.url)?.url ?? trek.images.find((image) => image.url)?.url ?? null;
}

export function TrekCard({ onPress, onToggleSaved, saved = false, saving = false, trek }: TrekCardProps) {
  const { mode, palette } = useAppTheme();
  const imageUrl = getPrimaryTrekImage(trek);
  const location = [trek.location, trek.state].filter(Boolean).join(', ') || 'Location coming soon';

  return (
    <AnimatedPressable
      accessibilityHint="Opens trek details"
      accessibilityLabel={`${trek.name}, ${location}`}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={[styles.imageFrame, { backgroundColor: palette.surfaceMuted }]}>
        {imageUrl ? (
          <Image
            accessibilityLabel={trek.images.find((image) => image.url === imageUrl)?.altText ?? trek.name}
            cachePolicy="memory-disk"
            contentFit="cover"
            placeholder={{ blurhash: 'L35#}n?b00M{~qIU%MRj00t7_3WB' }}
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            transition={180}
          />
        ) : (
          <View style={styles.fallbackImage}>
            <MaterialIcons color={palette.tint} name="landscape" size={48} />
            <Text style={[styles.fallbackText, { color: palette.muted }]}>OffBeat trail</Text>
          </View>
        )}
        {trek.difficulty ? (
          <View style={[styles.difficulty, { backgroundColor: mode === 'dark' ? palette.surface : 'rgba(255,255,255,0.94)' }]}>
            <Text selectable style={[styles.difficultyText, { color: palette.text }]}>{trek.difficulty}</Text>
          </View>
        ) : null}
        {onToggleSaved ? (
          <Pressable
            accessibilityLabel={saved ? `Remove ${trek.name} from saved treks` : `Save ${trek.name}`}
            accessibilityRole="button"
            disabled={saving}
            hitSlop={8}
            onPress={(event) => {
              event.stopPropagation();
              onToggleSaved();
            }}
            style={[styles.saveButton, { backgroundColor: mode === 'dark' ? palette.surface : 'rgba(255,255,255,0.94)' }]}>
            {saving ? (
              <ActivityIndicator color={palette.tint} size="small" />
            ) : (
              <MaterialIcons color={saved ? palette.tint : palette.icon} name={saved ? 'bookmark' : 'bookmark-border'} size={21} />
            )}
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} selectable style={[styles.title, { color: palette.text }]}>{trek.name}</Text>
          <Text selectable style={[styles.price, { color: palette.tint }]}>{formatCurrency(trek.costInr)}</Text>
        </View>
        <View style={styles.metaLine}>
          <MaterialIcons color={palette.muted} name="location-on" size={15} />
          <Text numberOfLines={1} selectable style={[styles.metaText, { color: palette.muted }]}>{location}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.metaLine}>
            <MaterialIcons color={palette.icon} name="calendar-today" size={14} />
            <Text selectable style={[styles.footerText, { color: palette.muted }]}>{formatDateRange(trek.startDate, trek.endDate)}</Text>
          </View>
          <View style={styles.metaLine}>
            <MaterialIcons color={tokens.colors.tertiary.base} name="star" size={15} />
            <Text selectable style={[styles.footerText, { color: palette.text }]}>
              {trek.avgRating > 0 ? `${trek.avgRating.toFixed(1)} (${trek.ratingCount})` : 'New'}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { borderCurve: 'continuous', borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  imageFrame: { height: 174, overflow: 'hidden', position: 'relative' },
  fallbackImage: { alignItems: 'center', flex: 1, gap: Spacing.xs, justifyContent: 'center' },
  fallbackText: { fontSize: 12, fontWeight: '700' },
  difficulty: { borderCurve: 'continuous', borderRadius: Radius.pill, left: 12, paddingHorizontal: 9, paddingVertical: 6, position: 'absolute', top: 12 },
  difficultyText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  saveButton: { alignItems: 'center', borderRadius: Radius.pill, height: 40, justifyContent: 'center', position: 'absolute', right: 12, top: 12, width: 40 },
  content: { gap: Spacing.sm, padding: Spacing.lg },
  titleRow: { alignItems: 'baseline', flexDirection: 'row', gap: Spacing.sm, justifyContent: 'space-between' },
  title: { flex: 1, fontFamily: Fonts.rounded, fontSize: 18, fontWeight: '800' },
  price: { fontSize: 14, fontVariant: ['tabular-nums'], fontWeight: '900' },
  metaLine: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  metaText: { flex: 1, fontSize: 12 },
  footer: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  footerText: { fontSize: 11, fontVariant: ['tabular-nums'], fontWeight: '700' },
});
