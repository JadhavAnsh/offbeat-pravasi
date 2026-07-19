import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { useAppTheme } from '@src/theme/theme-manager';

import type { TrekDifficulty, TrekSort } from '@src/features/treks/types';

const difficulties: { label: string; value: TrekDifficulty }[] = [
  { label: 'Easy', value: 'EASY' }, { label: 'Moderate', value: 'MODERATE' },
  { label: 'Difficult', value: 'DIFFICULT' }, { label: 'Extreme', value: 'EXTREME' },
];
const sorts: { label: string; value: TrekSort }[] = [
  { label: 'Popular', value: 'popular' }, { label: 'Newest', value: 'newest' }, { label: 'Relevant', value: 'relevance' },
];

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function ExploreFiltersScreen() {
  const params = useLocalSearchParams<{ difficulty?: string; maxCost?: string; sort?: string; state?: string }>();
  const { palette } = useAppTheme();
  const [difficulty, setDifficulty] = useState<TrekDifficulty | undefined>(first(params.difficulty) as TrekDifficulty | undefined);
  const [sort, setSort] = useState<TrekSort | undefined>(first(params.sort) as TrekSort | undefined);
  const [state, setState] = useState(first(params.state) ?? '');
  const [maxCost, setMaxCost] = useState(first(params.maxCost) ?? '');

  const apply = () => router.replace({
    pathname: '/explore',
    params: {
      ...(difficulty ? { difficulty } : {}),
      ...(sort ? { sort } : {}),
      ...(state.trim() ? { state: state.trim() } : {}),
      ...(maxCost ? { maxCost } : {}),
    },
  });

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: palette.background }}>
      <FilterSection title="Difficulty">
        <View style={styles.chips}>
          {difficulties.map((item) => (
            <ChoiceChip active={difficulty === item.value} key={item.value} label={item.label} onPress={() => setDifficulty(difficulty === item.value ? undefined : item.value)} />
          ))}
        </View>
      </FilterSection>

      <FilterSection title="Sort by">
        <View style={styles.chips}>
          {sorts.map((item) => (
            <ChoiceChip active={sort === item.value} key={item.value} label={item.label} onPress={() => setSort(sort === item.value ? undefined : item.value)} />
          ))}
        </View>
      </FilterSection>

      <FilterSection title="Region">
        <View style={[styles.inputFrame, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <MaterialIcons color={palette.icon} name="location-on" size={20} />
          <TextInput
            accessibilityLabel="Filter by state or region"
            onChangeText={setState}
            placeholder="Karnataka, Uttarakhand…"
            placeholderTextColor={palette.muted}
            style={[styles.input, { color: palette.text }]}
            value={state}
          />
        </View>
      </FilterSection>

      <FilterSection title="Maximum budget per person">
        <View style={[styles.inputFrame, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.currency, { color: palette.icon }]}>₹</Text>
          <TextInput
            accessibilityLabel="Maximum budget in rupees"
            inputMode="numeric"
            onChangeText={(value) => setMaxCost(value.replace(/\D/g, ''))}
            placeholder="15000"
            placeholderTextColor={palette.muted}
            style={[styles.input, { color: palette.text }]}
            value={maxCost}
          />
        </View>
      </FilterSection>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/explore')} style={[styles.secondaryButton, { borderColor: palette.border }]}>
          <Text style={[styles.secondaryText, { color: palette.text }]}>Clear</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={apply} style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
          <Text style={[styles.primaryText, { color: palette.background }]}>Show treks</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function FilterSection({ children, title }: PropsWithChildren<{ title: string }>) {
  const { palette } = useAppTheme();
  return <View style={styles.section}><Text selectable style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>{children}</View>;
}

function ChoiceChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  const { palette } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? palette.tint : palette.surface, borderColor: active ? palette.tint : palette.border }]}>
      <Text style={[styles.chipText, { color: active ? palette.background : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing['2xl'], padding: Spacing.xl, paddingBottom: Spacing['3xl'] },
  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: Fonts.rounded, fontSize: 17, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { borderRadius: Radius.pill, borderWidth: 1, minHeight: 42, justifyContent: 'center', paddingHorizontal: Spacing.lg, paddingVertical: 9 },
  chipText: { fontSize: 13, fontWeight: '800' },
  inputFrame: { alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.md, borderWidth: 1, flexDirection: 'row', gap: Spacing.sm, minHeight: 50, paddingHorizontal: Spacing.md },
  input: { flex: 1, fontSize: 15, minHeight: 48 },
  currency: { fontSize: 18, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.sm },
  secondaryButton: { alignItems: 'center', borderRadius: Radius.pill, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 48 },
  secondaryText: { fontSize: 14, fontWeight: '800' },
  primaryButton: { alignItems: 'center', borderRadius: Radius.pill, flex: 2, justifyContent: 'center', minHeight: 48 },
  primaryText: { fontSize: 14, fontWeight: '800' },
});
