import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: 'token',
  USER: 'user',
  OFFLINE_ATTENDANCES: 'offline_attendances',
  SETTINGS: 'settings',
};

// Token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(KEYS.TOKEN, token);
  } catch (error) {
    console.error('Erreur sauvegarde token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Erreur lecture token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.TOKEN);
  } catch (error) {
    console.error('Erreur suppression token:', error);
  }
};

// User
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Erreur sauvegarde user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur lecture user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Erreur suppression user:', error);
  }
};

// Pointages offline
export const saveOfflineAttendance = async (attendance) => {
  try {
    const existing = await getOfflineAttendances();
    existing.push(attendance);
    await AsyncStorage.setItem(KEYS.OFFLINE_ATTENDANCES, JSON.stringify(existing));
  } catch (error) {
    console.error('Erreur sauvegarde pointage offline:', error);
  }
};

export const getOfflineAttendances = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.OFFLINE_ATTENDANCES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lecture pointages offline:', error);
    return [];
  }
};

export const clearOfflineAttendances = async () => {
  try {
    await AsyncStorage.setItem(KEYS.OFFLINE_ATTENDANCES, JSON.stringify([]));
  } catch (error) {
    console.error('Erreur nettoyage pointages offline:', error);
  }
};

// Settings
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Erreur sauvegarde paramètres:', error);
  }
};

export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erreur lecture paramètres:', error);
    return {};
  }
};

// Clear all
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Erreur nettoyage storage:', error);
  }
};

export default {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  saveOfflineAttendance,
  getOfflineAttendances,
  clearOfflineAttendances,
  saveSettings,
  getSettings,
  clearAllStorage,
};

