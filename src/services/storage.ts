import AsyncStorage from "@react-native-async-storage/async-storage";
import { OtpStorageMap } from "../types/auth";
import { STORAGE_KEYS } from "../constants/config";

const safeJsonParse = <T>(value: string | null): T | null => {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

export const getOtpStore = async (): Promise<OtpStorageMap> => {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEYS.OTP_STORE);

  const parsed = safeJsonParse<OtpStorageMap>(storedValue);

  return parsed ?? {};
};

export const saveOtpStore = async (
  data: OtpStorageMap
): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.OTP_STORE,
    JSON.stringify(data)
  );
};

export const clearOtpStore = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.OTP_STORE);
};

export const saveSessionStart = async (timestamp: number): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.SESSION_START,
    timestamp.toString()
  );
};

export const getSessionStart = async (): Promise<number | null> => {
  const value = await AsyncStorage.getItem(
    STORAGE_KEYS.SESSION_START
  );

  return value ? Number(value) : null;
};

export const clearSessionStart = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_START);
};
