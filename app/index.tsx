import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-violet-950 px-8">
      <Text className="text-5xl font-bold text-amber-400">Holymusic</Text>
      <Text className="mt-4 text-center text-lg text-violet-300">
        Your sacred space for music discovery and inspiration.
      </Text>
      <View className="mt-8 rounded-full bg-amber-400 px-8 py-3">
        <Text className="text-base font-semibold text-violet-950">
          Get Started
        </Text>
      </View>
    </View>
  );
}
