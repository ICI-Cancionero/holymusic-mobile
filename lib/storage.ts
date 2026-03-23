import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_CHURCH_KEY = "selected_church";

export async function getSelectedChurch(): Promise<string | null> {
  return AsyncStorage.getItem(SELECTED_CHURCH_KEY);
}

export async function setSelectedChurch(subdomain: string): Promise<void> {
  await AsyncStorage.setItem(SELECTED_CHURCH_KEY, subdomain);
}

export async function clearSelectedChurch(): Promise<void> {
  await AsyncStorage.removeItem(SELECTED_CHURCH_KEY);
}
