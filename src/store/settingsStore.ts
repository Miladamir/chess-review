// src/store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    engineDepth: number;
    showArrows: boolean;
    autoFlipBoard: boolean; // New setting
    setEngineDepth: (depth: number) => void;
    toggleArrows: () => void;
    toggleAutoFlipBoard: () => void; // New action
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            engineDepth: 15, // Default
            showArrows: true,
            autoFlipBoard: true, // Default to true to keep current behavior
            setEngineDepth: (depth) => set({ engineDepth: depth }),
            toggleArrows: () => set((state) => ({ showArrows: !state.showArrows })),
            toggleAutoFlipBoard: () => set((state) => ({ autoFlipBoard: !state.autoFlipBoard })),
        }),
        {
            name: 'chess-insight-settings', // Name for localStorage
        }
    )
);