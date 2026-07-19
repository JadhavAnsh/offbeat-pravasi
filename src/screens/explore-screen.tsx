import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@src/api/client';
import { AsyncState } from '@src/components/async-state';
import { env } from '@src/config/env';
import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { TrekCard } from '@src/features/treks/components/trek-card';
import { TrekValidationBadge } from '@src/features/treks/components/validation-badge';
import { useNearbyTreks, useTreks } from '@src/features/treks/hooks';
import { useToggleWishlist, useWishlistItems } from '@src/features/wishlist/hooks';
import { useDebouncedValue } from '@src/hooks/use-debounced-value';
import { APP_ROUTES } from '@src/navigation/routes';
import { useAppTheme } from '@src/theme/theme-manager';

import type { TrekDifficulty, TrekSort, TrekValidationStatus } from '@src/features/treks/types';

type LocationState = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function ExploreScreen() {
  const params = useLocalSearchParams<{
    difficulty?: string;
    maxCost?: string;
    nearby?: string;
    sort?: string;
    state?: string;
  }>();
  const { palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const columns = width >= 760 ? 2 : 1;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>();
  const [locationState, setLocationState] = useState<LocationState>('idle');
  const [locationMessage, setLocationMessage] = useState('');

  const difficulty = first(params.difficulty) as TrekDifficulty | undefined;
  const sort = first(params.sort) as TrekSort | undefined;
  const state = first(params.state);
  const parsedMaxCost = Number(first(params.maxCost));
  const maxCost = Number.isFinite(parsedMaxCost) && parsedMaxCost > 0 ? parsedMaxCost : undefined;
  const nearby = first(params.nearby) === 'true';
  const filters = useMemo(
    () => ({ difficulty, maxCost, q: debouncedSearch || undefined, sort, state, limit: 12 }),
    [debouncedSearch, difficulty, maxCost, sort, state]
  );

  const trekQuery = useTreks(filters);
  const nearbyQuery = useNearbyTreks(coordinates?.latitude, coordinates?.longitude);
  const wishlistQuery = useWishlistItems();
  const wishlistMutation = useToggleWishlist();
  const savedIds = useMemo(() => new Set((wishlistQuery.data ?? []).map((item) => item.trekId)), [wishlistQuery.data]);
  const regularTreks = useMemo(() => trekQuery.data?.pages.flatMap((page) => page.items) ?? [], [trekQuery.data]);
  const treks = nearby && coordinates ? nearbyQuery.data ?? [] : regularTreks;
  const activeQuery = nearby && coordinates ? nearbyQuery : trekQuery;
  const activeFilterCount = [difficulty, maxCost, sort, state].filter(Boolean).length;
  const validation = trekQuery.data?.pages.at(-1)?.validation;
  const validationState = activeQuery.isLoading
    ? 'pending'
    : activeQuery.error
      ? 'error'
      : 'validated';

  const requestNearby = async () => {
    setLocationState('loading');
    setLocationMessage('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationState('denied');
        setLocationMessage('Location permission was denied. You can still choose a region manually.');
        return;
      }
      const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 });
      const position = lastKnown ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocationState('ready');
    } catch {
      setLocationState('error');
      setLocationMessage('We could not read your location. Try again or choose a region manually.');
    }
  };

  const openFilters = () => router.push({
    pathname: APP_ROUTES.exploreFilters,
    params: {
      ...(difficulty ? { difficulty } : {}),
      ...(maxCost ? { maxCost: String(maxCost) } : {}),
      ...(sort ? { sort } : {}),
      ...(state ? { state } : {}),
    },
  });

  const renderEmpty = () => {
    if (nearby && !coordinates) {
      return (
        <AsyncState
          actionLabel={locationState === 'loading' ? undefined : 'Use my location'}
          description={locationMessage || 'Share your location when you are ready and we will look for trails within 100 km.'}
          icon="near-me"
          onAction={requestNearby}
          title={locationState === 'loading' ? 'Finding your location…' : 'Discover nearby trails'}
        />
      );
    }
    if (activeQuery.isLoading) return <LoadingTreks />;
    if (activeQuery.error) {
      const offline = activeQuery.error instanceof ApiError && activeQuery.error.status === 0;
      const missingPreviewAccess = activeQuery.error instanceof ApiError &&
        activeQuery.error.status === 401 &&
        !env.apiKey;
      return (
        <AsyncState
          actionLabel="Try again"
          description={offline
            ? 'You appear to be offline. Reconnect and retry.'
            : missingPreviewAccess
              ? 'This build has no API key. Add EXPO_PUBLIC_API_KEY to its EAS environment, then create a new build or update.'
              : activeQuery.error.message}
          icon={offline ? 'wifi-off' : 'error-outline'}
          onAction={() => activeQuery.refetch()}
          title={offline ? 'No connection' : 'Could not load treks'}
        />
      );
    }
    const hasFilters = Boolean(debouncedSearch || activeFilterCount || nearby);
    return (
      <AsyncState
        actionLabel={hasFilters ? 'Clear filters' : 'Refresh'}
        description={hasFilters ? 'Try a broader search, another region, or fewer filters.' : 'There are no published treks yet. Check back soon for new trails.'}
        icon={hasFilters ? 'search-off' : 'landscape'}
        onAction={hasFilters ? () => { setSearch(''); router.replace('/explore'); } : () => activeQuery.refetch()}
        title={hasFilters ? 'No matching trails' : 'New escapes are on the way'}
      />
    );
  };

  return (
    <FlatList
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={trekQuery.isFetchingNextPage ? <ActivityIndicator color={palette.tint} style={styles.footerLoader} /> : null}
      ListHeaderComponent={
        <ExploreHeader
          activeFilterCount={activeFilterCount}
          difficulty={difficulty}
          nearby={nearby}
          onClear={() => { setSearch(''); router.replace('/explore'); }}
          onFilters={openFilters}
          onQuickFilter={(next) => router.replace(next)}
          onSearch={setSearch}
          search={search}
          sort={sort}
          validation={validation}
          validationState={validationState}
        />
      }
      columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
      contentContainerStyle={[
        styles.listContent,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing['3xl'] },
        treks.length === 0 && styles.emptyContent,
      ]}
      contentInsetAdjustmentBehavior="automatic"
      data={treks}
      key={columns}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      numColumns={columns}
      onEndReached={() => {
        if (!nearby && trekQuery.hasNextPage && !trekQuery.isFetchingNextPage) trekQuery.fetchNextPage();
      }}
      onEndReachedThreshold={0.4}
      onRefresh={() => activeQuery.refetch()}
      refreshing={activeQuery.isRefetching && !activeQuery.isLoading}
      renderItem={({ item }) => (
        <View style={styles.cardColumn}>
          <TrekCard
            onPress={() => router.push(APP_ROUTES.trek(item.id))}
            onToggleSaved={item.source === 'api' ? () => wishlistMutation.mutate(item.id) : undefined}
            saved={savedIds.has(item.id)}
            saving={wishlistMutation.isPending && wishlistMutation.variables === item.id}
            trek={item}
          />
        </View>
      )}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: palette.background }}
    />
  );
}

