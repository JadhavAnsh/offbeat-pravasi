import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AsyncState } from '@src/components/async-state';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { DemoBadge } from '@src/features/treks/components/demo-badge';
import { getPrimaryTrekImage } from '@src/features/treks/components/trek-card';
import { useTrek } from '@src/features/treks/hooks';
import { useToggleWishlist, useWishlistItems } from '@src/features/wishlist/hooks';
import { useAppTheme } from '@src/theme/theme-manager';
import { formatCurrency, formatDateRange } from '@src/utils/format';

export function TrekDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { palette } = useAppTheme();
  const trekQuery = useTrek(id);
  const wishlistQuery = useWishlistItems();
  const wishlistMutation = useToggleWishlist();
  const saved = (wishlistQuery.data ?? []).some((item) => item.trekId === id);

  if (trekQuery.isLoading) {
    return <View style={[styles.center, { backgroundColor: palette.background }]}><ActivityIndicator color={palette.tint} size="large" /></View>;
  }
  if (trekQuery.error || !trekQuery.data) {
    return (
      <View style={[styles.center, { backgroundColor: palette.background }]}>
        <AsyncState actionLabel="Try again" description={trekQuery.error?.message ?? 'This trek is no longer available.'} icon="error-outline" onAction={() => trekQuery.refetch()} title="Could not open this trek" />
      </View>
    );
  }

  const trek = trekQuery.data;
  const imageUrl = getPrimaryTrekImage(trek);
  const availableSeats = Math.max(0, trek.maxParticipants - trek.currentParticipants);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: palette.background }}>
      <View style={[styles.hero, { backgroundColor: palette.surfaceMuted }]}>
        {imageUrl ? (
          <Image
            accessibilityLabel={trek.name}
            cachePolicy="memory-disk"
            contentFit="cover"
            placeholder={{ blurhash: 'L35#}n?b00M{~qIU%MRj00t7_3WB' }}
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            transition={180}
          />
        ) : (
          <View style={styles.fallback}><MaterialIcons color={palette.tint} name="landscape" size={68} /></View>
        )}
      </View>

      <View style={styles.heading}>
        <View style={styles.titleRow}>
          <Text selectable style={[styles.title, { color: palette.text }]}>{trek.name}</Text>
          {trek.source === 'demo' ? <DemoBadge /> : null}
        </View>
        <View style={styles.metaLine}>
          <MaterialIcons color={palette.muted} name="location-on" size={17} />
          <Text selectable style={[styles.meta, { color: palette.muted }]}>{[trek.location, trek.state].filter(Boolean).join(', ') || 'Location coming soon'}</Text>
        </View>
      </View>

      <View style={[styles.stats, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Stat icon="calendar-today" label="Dates" value={formatDateRange(trek.startDate, trek.endDate)} />
        <Stat icon="trending-up" label="Difficulty" value={trek.difficulty ? trek.difficulty.toLowerCase() : 'TBA'} />
        <Stat icon="star" label="Rating" value={trek.avgRating ? trek.avgRating.toFixed(1) : 'New'} />
        <Stat icon="group" label="Seats left" value={String(availableSeats)} />
      </View>

      <View style={styles.section}>
        <Text selectable style={[styles.sectionTitle, { color: palette.text }]}>About this trail</Text>
        <Text selectable style={[styles.description, { color: palette.muted }]}>{trek.fullDescription || trek.shortDescription || 'More trail details will be added soon.'}</Text>
      </View>

      {trek.tags.length ? (
        <View style={styles.tags}>
          {trek.tags.map((tag) => <View key={tag.id ?? tag.name} style={[styles.tag, { backgroundColor: palette.surfaceMuted }]}><Text style={[styles.tagText, { color: palette.text }]}>{tag.name}</Text></View>)}
        </View>
      ) : null}

      <View style={[styles.actionBar, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.priceCopy}>
          <Text selectable style={[styles.priceLabel, { color: palette.muted }]}>From</Text>
          <Text selectable style={[styles.price, { color: palette.text }]}>{formatCurrency(trek.costInr)}</Text>
        </View>
        {trek.source === 'api' ? (
          <Pressable
            accessibilityLabel={saved ? 'Remove from saved treks' : 'Save trek'}
            accessibilityRole="button"
            disabled={wishlistMutation.isPending}
            onPress={() => wishlistMutation.mutate(trek.id)}
            style={[styles.save, { backgroundColor: palette.tint }]}>
            {wishlistMutation.isPending ? <ActivityIndicator color={palette.background} /> : <MaterialIcons color={palette.background} name={saved ? 'bookmark' : 'bookmark-border'} size={21} />}
            <Text style={[styles.saveText, { color: palette.background }]}>{saved ? 'Saved' : 'Save trek'}</Text>
          </Pressable>
        ) : (
          <View style={[styles.demoNote, { backgroundColor: palette.surfaceMuted }]}><Text style={[styles.demoNoteText, { color: palette.muted }]}>Preview only</Text></View>
        )}
      </View>
    </ScrollView>
  );
}

function Stat({ icon, label, value }: { icon: ComponentProps<typeof MaterialIcons>['name']; label: string; value: string }) {
  const { palette } = useAppTheme();
  return (
    <View style={styles.stat}>
      <MaterialIcons color={palette.tint} name={icon} size={19} />
      <Text selectable style={[styles.statLabel, { color: palette.muted }]}>{label}</Text>
      <Text selectable numberOfLines={1} style={[styles.statValue, { color: palette.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  content: { gap: Spacing.xl, padding: Spacing.xl, paddingBottom: Spacing['3xl'] },
  hero: { borderCurve: 'continuous', borderRadius: Radius.xl, height: 280, overflow: 'hidden' },
  fallback: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  heading: { gap: Spacing.sm },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.md, justifyContent: 'space-between' },
  title: { flex: 1, fontFamily: Fonts.rounded, fontSize: 30, fontWeight: '900', letterSpacing: -0.7 },
  metaLine: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  meta: { fontSize: 14 },
  stats: { borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.md },
  stat: { flexBasis: '46%', flexGrow: 1, gap: 4, minWidth: 130, padding: Spacing.sm },
  statLabel: { fontSize: 11, fontWeight: '700' },
  statValue: { fontSize: 13, fontWeight: '800', textTransform: 'capitalize' },
  section: { gap: Spacing.sm },
  sectionTitle: { fontFamily: Fonts.rounded, fontSize: 20, fontWeight: '800' },
  description: { fontSize: 15, lineHeight: 23 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: { borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
  tagText: { fontSize: 12, fontWeight: '700' },
  actionBar: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.md, justifyContent: 'space-between', padding: Spacing.lg },
  priceCopy: { gap: 2 },
  priceLabel: { fontSize: 11, fontWeight: '700' },
  price: { fontSize: 20, fontVariant: ['tabular-nums'], fontWeight: '900' },
  save: { alignItems: 'center', borderRadius: Radius.pill, flexDirection: 'row', gap: Spacing.sm, minHeight: 46, justifyContent: 'center', paddingHorizontal: Spacing.lg },
  saveText: { fontSize: 14, fontWeight: '800' },
  demoNote: { borderRadius: Radius.pill, minHeight: 44, justifyContent: 'center', paddingHorizontal: Spacing.lg },
  demoNoteText: { fontSize: 13, fontWeight: '800' },
});
