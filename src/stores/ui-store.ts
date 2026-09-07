import { create } from "zustand";
type UIState = { menuOpen: boolean; setMenuOpen: (open: boolean) => void };
// Only shared UI state belongs here; form state stays in React Hook Form.
export const useUIStore = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
