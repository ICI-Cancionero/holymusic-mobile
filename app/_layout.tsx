import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChurchProvider } from "@/lib/ChurchContext";

export default function RootLayout() {
  return (
    <ChurchProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </ChurchProvider>
  );
}
