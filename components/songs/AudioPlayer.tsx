import { useRef, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useAudioPlayer } from "@/lib/AudioPlayerContext";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getPlayerHtml(videoId: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
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

    var player;
    var timeInterval;

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        videoId: '${videoId}',
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          controls: 0,
          modestbranding: 1,
          origin: 'https://holymusic.co'
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    }

    function onPlayerReady(e) {
      e.target.unMute();
      e.target.setVolume(100);
      e.target.playVideo();
      startTimeUpdates();
    }

    function onPlayerStateChange(e) {
      if (e.data === YT.PlayerState.ENDED) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ended' }));
      } else if (e.data === YT.PlayerState.PLAYING) {
        startTimeUpdates();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'playing' }));
      } else if (e.data === YT.PlayerState.PAUSED) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'paused' }));
      }
    }

    function onPlayerError(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', code: e.data }));
    }

    function startTimeUpdates() {
      if (timeInterval) clearInterval(timeInterval);
      timeInterval = setInterval(function() {
        if (player && player.getCurrentTime && player.getDuration) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'time',
            current: player.getCurrentTime(),
            duration: player.getDuration()
          }));
        }
      }, 500);
    }

    // Listen for commands from React Native
    window.addEventListener('message', function(e) {
      var data = JSON.parse(e.data);
      if (data.command === 'play') player.playVideo();
      if (data.command === 'pause') player.pauseVideo();
      if (data.command === 'seek') player.seekTo(data.time, true);
      if (data.command === 'load') {
        player.loadVideoById(data.videoId);
        player.unMute();
        player.setVolume(100);
      }
    });
  </script>
</body>
</html>`;
}

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    isShuffleEnabled,
    queue,
    currentTime,
    duration,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    onTimeUpdate,
    onVideoEnded,
  } = useAudioPlayer();

  const webViewRef = useRef<WebView>(null);
  const currentVideoId = useRef<string | null>(null);
  const isWebViewReady = useRef(false);

  const sendCommand = useCallback((command: object) => {
    webViewRef.current?.postMessage(JSON.stringify(command));
  }, []);

  // Handle play/pause from context
  useEffect(() => {
    if (!isWebViewReady.current) return;
    sendCommand({ command: isPlaying ? "play" : "pause" });
  }, [isPlaying, sendCommand]);

  // Handle song change
  useEffect(() => {
    if (!currentSong) return;
    const videoId = currentSong.video_links?.[0]?.video_id;
    if (!videoId) return;

    if (isWebViewReady.current && currentVideoId.current) {
      // WebView already loaded, just load new video
      sendCommand({ command: "load", videoId });
    }
    currentVideoId.current = videoId;
  }, [currentSong, sendCommand]);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "time") {
        onTimeUpdate(data.current, data.duration);
      } else if (data.type === "ended") {
        onVideoEnded();
      } else if (data.type === "playing") {
        isWebViewReady.current = true;
      } else if (data.type === "error") {
        next();
      }
    },
    [onTimeUpdate, onVideoEnded, next]
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (queue.length === 0) return null;

  const videoId = currentSong?.video_links?.[0]?.video_id;

  return (
    <View className="border-t border-violet-800 bg-violet-950">
      {/* Hidden WebView for YouTube playback */}
      {videoId && (
        <View style={{ height: 0, overflow: "hidden" }}>
          <WebView
            ref={webViewRef}
            source={{
              html: getPlayerHtml(videoId),
              baseUrl: "https://holymusic.co",
            }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleMessage}
            style={{ height: 1, width: 1 }}
          />
        </View>
      )}

      {/* Progress bar */}
      <View className="h-1 bg-violet-900">
        <View
          className="h-1 bg-amber-400"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Controls */}
      <View className="flex-row items-center px-4 py-3">
        {/* Song info */}
        <View className="flex-1 mr-3">
          <Text
            className="text-base font-semibold text-violet-100"
            numberOfLines={1}
          >
            {currentSong?.title ?? "No hay canción"}
          </Text>
          {currentSong && duration > 0 && (
            <Text className="text-xs text-violet-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          )}
        </View>

        {/* Control buttons */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={toggleShuffle}
            className="rounded-full p-3 active:opacity-70"
          >
            <Ionicons
              name="shuffle"
              size={24}
              color={isShuffleEnabled ? "#fbbf24" : "#7c3aed"}
            />
          </Pressable>
          <Pressable
            onPress={previous}
            className="rounded-full p-3 active:opacity-70"
          >
            <Ionicons name="play-skip-back" size={24} color="#c4b5fd" />
          </Pressable>
          <Pressable
            onPress={togglePlay}
            className="rounded-full bg-amber-400 p-3.5 active:opacity-80"
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={28}
              color="#1e1b4b"
            />
          </Pressable>
          <Pressable
            onPress={next}
            className="rounded-full p-3 active:opacity-70"
          >
            <Ionicons name="play-skip-forward" size={24} color="#c4b5fd" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
