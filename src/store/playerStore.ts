import { createAudioPlayer, type AudioPlayer, type AudioStatus } from "expo-audio";
import { create } from "zustand";
import { api } from "../api/endpoints";
import type { Song } from "../api/types";

interface PlayerState {
  queue: Song[];
  currentIndex: number;
  currentTrack: Song | null;
  isPlaying: boolean;
  isBuffering: boolean;
  positionMillis: number;
  durationMillis: number;
  player: AudioPlayer | null;

  playTrack: (track: Song, queue?: Song[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
}

function removeCurrentPlayer(player: AudioPlayer | null) {
  if (!player) return;
  try {
    player.remove();
  } catch {
    // Already removed — ignore.
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  function onStatusUpdate(status: AudioStatus) {
    set({
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      positionMillis: status.currentTime * 1000,
      durationMillis: status.duration > 0 ? status.duration * 1000 : get().durationMillis,
    });
    if (status.didJustFinish) {
      void get().playNext();
    }
  }

  return {
    queue: [],
    currentIndex: -1,
    currentTrack: null,
    isPlaying: false,
    isBuffering: false,
    positionMillis: 0,
    durationMillis: 0,
    player: null,

    playTrack: async (track, queue) => {
      const existingQueue = get().queue;
      const nextQueue = queue ?? (existingQueue.some((s) => s.id === track.id) ? existingQueue : [track]);
      const index = nextQueue.findIndex((s) => s.id === track.id);

      // Fire-and-forget play tracking — never blocks playback.
      api.playSong(track.id).catch(() => {});

      removeCurrentPlayer(get().player);

      set({
        currentTrack: track,
        queue: nextQueue,
        currentIndex: index >= 0 ? index : 0,
        isPlaying: false,
        isBuffering: true,
        positionMillis: 0,
        durationMillis: track.durationSeconds * 1000,
        player: null,
      });

      try {
        const player = createAudioPlayer({ uri: track.audioUrl }, { updateInterval: 500 });
        player.addListener("playbackStatusUpdate", onStatusUpdate);
        player.play();
        set({ player });
      } catch {
        set({ isBuffering: false, isPlaying: false });
      }
    },

    togglePlayPause: async () => {
      const { player, isPlaying } = get();
      if (!player) return;
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    },

    seekTo: async (millis) => {
      const { player } = get();
      if (!player) return;
      await player.seekTo(millis / 1000);
    },

    playNext: async () => {
      const { queue, currentIndex } = get();
      if (queue.length === 0) return;
      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) return;
      await get().playTrack(queue[nextIndex], queue);
    },

    playPrevious: async () => {
      const { queue, currentIndex, positionMillis } = get();
      if (queue.length === 0) return;
      // Standard behaviour: restart current track if more than 3s in, else go back.
      if (positionMillis > 3000 || currentIndex <= 0) {
        await get().seekTo(0);
        return;
      }
      await get().playTrack(queue[currentIndex - 1], queue);
    },
  };
});
