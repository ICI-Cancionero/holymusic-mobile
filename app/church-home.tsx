import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChurch } from "@/lib/ChurchContext";

export default function ChurchHomeScreen() {
  const { church } = useChurch();

  return (
    <SafeAreaView className="flex-1 bg-violet-950">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-lg text-violet-300">Welcome to</Text>
        <Text className="mt-2 text-3xl font-bold text-amber-400">
          {church?.name}
        </Text>
      </View>
    </SafeAreaView>
  );
}
