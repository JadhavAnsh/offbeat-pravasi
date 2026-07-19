import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@src/constants/theme';
import { useLogout } from '@src/features/auth/hooks';
import { useAuthStore } from '@src/features/auth/store';
import { useAppTheme } from '@src/theme/theme-manager';
import { getInitials } from '@src/utils/format';

export function AccountScreen() {
  const { palette } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: palette.background }}>
      <View style={[styles.avatar, { backgroundColor: palette.surfaceMuted }]}>
        <Text selectable style={[styles.avatarText, { color: palette.tint }]}>{getInitials(user?.fullName || 'OffBeat Pravasi')}</Text>
      </View>
      <View style={styles.identity}>
        <Text selectable style={[styles.name, { color: palette.text }]}>{user?.fullName || 'OffBeat Pravasi'}</Text>
        <Text selectable style={[styles.email, { color: palette.muted }]}>{user?.email}</Text>
      </View>

      <View style={[styles.note, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <MaterialIcons color={palette.tint} name="verified-user" size={21} />
        <Text selectable style={[styles.noteText, { color: palette.muted }]}>Your session is stored securely on this device.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={logoutMutation.isPending}
        onPress={() => logoutMutation.mutate(undefined, { onSettled: () => router.dismissAll() })}
        style={[styles.logoutButton, { borderColor: palette.border }]}>
        {logoutMutation.isPending ? (
          <ActivityIndicator color="#C62828" />
        ) : (
          <>
            <MaterialIcons color="#C62828" name="logout" size={20} />
            <Text style={styles.logoutText}>Log out</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: Spacing.lg, padding: Spacing.xl },
  avatar: { alignItems: 'center', borderRadius: Radius.pill, height: 82, justifyContent: 'center', width: 82 },
  avatarText: { fontFamily: Fonts.rounded, fontSize: 24, fontWeight: '900' },
  identity: { alignItems: 'center', gap: 4 },
  name: { fontFamily: Fonts.rounded, fontSize: 22, fontWeight: '800' },
  email: { fontSize: 14 },
  note: { alignItems: 'center', alignSelf: 'stretch', borderCurve: 'continuous', borderRadius: Radius.lg, borderWidth: 1, flexDirection: 'row', gap: Spacing.md, padding: Spacing.lg },
  noteText: { flex: 1, fontSize: 13, lineHeight: 19 },
  logoutButton: { alignItems: 'center', alignSelf: 'stretch', borderRadius: Radius.pill, borderWidth: 1, flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', minHeight: 48, paddingHorizontal: Spacing.lg },
  logoutText: { color: '#C62828', fontSize: 15, fontWeight: '800' },
});
