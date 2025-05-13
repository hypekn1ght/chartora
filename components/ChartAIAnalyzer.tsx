import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, FlatList, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RainbowButton } from './ui/rainbow-button';
import { saveAnalysisToStorage, loadAnalysisHistory } from '@/data/analysisStorage';
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const STORAGE_KEY = 'chart_ai_analysis_history';

// Define the expected structure
interface Analysis {
  id: string;
  imageUri: string;
  trend: string;
  volatility: string;
  volume: string;
  marketSentiment: string;
  gamePlan: string;
  detailedAnalysis: { title: string; description: string }[];
  imageAnalysisSummary?: string;
  createdAt: number;
}

export const ChartAIAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<Analysis[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setHistory(JSON.parse(data));
  };

  const saveToHistory = async (item: Analysis) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].uri && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].base64, result.assets[0].uri);
    }
  };

  const analyzeImage = async (base64: string, uri: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const prompt = `You are a financial chart analysis assistant. Analyze the uploaded chart image and return a JSON object with the following keys: trend (string), volatility (string), volume (string), marketSentiment (string), gamePlan (string, paragraph), detailedAnalysis (array of {title, description}), imageAnalysisSummary (string, optional). Example: {"trend":"Bullish","volatility":"High","volume":"Medium","marketSentiment":"Neutral","gamePlan":"...","detailedAnalysis":[{"title":"Bullish Momentum","description":"..."}],"imageAnalysisSummary":"..."}`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: [{ type: 'image_url', image_url: { url: `data:image/png;base64,${base64}` } }] },
          ],
          max_tokens: 1024,
        }),
      });
      const data = await response.json();
      // Try to extract JSON from the response
      let content = data.choices?.[0]?.message?.content;
      let parsed: any = null;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // Try to extract JSON substring
        const match = content.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
      if (!parsed) throw new Error('Could not parse analysis result.');
      const result: Analysis = {
        id: Date.now().toString(),
        imageUri: uri,
        trend: parsed.trend,
        volatility: parsed.volatility,
        volume: parsed.volume,
        marketSentiment: parsed.marketSentiment,
        gamePlan: parsed.gamePlan,
        detailedAnalysis: parsed.detailedAnalysis,
        imageAnalysisSummary: parsed.imageAnalysisSummary,
        createdAt: Date.now(),
      };
      setAnalysis(result);
      saveToHistory(result);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <RainbowButton onPress={pickImage} className="mb-4">
        Upload Chart Image
      </RainbowButton>
      {loading && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}
      {analysis && (
        <View className="mb-8 p-4 rounded-xl bg-gray-900/80">
          <Text className="text-2xl font-bold text-center mb-2">Chart AI</Text>
          <Image source={{ uri: analysis.imageUri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }} resizeMode="contain" />
          <Text className="text-lg font-semibold mb-1">Key Insights</Text>
          <Text>Trend: {analysis.trend}</Text>
          <Text>Volatility: {analysis.volatility}</Text>
          <Text>Volume: {analysis.volume}</Text>
          <Text>Market Sentiment: {analysis.marketSentiment}</Text>
          <Text className="text-lg font-semibold mt-3 mb-1">Game Plan</Text>
          <Text>{analysis.gamePlan}</Text>
          <Text className="text-lg font-semibold mt-3 mb-1">Detailed Analysis</Text>
          {analysis.detailedAnalysis.map((item, idx) => (
            <View key={idx} className="mb-2">
              <Text className="font-bold">{idx + 1}. {item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          ))}
          {analysis.imageAnalysisSummary && (
            <Text className="mt-2 italic text-xs text-gray-400">{analysis.imageAnalysisSummary}</Text>
          )}
        </View>
      )}
      <Text className="text-xl font-bold mb-2">History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 p-3 rounded-lg bg-gray-800/80">
            <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 8 }} resizeMode="cover" />
            <Text className="font-semibold">{item.trend} | {item.volatility}</Text>
            <Text numberOfLines={1} className="text-xs text-gray-400">{item.gamePlan}</Text>
            <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-400">No history yet.</Text>}
      />
    </ScrollView>
  );
}; 