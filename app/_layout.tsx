import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChurchProvider } from "@/lib/ChurchContext";
import { AudioPlayerProvider } from "@/lib/AudioPlayerContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <ChurchProvider>
      <AudioPlayerProvider>
        <GluestackUIProvider mode="dark">
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="light" />
        </GluestackUIProvider>
      </AudioPlayerProvider>
    </ChurchProvider>
  );
}
