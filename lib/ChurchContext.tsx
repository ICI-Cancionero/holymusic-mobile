import { createContext, useContext, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Church, CHURCHES } from "@/lib/churches";
import {
  getSelectedChurch,
  setSelectedChurch,
  clearSelectedChurch,
} from "@/lib/storage";

SplashScreen.preventAutoHideAsync();

interface ChurchContextValue {
  church: Church | null;
  selectChurch: (subdomain: string) => Promise<void>;
  clearChurch: () => Promise<void>;
  isLoading: boolean;
}

const ChurchContext = createContext<ChurchContextValue | null>(null);

export function ChurchProvider({ children }: { children: React.ReactNode }) {
  const [church, setChurch] = useState<Church | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const subdomain = await getSelectedChurch();
      if (subdomain) {
        const found = CHURCHES.find((c) => c.subdomain === subdomain) ?? null;
        setChurch(found);
      }
      setIsLoading(false);
      await SplashScreen.hideAsync();
    })();
  }, []);

  const selectChurch = async (subdomain: string) => {
    await setSelectedChurch(subdomain);
    const found = CHURCHES.find((c) => c.subdomain === subdomain) ?? null;
    setChurch(found);
  };

  const clearChurch = async () => {
    await clearSelectedChurch();
    setChurch(null);
  };

  return (
    <ChurchContext.Provider
      value={{ church, selectChurch, clearChurch, isLoading }}
    >
      {children}
    </ChurchContext.Provider>
  );
}

export function useChurch() {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error("useChurch must be used within a ChurchProvider");
  }
  return context;
}
