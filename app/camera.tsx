import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  useColorScheme,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, CircleAlert as AlertCircle, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AnimatedCamera } from '@/components/AnimatedCamera';
import { CameraOverlay } from '@/components/CameraOverlay';
import { Button } from '@/components/Button';
import { sampleAnalyses } from '@/data/sampleData';
import { saveAnalysisToStorage } from '@/data/analysisStorage';
import Constants from 'expo-constants';
import { FadeModal } from '@/components/FadeModal';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export default function CameraScreen() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const colors = Colors['dark'];
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [hasCapture, setHasCapture] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      if (Platform.OS === 'web') {
        setHasCapture(true);
        setCapturedImage('https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg');
      } else {
        const photo = await cameraRef.current.takePictureAsync();
        setHasCapture(true);
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to take picture. Please try again.\n ${error}`);
    }
  };

  const handleRetake = () => {
    setHasCapture(false);
    setCapturedImage(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const base64 = await (await fetch(capturedImage)).blob().then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));

      const today = new Date();
      const todayString = today.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      // Call OpenAI API
      const prompt = `You are an ICT financial chart analysis expert. today's dates is ${todayString}. 
      Analyze the uploaded chart image and return a JSON object with the following keys ONLY:
      - ticker (string)
      - trend (string)
      - volatility (string)
      - volume (string)
      - marketSentiment (string)
      - gamePlan (string, paragraph)
      - detailedAnalysis (array of 5 objects, each with {title: string, description: string}, see below for exact required titles and order)
      - imageAnalysisSummary (string, optional)

      For the detailedAnalysis array, always include EXACTLY 5 objects, in this order, with these titles:
      1. "Daily Bias" — Analyze why the chart is bullish or bearish.
      2. "Order / Breaker Block" — Identify any order or breaker block, specify price points, give a 1 min explicit explanation on how to trade using this Order / Breaker Block in this scenario.
      3. "Fair Value Gap" — Identify any fair value gap, specify price points, give a 1 min explicit explanation how to trade using this Fair Value Gap in this scenario.
      4. "Economic Data" — List the dates of the most important upcoming US economic data release in the next 7 days from today, these data maybe Non-Farm Payrolls (NFP), Consumer Price Index (CPI), 
      Federal Funds Rate / FOMC Statement, Gross Domestic Product (GDP), Unemployment Rate, Average Hourly Earnings, Core CPI / Core PCE Price Index, ISM Manufacturing and Services PMIs, 
      Retail Sales, Initial Jobless Claims and give a 1 min explicit explanation on how it affects price direction in this scenario, give me the exact dates (DD-MMM), example: higher CPI is bad for risk assets since america is trying to fight inflation.
      5. "Moon Phase" — List the date of new moon or full moon in the next month from today and give a 1 min explicit explanation on how it affects price direction in this scenario, give me the exact dates (DD-MMM), example: new moon usually means new beginnings which could lead to more buys in the market.

      If any item is not found, set description to "Not detected" or "No significant [item] found."

      Return only the JSON object, with all fields present. Do not include any explanation or formatting outside the JSON.

      Example:
      {
        "ticker": "AAPL",
        "trend": "Bullish",
        "volatility": "High",
        "volume": "Medium",
        "marketSentiment": "Neutral",
        "gamePlan": "Wait for a pullback to the support level before entering long. Set stop loss below recent swing low.",
        "detailedAnalysis": [
          {"title": "Daily Bias", "description": "The chart shows a strong bullish trend with higher highs and higher lows."},
          {"title": "Order / Breaker Block", "description": "Order block detected at $180.50 - $182.00."},
          {"title": "Fair Value Gap", "description": "Fair value gap between $185.00 and $187.00."},
          {"title": "Economic Data", "description": "Upcoming US CPI data could increase volatility in tech stocks."},
          {"title": "Moon Phase", "description": "Next full moon is historically associated with increased volatility."}
        ],
        "imageAnalysisSummary": "The chart indicates a bullish continuation setup."
      }

      `;
      Alert.alert('prompt: ', prompt);
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
      let content: string | undefined = data.choices?.[0]?.message?.content;
      let parsed: any = null;
      try {
        if (content) {
          parsed = JSON.parse(content);
        }
      } catch (e) {
        if (content) {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
        }
      }
      if (!parsed) {
        throw new Error(
          'Could not parse analysis result.\nRaw content: ' + (content ?? '[No content]') +
          '\nRaw API response: ' + JSON.stringify(data)
        );
      }
      const result = {
        id: Date.now().toString(),
        imageUri: capturedImage,
        symbol: parsed.ticker,
        trend: parsed.trend,
        volatility: parsed.volatility,
        volume: parsed.volume,
        marketSentiment: parsed.marketSentiment,
        gamePlan: parsed.gamePlan,
        detailedAnalysis: parsed.detailedAnalysis,
        imageAnalysisSummary: parsed.imageAnalysisSummary,
        createdAt: Date.now(),
      };
      await saveAnalysisToStorage(result);
      router.push({ pathname: '/result', params: { id: result.id } });
    } catch (err) {
      Alert.alert('Error', `Failed to analyze image.\n${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.permissionCard, { backgroundColor: colors.card }]}>
          <CameraIcon size={48} color={colors.primary} style={styles.permissionIcon} />
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: colors.textDim }]}>
            We need camera access to analyze trading charts. Your photos are processed securely
            and never shared without your permission.
          </Text>
          <Button
            title="Grant Camera Access"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <TouchableOpacity
        style={{ alignSelf: 'flex-end', margin: 8 }}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: colors.primary }}>Show Info</Text>
      </TouchableOpacity>
      <FadeModal visible={showModal} onClose={() => setShowModal(false)}>
        <View style={{ backgroundColor: colors.card, padding: 24, borderRadius: 16 }}>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Camera Info</Text>
          <Text style={{ color: colors.text, marginBottom: 16 }}>
            Use the camera to capture a chart for analysis. Your photo will not be uploaded or shared.
          </Text>
          <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
            <Text style={{ color: colors.primary }}>Close</Text>
          </TouchableOpacity>
        </View>
      </FadeModal>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      {hasCapture ? (
        <View style={styles.reviewContainer}>
          <AnimatedCamera>
            {capturedImage && (
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            )}
          </AnimatedCamera>

          <View style={styles.reviewControls}>
            <Button
              title="Retake"
              variant="outline"
              onPress={handleRetake}
              style={styles.reviewButton}
            />
            <Button
              title="Analyze Chart"
              onPress={handleAnalyze}
              loading={isAnalyzing}
              style={styles.reviewButton}
            />
          </View>
        </View>
    ) : (
      <>
        <View style={{ flex: 1 }}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          />
          <CameraOverlay
            onCapture={handleCapture}
            onClose={() => router.push('/')}
            onGallery={() => {
              setHasCapture(true);
              setCapturedImage('https://i.imgur.com/FICdenm.png');
            }}
          />
        </View>

        {/* <View style={[styles.tipContainer, { backgroundColor: colors.card }]}>
          <AlertCircle size={16} color={colors.warning} style={styles.tipIcon} />
          <Text style={[styles.tipText, { color: colors.textDim }]}>
            For best results, ensure good lighting and a clear view of the chart
          </Text>
        </View> */}
      </>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionIcon: {
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    minWidth: 240,
  },
  reviewContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 80,
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  reviewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  reviewButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
});