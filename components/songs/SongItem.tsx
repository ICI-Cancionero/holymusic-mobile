import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { Song } from "@/lib/types";

interface Props {
  song: Song;
}

function getEmbedHtml(videoLink: { provider: string; video_id: string }) {
  if (videoLink.provider === "youtube") {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    #player { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="player"></div>
  <script>
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    function onYouTubeIframeAPIReady() {
      new YT.Player('player', {
        videoId: '${videoLink.video_id}',
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, origin: 'https://holymusic.co' },
        events: {
          onReady: function(e) { e.target.unMute(); e.target.setVolume(100); e.target.playVideo(); }
        }
      });
    }
  </script>
</body>
</html>`;
  }

  if (videoLink.provider === "vimeo") {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
  <style>
    * { margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe src="https://player.vimeo.com/video/${videoLink.video_id}?autoplay=1"
    allow="autoplay; fullscreen" allowfullscreen></iframe>
</body>
</html>`;
  }

  return null;
}

export function SongItem({ song }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hasLyrics = !!song.content;
  const hasAudio = song.video_links && song.video_links.length > 0;

  const embedHtml = hasAudio ? getEmbedHtml(song.video_links[0]) : null;

  return (
    <View className="mx-4 mb-2 overflow-hidden rounded-xl border border-violet-800 bg-violet-900/60">
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => setExpanded(!expanded)}
          className="flex-1 flex-row items-center active:opacity-70"
        >
          <Text
            className="flex-1 font-semibold text-violet-100"
            numberOfLines={expanded ? undefined : 1}
          >
            {song.title}
          </Text>
          <View className="ml-2 flex-row items-center gap-1.5">
            {hasLyrics && (
              <View className="rounded-md bg-violet-800 px-1.5 py-0.5">
                <Text className="text-[10px] font-medium text-violet-300">
                  Letra
                </Text>
              </View>
            )}
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#c4b5fd"
            />
          </View>
        </Pressable>
        {hasAudio && (
          <Pressable
            onPress={() => setShowVideo(true)}
            className="ml-2 flex-row items-center gap-1 rounded-md bg-amber-400/20 px-2 py-1 active:bg-amber-400/40"
          >
            <Ionicons name="logo-youtube" size={12} color="#fbbf24" />
            <Text className="text-[10px] font-medium text-amber-400">
              Video
            </Text>
          </Pressable>
        )}
      </View>
      {expanded && hasLyrics && (
        <View className="border-t border-violet-800/50 px-4 pb-4 pt-3">
          <Text className="text-sm leading-5 text-violet-300">
            {song.content}
          </Text>
        </View>
      )}

      <Modal
        visible={showVideo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVideo(false)}
      >
        <View className="flex-1 bg-black">
          <View className="flex-row items-center justify-between bg-violet-950 px-4 pb-3 pt-12">
            <Text
              className="flex-1 text-base font-semibold text-amber-400"
              numberOfLines={1}
            >
              {song.title}
            </Text>
            <Pressable
              onPress={() => setShowVideo(false)}
              className="rounded-full p-2 active:opacity-70"
            >
              <Ionicons name="close" size={24} color="#c4b5fd" />
            </Pressable>
          </View>
          {embedHtml && (
            <WebView
              source={{ html: embedHtml, baseUrl: "https://holymusic.co" }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
              className="flex-1"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
