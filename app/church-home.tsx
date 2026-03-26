import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useChurch } from "@/lib/ChurchContext";
import { useSongs } from "@/lib/useSongs";
import { SongSearchBar } from "@/components/songs/SongSearchBar";
import { SongLetterGroup } from "@/components/songs/SongLetterGroup";
import { SongItem } from "@/components/songs/SongItem";
import { AudioPlayer } from "@/components/songs/AudioPlayer";

export default function ChurchHomeScreen() {
  const { church, clearChurch } = useChurch();
  const [menuOpen, setMenuOpen] = useState(false);
  const { groups, isLoading, error, searchQuery, setSearchQuery, retry } =
    useSongs(church?.subdomain);

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
      <View className="flex-row items-center justify-between px-4 pt-2 pb-1">
        <Text className="text-lg font-extrabold text-amber-400">
          Canciones de {church?.name}
        </Text>
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
                <Text className="text-sm text-violet-200">Cambiar Iglesia</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text className="mt-3 text-violet-400">Cargando canciones...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-offline" size={48} color="#f87171" />
          <Text className="mt-3 text-center text-red-400">{error}</Text>
          <Pressable
            onPress={retry}
            className="mt-4 rounded-xl bg-amber-400 px-6 py-3 active:opacity-80"
          >
            <Text className="font-semibold text-violet-950">Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <SectionList
          sections={groups}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section }) => (
            <SongLetterGroup letter={section.letter} count={section.count} />
          )}
          renderItem={({ item }) => <SongItem song={item} />}
          ListHeaderComponent={
            <SongSearchBar value={searchQuery} onChangeText={setSearchQuery} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="musical-notes" size={48} color="#8b5cf6" />
              <Text className="mt-3 text-violet-400">
                {searchQuery
                  ? "No se encontraron canciones"
                  : "No hay canciones disponibles"}
              </Text>
            </View>
          }
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <AudioPlayer />
    </SafeAreaView>
  );
}
