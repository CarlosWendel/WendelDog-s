import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getJSON(key, fallback = null) {
  const v = await AsyncStorage.getItem(key);
  if (v == null) return fallback;
  try { return JSON.parse(v); } catch { return fallback; }
}

export async function setJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}