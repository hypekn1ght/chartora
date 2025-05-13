import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analysis } from '@/types/Analysis';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'chart_ai_analysis_history';

// Zustand store for persistent global analysis state
interface AnalysisState {
  analyses: Analysis[];
  addAnalysis: (analysis: Analysis) => void;
  removeAnalysis: (id: string) => void;
  clearAnalyses: () => void;
  setAnalyses: (analyses: Analysis[]) => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      analyses: [],
      addAnalysis: (analysis) => set({ analyses: [analysis, ...get().analyses] }),
      removeAnalysis: (id) => set({ analyses: get().analyses.filter(a => a.id !== id) }),
      clearAnalyses: () => set({ analyses: [] }),
      setAnalyses: (analyses) => set({ analyses }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export async function loadAnalysisHistory(): Promise<Analysis[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  return [];
}

export async function saveAnalysisToStorage(item: Analysis): Promise<void> {
  const history = await loadAnalysisHistory();
  const newHistory = [item, ...history];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export async function getAnalysisById(id: string): Promise<Analysis | undefined> {
  const history = await loadAnalysisHistory();
  return history.find(a => a.id === id);
} 