import { create } from "zustand";

interface SongsCartState {
  songs: string[];
  setSongs: (songs: string[]) => void;
  addSong: (song: string) => void;
  removeSong: (song: string) => void;
}

export const useSongsCart = create<SongsCartState>(set => ({
  songs: [],
  addSong: song => set(state => ({ songs: [...state.songs, song] })),
  setSongs: songs => set({ songs }),
  removeSong: song =>
    set(state => ({
      songs: state.songs.filter(s => s !== song),
    })),
}));
