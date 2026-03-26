import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export function SongSearchBar({ value, onChangeText }: Props) {
  return (
    <View className="mx-4 mb-3 flex-row items-center rounded-xl border border-amber-400/30 bg-violet-900/80 px-3">
      <Ionicons name="search" size={18} color="#c4b5fd" />
      <TextInput
        className="ml-2 flex-1 py-2.5 text-base text-white"
        placeholder="Buscar canciones..."
        placeholderTextColor="#8b5cf6"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#c4b5fd" />
        </Pressable>
      )}
    </View>
  );
}
