import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

const memoryStorage = new Map<string, string>();

export const appStateStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(name);
    }

    return (await SecureStore.getItemAsync(name)) ?? memoryStorage.get(name) ?? null;
  },
  setItem: async (name, value) => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(name, value);
      return;
    }

    memoryStorage.set(name, value);
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(name);
      return;
    }

    memoryStorage.delete(name);
    await SecureStore.deleteItemAsync(name);
  },
};
