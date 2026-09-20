import { Audio, type AVPlaybackStatus } from "expo-av";
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
  sound: Audio.Sound | null;

  playTrack: (track: Song, queue?: Song[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
}

async function unloadCurrentSound(sound: Audio.Sound | null) {
  if (!sound) return;
  try {
    await sound.unloadAsync();
  } catch {
    // Already unloaded — ignore.
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  function onStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) {
      if (status.error) {
        set({ isBuffering: false });
      }
      return;
    }
    set({
      isPlaying: status.isPlaying,
      isBuffering: status.isBuffering,
      positionMillis: status.positionMillis,
      durationMillis: status.durationMillis ?? get().durationMillis,
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
    sound: null,

    playTrack: async (track, queue) => {
      const existingQueue = get().queue;
      const nextQueue = queue ?? (existingQueue.some((s) => s.id === track.id) ? existingQueue : [track]);
      const index = nextQueue.findIndex((s) => s.id === track.id);

      // Fire-and-forget play tracking — never blocks playback.
      api.playSong(track.id).catch(() => {});

      await unloadCurrentSound(get().sound);

      set({
        currentTrack: track,
        queue: nextQueue,
        currentIndex: index >= 0 ? index : 0,
        isPlaying: false,
        isBuffering: true,
        positionMillis: 0,
        durationMillis: track.durationSeconds * 1000,
        sound: null,
      });

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: track.audioUrl },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onStatusUpdate
        );
        set({ sound });
      } catch {
        set({ isBuffering: false, isPlaying: false });
      }
    },

    togglePlayPause: async () => {
      const { sound, isPlaying } = get();
      if (!sound) return;
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    },

    seekTo: async (millis) => {
      const { sound } = get();
      if (!sound) return;
      await sound.setPositionAsync(millis);
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
