import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@src/constants/theme';
import { useAppTheme } from '@src/theme/theme-manager';

export function DemoBadge() {
  const { mode, palette } = useAppTheme();
  return (
    <View
      accessibilityLabel="Showing development demo data"
      style={[
        styles.badge,
        { backgroundColor: mode === 'dark' ? palette.surfaceMuted : '#FFF4E5', borderColor: palette.border },
      ]}>
      <MaterialIcons color={mode === 'dark' ? palette.text : '#9A5B13'} name="science" size={14} />
      <Text selectable style={[styles.text, { color: mode === 'dark' ? palette.text : '#9A5B13' }]}>DEMO DATA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center', borderCurve: 'continuous', borderRadius: Radius.pill, borderWidth: 1,
    flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: 9, paddingVertical: 5,
  },
  text: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
});
