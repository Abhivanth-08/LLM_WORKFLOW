import { create } from 'zustand';

export type ModuleId =
  | 'architecture'
  | 'tokenizer'
  | 'embeddings'
  | 'attention'
  | 'profiler'
  | 'context'
  | 'redteaming'
  | 'router';

interface AppState {
  // Navigation
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Math Mode
  mathModeEnabled: boolean;
  toggleMathMode: () => void;

  // Global loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeModule: 'architecture',
  setActiveModule: (module) => set({ activeModule: module }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Math Mode
  mathModeEnabled: false,
  toggleMathMode: () => set((state) => ({ mathModeEnabled: !state.mathModeEnabled })),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
