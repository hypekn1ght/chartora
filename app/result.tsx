import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useColorScheme, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Share2, ArrowLeft, BookmarkPlus, BookmarkCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Button } from '@/components/Button';
import { sampleAnalyses } from '@/data/sampleData';
import { Analysis } from '@/types/Analysis';
import { getAnalysisById } from '@/data/analysisStorage';

export default function ResultScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      let found = await getAnalysisById(id as string);
      if (!found) {
        found = sampleAnalyses.find(item => item.id === id);
      }
      if (found) {
        setAnalysis(found);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/')}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }}>Loading analysis...</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${analysis.direction} analysis for ${analysis.symbol}. Pattern: ${analysis.pattern}, Target: ${analysis.target}`,
        title: `${analysis.symbol} Trading Analysis`,
      });
    } catch (error) {
      console.error('Error sharing analysis:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const isBullish = analysis.direction === 'bullish';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => router.push('/')}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Analysis Result</Text>
      
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBookmark}>
          {isBookmarked ? (
            <BookmarkCheck size={24} color={colors.primary} />
          ) : (
            <BookmarkPlus size={24} color={colors.text} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Share2 size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {analysis.imageUri && (
            <Image
              source={{ uri: analysis.imageUri }}
              style={styles.chartImage}
              resizeMode="cover"
            />
          )}
          
          <View style={[styles.symbolOverlay, { backgroundColor: colors.card }]}>
            <Text style={[styles.symbolText, { color: colors.text }]}>{analysis.symbol}</Text>
            <View 
              style={[
                styles.directionPill, 
                { 
                  backgroundColor: isBullish 
                    ? colors.chart.bullish 
                    : colors.chart.bearish 
                }
              ]}
            >
              <Text style={styles.directionText}>
                {isBullish ? 'BULLISH' : 'BEARISH'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.confidenceBar, { backgroundColor: colors.card }]}>
          <Text style={[styles.confidenceLabel, { color: colors.textDim }]}>
            AI Confidence
          </Text>
          <View style={styles.confidenceBarContainer}>
            <View 
              style={[
                styles.confidenceFill, 
                { 
                  width: `${analysis.confidence}%`,
                  backgroundColor: 
                    analysis.confidence > 80 
                      ? colors.success 
                      : analysis.confidence > 50 
                        ? colors.warning 
                        : colors.error 
                }
              ]} 
            />
          </View>
          <Text 
            style={[
              styles.confidenceValue, 
              { 
                color: 
                  analysis.confidence > 80 
                    ? colors.success 
                    : analysis.confidence > 50 
                      ? colors.warning 
                      : colors.error 
              }
            ]}
          >
            {analysis.confidence}%
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Pattern Detected
          </Text>
          <Text style={[styles.patternName, { color: colors.text }]}>
            {analysis.pattern}
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Trade Recommendation
          </Text>
          <View style={styles.tradeRecommendation}>
            <View style={styles.recommendationItem}>
              <Text style={[styles.recommendationLabel, { color: colors.textDim }]}>
                Entry
              </Text>
              <Text style={[styles.recommendationValue, { color: colors.text }]}>
                {analysis.entry}
              </Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={[styles.recommendationLabel, { color: colors.textDim }]}>
                Target
              </Text>
              <Text style={[styles.recommendationValue, { color: colors.success }]}>
                {analysis.target}
              </Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={[styles.recommendationLabel, { color: colors.textDim }]}>
                Stop Loss
              </Text>
              <Text style={[styles.recommendationValue, { color: colors.error }]}>
                {analysis.stopLoss}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Analysis Summary
          </Text>
          <Text style={[styles.summary, { color: colors.text }]}>
            {analysis.summary}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="New Analysis"
            onPress={() => router.push('/camera')}
            variant="primary"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chartImage: {
    width: '100%',
    height: '100%',
  },
  symbolOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  symbolText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  directionPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  directionText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 12,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
  },
  section: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  patternName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  tradeRecommendation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationItem: {
    flex: 1,
  },
  recommendationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  summary: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  actions: {
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    width: '100%',
  },
});