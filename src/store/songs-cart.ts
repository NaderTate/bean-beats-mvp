import { create } from "zustand";

interface SongsCartState {
  songs: { [songId: string]: number };
  setSongs: (songs: { [songId: string]: number }) => void;
  addSong: (songId: string) => void;
  removeSong: (songId: string) => void;
}

export const useSongsCart = create<SongsCartState>((set) => ({
  songs: {},
  setSongs: (songs) => set({ songs }),
  addSong: (songId) =>
    set((state) => {
      const quantity = state.songs[songId] || 0;
      return { songs: { ...state.songs, [songId]: quantity + 1 } };
    }),
  removeSong: (songId) =>
    set((state) => {
      const quantity = state.songs[songId] || 0;
      if (quantity <= 1) {
        const { [songId]: _, ...rest } = state.songs;
        return { songs: rest };
      } else {
        return { songs: { ...state.songs, [songId]: quantity - 1 } };
      }
    }),
}));