type ExploreHeaderProps = {
  activeFilterCount: number;
  difficulty?: TrekDifficulty;
  nearby: boolean;
  onClear: () => void;
  onFilters: () => void;
  onQuickFilter: (href: '/explore' | { pathname: '/explore'; params: Record<string, string> }) => void;
  onSearch: (value: string) => void;
  search: string;
  sort?: TrekSort;
  validation?: TrekValidationStatus;
  validationState: 'error' | 'pending' | 'validated';
};

function ExploreHeader({ activeFilterCount, difficulty, nearby, onClear, onFilters, onQuickFilter, onSearch, search, sort, validation, validationState }: ExploreHeaderProps) {
  const { palette } = useAppTheme();
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text selectable style={[styles.eyebrow, { color: palette.tint }]}>FIND YOUR NEXT TRAIL</Text>
          <Text selectable style={[styles.title, { color: palette.text }]}>Explore beyond the obvious.</Text>
        </View>
        <TrekValidationBadge status={validationState} validation={validation} />
      </View>

      <View style={[styles.searchFrame, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <MaterialIcons color={palette.icon} name="search" size={22} />
        <TextInput
          accessibilityLabel="Search treks"
          autoCapitalize="none"
          onChangeText={onSearch}
          placeholder="Search trails, places, or states"
          placeholderTextColor={palette.muted}
          returnKeyType="search"
          style={[styles.searchInput, { color: palette.text }]}
          value={search}
        />
        {search ? (
          <Pressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => onSearch('')}>
            <MaterialIcons color={palette.icon} name="cancel" size={20} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.quickFilters}>
        <QuickChip active={!nearby && !difficulty && !sort && activeFilterCount === 0} label="All" onPress={onClear} />
        <QuickChip active={nearby} icon="near-me" label="Nearby" onPress={() => onQuickFilter({ pathname: '/explore', params: { nearby: 'true' } })} />
        <QuickChip active={difficulty === 'EASY'} label="Easy" onPress={() => onQuickFilter({ pathname: '/explore', params: { difficulty: 'EASY' } })} />
        <QuickChip active={sort === 'popular'} label="Popular" onPress={() => onQuickFilter({ pathname: '/explore', params: { sort: 'popular' } })} />
        <QuickChip active={activeFilterCount > 0 && !difficulty && !sort} icon="tune" label={activeFilterCount ? `Filters · ${activeFilterCount}` : 'Filters'} onPress={onFilters} />
      </View>

      <View style={styles.resultsHeading}>
        <Text selectable style={[styles.resultsTitle, { color: palette.text }]}>{nearby ? 'Trails near you' : 'Available escapes'}</Text>
        {(search || activeFilterCount || nearby) ? <Pressable hitSlop={8} onPress={onClear}><Text style={[styles.clearText, { color: palette.tint }]}>Reset</Text></Pressable> : null}
      </View>
    </View>
  );
}

function QuickChip({ active, icon, label, onPress }: { active: boolean; icon?: ComponentProps<typeof MaterialIcons>['name']; label: string; onPress: () => void }) {
  const { palette } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.quickChip, { backgroundColor: active ? palette.tint : palette.surface, borderColor: active ? palette.tint : palette.border }]}>
      {icon ? <MaterialIcons color={active ? palette.background : palette.icon} name={icon} size={16} /> : null}
      <Text style={[styles.quickChipText, { color: active ? palette.background : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

function LoadingTreks() {
  const { palette } = useAppTheme();
  return (
    <View accessibilityLabel="Loading treks" style={styles.loadingStack}>
      {[0, 1].map((item) => (
        <View key={item} style={[styles.skeletonCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={[styles.skeletonImage, { backgroundColor: palette.surfaceMuted }]} />
          <View style={styles.skeletonCopy}>
            <View style={[styles.skeletonLine, { backgroundColor: palette.surfaceMuted, width: '70%' }]} />
            <View style={[styles.skeletonLine, { backgroundColor: palette.surfaceMuted, width: '46%' }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, gap: Spacing.md, paddingHorizontal: Spacing.xl },
  emptyContent: { flexGrow: 1 },
  header: { gap: Spacing.lg, paddingBottom: Spacing.sm },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.md, justifyContent: 'space-between' },
  titleCopy: { flex: 1, gap: 5 },
  eyebrow: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontFamily: Fonts.rounded, fontSize: 30, fontWeight: '900', letterSpacing: -0.7, lineHeight: 35 },
  searchFrame: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.sm, minHeight: 52, paddingHorizontal: Spacing.md },
  searchInput: { flex: 1, fontSize: 15, minHeight: 50 },
  quickFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickChip: { alignItems: 'center', borderRadius: Radius.pill, borderWidth: 1, flexDirection: 'row', gap: 5, minHeight: 40, justifyContent: 'center', paddingHorizontal: 13, paddingVertical: 8 },
  quickChipText: { fontSize: 12, fontWeight: '800' },
  resultsHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.xs },
  resultsTitle: { fontFamily: Fonts.rounded, fontSize: 20, fontWeight: '800' },
  clearText: { fontSize: 13, fontWeight: '800' },
  cardColumn: { flex: 1, paddingBottom: Spacing.md },
  columnWrapper: { gap: Spacing.md },
  footerLoader: { padding: Spacing.xl },
  loadingStack: { gap: Spacing.md },
  skeletonCard: { borderCurve: 'continuous', borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  skeletonImage: { height: 174 },
  skeletonCopy: { gap: Spacing.sm, padding: Spacing.lg },
  skeletonLine: { borderRadius: Radius.pill, height: 14 },
});
