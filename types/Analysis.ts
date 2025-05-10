export interface Analysis {
  id: string;
  symbol?: string;
  timestamp?: number;
  direction?: 'bullish' | 'bearish' | 'neutral';
  pattern?: string;
  confidence?: number;
  entry?: string;
  target?: string;
  stopLoss?: string;
  summary?: string;
  imageUri?: string;
  // New AI fields
  trend?: string;
  volatility?: string;
  volume?: string;
  marketSentiment?: string;
  gamePlan?: string;
  detailedAnalysis?: { title: string; description: string }[];
  imageAnalysisSummary?: string;
  createdAt?: number;
}