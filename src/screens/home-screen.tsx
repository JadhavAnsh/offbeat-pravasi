import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@src/components/animated-pressable';
import { Screen } from '@src/components/screen';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { env } from '@src/config/env';
import { useBookings } from '@src/features/bookings/hooks';
import { useAuthStore } from '@src/features/auth/store';
import { DemoBadge } from '@src/features/treks/components/demo-badge';
import { getPrimaryTrekImage, TrekCard } from '@src/features/treks/components/trek-card';
import { useRecommendedTreks } from '@src/features/treks/hooks';
import { useToggleWishlist, useWishlistItems } from '@src/features/wishlist/hooks';
import { APP_ROUTES } from '@src/navigation/routes';
import { tokens, useAppTheme } from '@src/theme/theme-manager';
import { formatDateRange, getInitials } from '@src/utils/format';

const quickActions = [
  { icon: 'explore' as const, label: 'Explore', href: APP_ROUTES.explore, color: tokens.colors.primary.base, tint: tokens.colors.primary[50] },
  { icon: 'near-me' as const, label: 'Nearby', href: { pathname: '/explore' as const, params: { nearby: 'true' } }, color: tokens.colors.secondary.base, tint: tokens.colors.secondary[50] },
  { icon: 'hiking' as const, label: 'Easy trails', href: { pathname: '/explore' as const, params: { difficulty: 'EASY' } }, color: tokens.colors.tertiary[700], tint: tokens.colors.tertiary[50] },
  { icon: 'trending-up' as const, label: 'Popular', href: { pathname: '/explore' as const, params: { sort: 'popular' } }, color: '#6941C6', tint: '#F3EEFF' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export function HomeScreen() {
  const { mode, palette } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const recommendations = useRecommendedTreks(4);
  const bookings = useBookings();
  const wishlist = useWishlistItems();
  const wishlistMutation = useToggleWishlist();
  const firstName = user?.fullName?.trim().split(' ')[0] || 'Pravasi';
  const featured = recommendations.data?.[0];
  const heroImage = featured ? getPrimaryTrekImage(featured) : null;
  const savedIds = new Set((wishlist.data ?? []).map((item) => item.trekId));
  const nextBooking = bookings.data?.find((booking) => booking.status === 'CONFIRMED' || booking.status === 'PENDING');

  return (
    <Screen contentContainerStyle={styles.screenContent}>
      <View style={styles.topBar}>
        <View style={styles.greeting}>
          <View style={styles.overlineRow}>
            <Text selectable style={[styles.overline, { color: palette.muted }]}>{getGreeting()}</Text>
            {env.demoData ? <DemoBadge /> : null}
          </View>
          <Text selectable style={[styles.greetingTitle, { color: palette.text }]}>Where to, {firstName}?</Text>
        </View>
        <Pressable
          accessibilityHint="Opens account options"
          accessibilityLabel="Open account"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push(APP_ROUTES.account)}
          style={[styles.avatar, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
          <Text selectable style={[styles.avatarText, { color: palette.tint }]}>{getInitials(user?.fullName || 'OffBeat Pravasi')}</Text>
        </Pressable>
      </View>

      <AnimatedPressable
        accessibilityHint="Opens trek discovery"
        accessibilityRole="button"
        onPress={() => router.push(APP_ROUTES.explore)}
        style={[styles.hero, { backgroundColor: tokens.colors.primary[800] }]}>
        {heroImage ? (
          <Image
            accessibilityLabel="Featured outdoor trail"
            cachePolicy="memory-disk"
            contentFit="cover"
            placeholder={{ blurhash: 'L35#}n?b00M{~qIU%MRj00t7_3WB' }}
            priority="high"
            source={{ uri: heroImage }}
            style={StyleSheet.absoluteFill}
            transition={180}
          />
        ) : (
          <View style={styles.heroFallback}><MaterialIcons color="rgba(255,255,255,0.18)" name="landscape" size={180} /></View>
        )}
        <View style={[StyleSheet.absoluteFill, styles.heroOverlay]} />
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <MaterialIcons color="#FFFFFF" name="auto-awesome" size={14} />
            <Text style={styles.heroBadgeText}>CURATED TRAIL IDEAS</Text>
          </View>
          <Text selectable style={styles.heroTitle}>Go where the maps get quiet.</Text>
          <Text selectable style={styles.heroDescription}>Discover real trails, compare difficulty, and build a trip that fits your pace.</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Explore trails</Text>
            <MaterialIcons color={tokens.colors.primary.base} name="arrow-forward" size={18} />
          </View>
        </View>
      </AnimatedPressable>

      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <AnimatedPressable
            accessibilityLabel={action.label}
            accessibilityRole="button"
            key={action.label}
            onPress={() => router.push(action.href)}
            style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: mode === 'dark' ? palette.surfaceMuted : action.tint }]}>
              <MaterialIcons color={mode === 'dark' ? palette.text : action.color} name={action.icon} size={23} />
            </View>
            <Text style={[styles.quickActionLabel, { color: palette.text }]}>{action.label}</Text>
          </AnimatedPressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <Text selectable style={[styles.sectionTitle, { color: palette.text }]}>Popular escapes</Text>
            <Text selectable style={[styles.sectionSubtitle, { color: palette.muted }]}>Traveler favorites and trending trails</Text>
          </View>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={() => router.push({ pathname: '/explore', params: { sort: 'popular' } })}>
            <Text style={[styles.seeAll, { color: palette.tint }]}>See all</Text>
          </Pressable>
        </View>

        {recommendations.isLoading ? (
          <View style={[styles.loadingCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <ActivityIndicator color={palette.tint} />
            <Text selectable style={[styles.loadingText, { color: palette.muted }]}>Finding a trail for you…</Text>
          </View>
        ) : featured ? (
          <TrekCard
            onPress={() => router.push(APP_ROUTES.trek(featured.id))}
            onToggleSaved={featured.source === 'api' ? () => wishlistMutation.mutate(featured.id) : undefined}
            saved={savedIds.has(featured.id)}
            saving={wishlistMutation.isPending && wishlistMutation.variables === featured.id}
            trek={featured}
          />
        ) : (
          <DiscoveryPrompt
            description={recommendations.error ? 'We could not load the latest trails. Try the catalog again.' : 'The live catalog is empty right now. Fresh routes will appear here when organizers publish them.'}
            title={recommendations.error ? 'Trails are taking a detour' : 'New escapes are on the way'}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <Text selectable style={[styles.sectionTitle, { color: palette.text }]}>Plan without the scramble</Text>
            <Text selectable style={[styles.sectionSubtitle, { color: palette.muted }]}>Keep the next step clear</Text>
          </View>
        </View>
        {nextBooking ? (
          <AnimatedPressable
            accessibilityHint="Opens the booked trek"
            accessibilityRole="button"
            onPress={() => router.push(APP_ROUTES.trek(nextBooking.trekId))}
            style={[styles.tripCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <View style={[styles.tripIcon, { backgroundColor: palette.surfaceMuted }]}><MaterialIcons color={palette.tint} name="map" size={24} /></View>
            <View style={styles.tripCopy}>
              <Text selectable style={[styles.tripEyebrow, { color: palette.tint }]}>{nextBooking.status}</Text>
              <Text selectable numberOfLines={1} style={[styles.tripTitle, { color: palette.text }]}>{nextBooking.trekSnapshot.name}</Text>
              <Text selectable style={[styles.tripMeta, { color: palette.muted }]}>{formatDateRange(nextBooking.trekSnapshot.startDate, nextBooking.trekSnapshot.endDate)} · {nextBooking.quantity} traveler{nextBooking.quantity === 1 ? '' : 's'}</Text>
            </View>
            <MaterialIcons color={palette.icon} name="chevron-right" size={23} />
          </AnimatedPressable>
        ) : (
          <DiscoveryPrompt description="Browse by difficulty, region, or budget and save the trails that feel right." title="Ready for your first escape?" />
        )}
      </View>
    </Screen>
  );
}

function DiscoveryPrompt({ description, title }: { description: string; title: string }) {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.prompt, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={[styles.promptIcon, { backgroundColor: palette.surfaceMuted }]}><MaterialIcons color={palette.tint} name="landscape" size={25} /></View>
      <View style={styles.promptCopy}>
        <Text selectable style={[styles.promptTitle, { color: palette.text }]}>{title}</Text>
        <Text selectable style={[styles.promptDescription, { color: palette.muted }]}>{description}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push(APP_ROUTES.explore)} style={[styles.promptButton, { backgroundColor: palette.tint }]}>
        <MaterialIcons color={palette.background} name="arrow-forward" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: Spacing['3xl'] },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { flex: 1, gap: 3 },
  overlineRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  greetingTitle: { fontFamily: Fonts.rounded, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  avatar: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.pill, borderWidth: 1, height: 46, justifyContent: 'center', width: 46 },
  avatarText: { fontSize: 14, fontWeight: '800' },
  hero: { borderCurve: 'continuous', borderRadius: Radius.xl, justifyContent: 'flex-end', minHeight: 310, overflow: 'hidden' },
  heroFallback: { alignItems: 'flex-end', flex: 1, justifyContent: 'flex-start', overflow: 'hidden' },
  heroOverlay: { backgroundColor: 'rgba(7, 22, 9, 0.54)' },
  heroContent: { alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.xl },
  heroBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderCurve: 'continuous', borderRadius: Radius.pill, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontFamily: Fonts.rounded, fontSize: 31, fontWeight: '800', lineHeight: 36, maxWidth: 290 },
  heroDescription: { color: 'rgba(255,255,255,0.86)', fontSize: 14, lineHeight: 20, maxWidth: 290 },
  heroCta: { alignItems: 'center', backgroundColor: '#FFFFFF', borderCurve: 'continuous', borderRadius: Radius.pill, flexDirection: 'row', gap: 8, marginTop: Spacing.sm, minHeight: 44, paddingHorizontal: 16, paddingVertical: 11 },
  heroCtaText: { color: tokens.colors.primary.base, fontSize: 13, fontWeight: '800' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', flex: 1, gap: 7, minWidth: 58 },
  quickActionIcon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, height: 54, justifyContent: 'center', width: 54 },
  quickActionLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  section: { gap: Spacing.md },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', gap: Spacing.md, justifyContent: 'space-between' },
  sectionTitleGroup: { flex: 1, gap: 3 },
  sectionTitle: { fontFamily: Fonts.rounded, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 13 },
  seeAll: { fontSize: 13, fontWeight: '800', paddingVertical: 3 },
  loadingCard: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.xl, borderWidth: 1, gap: Spacing.md, justifyContent: 'center', minHeight: 230 },
  loadingText: { fontSize: 13, fontWeight: '700' },
  tripCard: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.md, padding: Spacing.lg },
  tripIcon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.md, height: 48, justifyContent: 'center', width: 48 },
  tripCopy: { flex: 1, gap: 3 },
  tripEyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  tripTitle: { fontSize: 15, fontWeight: '800' },
  tripMeta: { fontSize: 11, lineHeight: 16 },
  prompt: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.md, padding: Spacing.lg },
  promptIcon: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.md, height: 46, justifyContent: 'center', width: 46 },
  promptCopy: { flex: 1, gap: 4 },
  promptTitle: { fontSize: 15, fontWeight: '800' },
  promptDescription: { fontSize: 12, lineHeight: 17 },
  promptButton: { alignItems: 'center', borderRadius: Radius.pill, height: 44, justifyContent: 'center', width: 44 },
});
