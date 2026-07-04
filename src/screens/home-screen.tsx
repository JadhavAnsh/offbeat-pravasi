import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedPressable } from '@src/components/animated-pressable';
import { Screen } from '@src/components/screen';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { useLogout } from '@src/features/auth/hooks';
import { useAuthStore } from '@src/features/auth/store';
import { APP_ROUTES } from '@src/navigation/routes';
import { tokens, useAppTheme } from '@src/theme/theme-manager';
import { getInitials } from '@src/utils/format';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85';
const TRAIL_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85';
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=700&q=80';

const quickActions = [
  { icon: 'explore' as const, label: 'Explore', color: tokens.colors.primary.base, tint: tokens.colors.primary[50] },
  { icon: 'near-me' as const, label: 'Nearby', color: tokens.colors.secondary.base, tint: tokens.colors.secondary[50] },
  { icon: 'backpack' as const, label: 'Gear', color: tokens.colors.tertiary[700], tint: tokens.colors.tertiary[50] },
  { icon: 'groups' as const, label: 'Groups', color: '#6941C6', tint: '#F3EEFF' },
];

export function HomeScreen() {
  const { mode, palette } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const firstName = user?.fullName?.trim().split(' ')[0] || 'Pravasi';

  const openExplore = () => router.push(APP_ROUTES.explore);

  return (
    <Screen contentContainerStyle={styles.screenContent}>
      <View style={styles.topBar}>
        <View style={styles.greeting}>
          <Text style={[styles.overline, { color: palette.muted }]}>GOOD MORNING</Text>
          <Text style={[styles.greetingTitle, { color: palette.text }]}>Where to, {firstName}?</Text>
        </View>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          disabled={logoutMutation.isPending}
          hitSlop={8}
          onPress={() => logoutMutation.mutate()}
          style={[styles.avatar, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
          {logoutMutation.isPending ? (
            <ActivityIndicator color={palette.tint} size="small" />
          ) : (
            <Text style={[styles.avatarText, { color: palette.tint }]}>
              {getInitials(user?.fullName || 'OffBeat Pravasi')}
            </Text>
          )}
        </Pressable>
      </View>

      <AnimatedPressable
        accessibilityHint="Opens trek discovery"
        accessibilityRole="button"
        onPress={openExplore}
        style={styles.hero}>
        <Image
          cachePolicy="memory-disk"
          contentFit="cover"
          priority="high"
          source={{ uri: HERO_IMAGE }}
          style={StyleSheet.absoluteFill}
          transition={180}
        />
        <View style={[StyleSheet.absoluteFill, styles.heroOverlay]} />
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <MaterialIcons color="#FFFFFF" name="auto-awesome" size={14} />
            <Text style={styles.heroBadgeText}>CURATED FOR YOU</Text>
          </View>
          <Text style={styles.heroTitle}>Go where the maps get quiet.</Text>
          <Text style={styles.heroDescription}>Handpicked trails, local stories, and weather-ready plans.</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Find my trail</Text>
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
            onPress={openExplore}
            style={styles.quickAction}>
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: mode === 'dark' ? palette.surfaceMuted : action.tint },
              ]}>
              <MaterialIcons color={mode === 'dark' ? palette.text : action.color} name={action.icon} size={23} />
            </View>
            <Text style={[styles.quickActionLabel, { color: palette.text }]}>{action.label}</Text>
          </AnimatedPressable>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Your next escape</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.muted }]}>Recommended for monsoon weekends</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={openExplore} hitSlop={8}>
            <Text style={[styles.seeAll, { color: palette.tint }]}>See all</Text>
          </Pressable>
        </View>

        <AnimatedPressable
          accessibilityLabel="Explore Kudremukh Peak trek"
          accessibilityRole="button"
          onPress={openExplore}
          style={[styles.trailCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: TRAIL_IMAGE }}
            style={styles.trailImage}
            transition={180}
          />
          <Pressable
            accessibilityLabel="Save trek"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {}}
            style={styles.saveButton}>
            <MaterialIcons color="#1B251C" name="bookmark-border" size={21} />
          </Pressable>
          <View style={styles.trailContent}>
            <View style={styles.trailTopLine}>
              <View style={styles.trailCopy}>
                <Text style={[styles.trailTitle, { color: palette.text }]}>Kudremukh Peak</Text>
                <View style={styles.metaLine}>
                  <MaterialIcons color={palette.muted} name="location-on" size={15} />
                  <Text style={[styles.metaText, { color: palette.muted }]}>Chikkamagaluru · 2 days</Text>
                </View>
              </View>
              <View style={[styles.difficulty, { backgroundColor: mode === 'dark' ? palette.surfaceMuted : '#FFF4E5' }]}>
                <Text style={[styles.difficultyText, { color: mode === 'dark' ? palette.text : '#9A5B13' }]}>MODERATE</Text>
              </View>
            </View>
            <View style={[styles.weatherStrip, { backgroundColor: palette.surfaceMuted }]}>
              <View style={styles.weatherItem}>
                <MaterialIcons color={palette.tint} name="cloud" size={17} />
                <Text style={[styles.weatherText, { color: palette.text }]}>18° · Misty</Text>
              </View>
              <View style={styles.weatherItem}>
                <MaterialIcons color={palette.tint} name="star" size={17} />
                <Text style={[styles.weatherText, { color: palette.text }]}>4.8 · 326 trekkers</Text>
              </View>
            </View>
          </View>
        </AnimatedPressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Plan without the scramble</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.muted }]}>Everything your booked trip needs</Text>
          </View>
        </View>
        <View style={styles.plannerRow}>
          <AnimatedPressable
            accessibilityRole="button"
            onPress={openExplore}
            style={[styles.plannerCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <View style={[styles.plannerIcon, { backgroundColor: palette.surfaceMuted }]}>
              <MaterialIcons color={palette.tint} name="map" size={22} />
            </View>
            <Text style={[styles.plannerTitle, { color: palette.text }]}>Itinerary</Text>
            <Text style={[styles.plannerCopy, { color: palette.muted }]}>Build your day-by-day route</Text>
            <MaterialIcons color={palette.icon} name="arrow-forward" size={18} />
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityRole="button"
            onPress={openExplore}
            style={[styles.plannerCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <View style={[styles.plannerIcon, { backgroundColor: palette.surfaceMuted }]}>
              <MaterialIcons color={palette.highlight} name="checklist" size={22} />
            </View>
            <Text style={[styles.plannerTitle, { color: palette.text }]}>Packing list</Text>
            <Text style={[styles.plannerCopy, { color: palette.muted }]}>Gear matched to the trail</Text>
            <MaterialIcons color={palette.icon} name="arrow-forward" size={18} />
          </AnimatedPressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>From the trail</Text>
            <Text style={[styles.sectionSubtitle, { color: palette.muted }]}>Fresh stories from the community</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={openExplore} hitSlop={8}>
            <Text style={[styles.seeAll, { color: palette.tint }]}>View feed</Text>
          </Pressable>
        </View>
        <AnimatedPressable
          accessibilityRole="button"
          onPress={openExplore}
          style={[styles.storyCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{ uri: STORY_IMAGE }}
            style={styles.storyImage}
            transition={180}
          />
          <View style={styles.storyCopy}>
            <Text numberOfLines={2} style={[styles.storyTitle, { color: palette.text }]}>
              The village that taught us to slow down
            </Text>
            <Text style={[styles.storyMeta, { color: palette.muted }]}>Meera · 6 min read</Text>
          </View>
          <MaterialIcons color={palette.icon} name="chevron-right" size={22} />
        </AnimatedPressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: Spacing['3xl'] },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { flex: 1, gap: 2 },
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  greetingTitle: { fontFamily: Fonts.rounded, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  avatar: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.pill, borderWidth: 1,
    height: 46, justifyContent: 'center', width: 46,
  },
  avatarText: { fontSize: 14, fontWeight: '800' },
  hero: {
    borderCurve: 'continuous', borderRadius: Radius.xl, minHeight: 310, overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroOverlay: { backgroundColor: 'rgba(7, 22, 9, 0.47)' },
  heroContent: { alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.xl },
  heroBadge: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.16)', borderCurve: 'continuous',
    borderRadius: Radius.pill, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6,
  },
  heroBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontFamily: Fonts.rounded, fontSize: 31, fontWeight: '800', lineHeight: 36, maxWidth: 290 },
  heroDescription: { color: 'rgba(255,255,255,0.86)', fontSize: 14, lineHeight: 20, maxWidth: 280 },
  heroCta: {
    alignItems: 'center', backgroundColor: '#FFFFFF', borderCurve: 'continuous', borderRadius: Radius.pill,
    flexDirection: 'row', gap: 8, marginTop: Spacing.sm, paddingHorizontal: 16, paddingVertical: 11,
  },
  heroCtaText: { color: tokens.colors.primary.base, fontSize: 13, fontWeight: '800' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: 7, minWidth: 58 },
  quickActionIcon: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, height: 54,
    justifyContent: 'center', width: 54,
  },
  quickActionLabel: { fontSize: 12, fontWeight: '700' },
  section: { gap: Spacing.md },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', gap: Spacing.md, justifyContent: 'space-between' },
  sectionTitleGroup: { flex: 1, gap: 3 },
  sectionTitle: { fontFamily: Fonts.rounded, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 13 },
  seeAll: { fontSize: 13, fontWeight: '800', paddingVertical: 3 },
  trailCard: {
    borderCurve: 'continuous', borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
  },
  trailImage: { height: 176, width: '100%' },
  saveButton: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: Radius.pill,
    height: 38, justifyContent: 'center', position: 'absolute', right: 12, top: 12, width: 38,
  },
  trailContent: { gap: Spacing.md, padding: Spacing.lg },
  trailTopLine: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.sm, justifyContent: 'space-between' },
  trailCopy: { flex: 1, gap: 5 },
  trailTitle: { fontFamily: Fonts.rounded, fontSize: 18, fontWeight: '800' },
  metaLine: { alignItems: 'center', flexDirection: 'row', gap: 3 },
  metaText: { fontSize: 12 },
  difficulty: { borderCurve: 'continuous', borderRadius: Radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  difficultyText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  weatherStrip: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.md, flexDirection: 'row',
    gap: Spacing.lg, paddingHorizontal: Spacing.md, paddingVertical: 10,
  },
  weatherItem: { alignItems: 'center', flexDirection: 'row', gap: 5 },
  weatherText: { fontSize: 11, fontWeight: '700' },
  plannerRow: { flexDirection: 'row', gap: Spacing.md },
  plannerCard: {
    alignItems: 'flex-start', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1,
    flex: 1, gap: 8, padding: Spacing.lg,
  },
  plannerIcon: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.md, height: 40,
    justifyContent: 'center', marginBottom: 2, width: 40,
  },
  plannerTitle: { fontSize: 14, fontWeight: '800' },
  plannerCopy: { fontSize: 12, lineHeight: 17, minHeight: 34 },
  storyCard: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1,
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.sm,
  },
  storyImage: { borderCurve: 'continuous', borderRadius: Radius.md, height: 76, width: 76 },
  storyCopy: { flex: 1, gap: 6 },
  storyTitle: { fontSize: 14, fontWeight: '800', lineHeight: 19 },
  storyMeta: { fontSize: 11, fontWeight: '600' },
});
