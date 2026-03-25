import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChurch } from "@/lib/ChurchContext";

export default function ChurchHomeScreen() {
  const { church, clearChurch } = useChurch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChangeChurch = async () => {
    setMenuOpen(false);
    await clearChurch();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-violet-950">
      {menuOpen && (
        <Pressable
          className="absolute inset-0 z-10"
          onPress={() => setMenuOpen(false)}
        />
      )}
      <View className="flex-row justify-end px-4 pt-2">
        <View className="relative">
          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 active:opacity-70"
          >
            <Ionicons name="settings-outline" size={24} color="#fbbf24" />
          </Pressable>
          {menuOpen && (
            <View className="absolute right-0 top-12 z-20 min-w-[180px] rounded-xl border border-amber-400/30 bg-violet-900 p-1 shadow-lg">
              <Pressable
                onPress={handleChangeChurch}
                className="flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-violet-800"
              >
                <Ionicons name="swap-horizontal" size={18} color="#c4b5fd" />
                <Text className="text-sm text-violet-200">Change Church</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-lg text-violet-300">Welcome to</Text>
        <Text className="mt-2 text-3xl font-bold text-amber-400">
          {church?.name}
        </Text>
      </View>
    </SafeAreaView>
  );
}
