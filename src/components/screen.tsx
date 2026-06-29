import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@src/constants/theme';
import { nativeWindClasses, useAppTheme } from '@src/theme/theme-manager';

type ScreenProps = PropsWithChildren<{
  contentContainerStyle?: ViewStyle;
}>;

export function Screen({ children, contentContainerStyle }: ScreenProps) {
  const { palette } = useAppTheme();

  return (
    <SafeAreaView
      className={nativeWindClasses.screen}
      style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 18,
  },
});
