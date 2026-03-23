import { Pressable, Text } from "react-native";
import { Church } from "@/lib/churches";

interface ChurchCardProps {
  church: Church;
  onSelect: () => void;
}

export function ChurchCard({ church, onSelect }: ChurchCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      className="rounded-2xl border border-amber-400/30 bg-violet-900/80 p-6 active:opacity-80"
    >
      <Text className="text-xl font-semibold text-white">{church.name}</Text>
      <Text className="mt-1 text-sm text-amber-200/60">
        {church.subdomain}
      </Text>
    </Pressable>
  );
}
