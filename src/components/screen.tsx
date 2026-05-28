import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@src/constants/theme';
import { useColorScheme } from '@src/hooks/use-color-scheme';

type ScreenProps = PropsWithChildren<{
  contentContainerStyle?: ViewStyle;
}>;

export function Screen({ children, contentContainerStyle }: ScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme].background }]}>
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
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
