import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analysis } from '@/types/Analysis';

const STORAGE_KEY = 'chart_ai_analysis_history';

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