import { View, Text } from "react-native";

interface Props {
  letter: string;
  count: number;
}

export function SongLetterGroup({ letter, count }: Props) {
  return (
    <View className="flex-row items-center gap-2 bg-violet-950 px-4 py-2">
      <Text className="text-xl font-bold text-amber-400">{letter}</Text>
      <View className="rounded-full bg-amber-400/20 px-2 py-0.5">
        <Text className="text-xs font-semibold text-amber-400">{count}</Text>
      </View>
    </View>
  );
}
