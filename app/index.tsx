import { useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChurch } from "@/lib/ChurchContext";
import { CHURCHES } from "@/lib/churches";
import { ChurchCard } from "@/components/ChurchCard";

export default function IndexScreen() {
  const { church, selectChurch, isLoading } = useChurch();

  useEffect(() => {
    if (!isLoading && church) {
      router.replace("/church-home");
    }
  }, [isLoading, church]);

  if (isLoading || church) {
    return null;
  }

  const handleSelect = async (subdomain: string) => {
    await selectChurch(subdomain);
    router.replace("/church-home");
  };

  return (
    <SafeAreaView className="flex-1 bg-violet-950">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-5xl font-bold text-amber-400">Holymusic</Text>
        <Text className="mt-4 text-center text-lg text-violet-300">
          Select your church
        </Text>
        <View className="mt-10 w-full gap-4">
          {CHURCHES.map((c) => (
            <ChurchCard
              key={c.subdomain}
              church={c}
              onSelect={() => handleSelect(c.subdomain)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
