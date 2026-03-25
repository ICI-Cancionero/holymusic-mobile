import { useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChurch } from "@/lib/ChurchContext";
import { CHURCHES } from "@/lib/churches";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { Ionicons } from "@expo/vector-icons";

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
        <View className="mt-10 w-full">
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="rounded-2xl border border-amber-400/30 bg-violet-900/80 p-4">
              <SelectInput
                placeholder="Choose your church"
                className="text-white placeholder:text-violet-300"
              />
              <SelectIcon
                as={Ionicons}
                name="chevron-down"
                className="text-amber-400"
              />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {CHURCHES.map((c) => (
                  <SelectItem
                    key={c.subdomain}
                    label={c.name}
                    value={c.subdomain}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
      </View>
    </SafeAreaView>
  );
}
