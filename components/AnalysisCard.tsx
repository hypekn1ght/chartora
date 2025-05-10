import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { type Analysis } from '@/types/Analysis';

interface AnalysisCardProps {
  analysis: Analysis;
  expanded?: boolean;
  onPress?: () => void;
}

export function AnalysisCard({ analysis, expanded = false, onPress }: AnalysisCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isBullish = analysis.direction === 'bullish';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.symbol, { color: colors.text }]}>{analysis.symbol}</Text>
          <View
            style={[
              styles.directionPill,
              {
                backgroundColor: isBullish
                  ? colors.chart.bullish
                  : colors.chart.bearish,
              },
            ]}
          >
            {isBullish ? (
              <TrendingUp size={16} color="#fff" />
            ) : (
              <TrendingDown size={16} color="#fff" />
            )}
            <Text style={styles.directionText}>
              {isBullish ? 'Bullish' : 'Bearish'}
            </Text>
          </View>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, { color: colors.textDim }]}>
            AI Confidence
          </Text>
          <Text
            style={[
              styles.confidenceValue,
              {
                color:
                  analysis.confidence > 80
                    ? colors.success
                    : analysis.confidence > 50
                    ? colors.warning
                    : colors.error,
              },
            ]}
          >
            {analysis.confidence}%
          </Text>
        </View>
        {expanded ? (
          <ChevronUp size={24} color={colors.textDim} />
        ) : (
          <ChevronDown size={24} color={colors.textDim} />
        )}
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Pattern Detected
          </Text>
          <Text style={[styles.patternName, { color: colors.text }]}>
            {analysis.pattern}
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
            Trade Recommendation
          </Text>
          <View style={styles.recommendationRow}>
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
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
            Analysis Summary
          </Text>
          <Text style={[styles.summary, { color: colors.text }]}>
            {analysis.summary}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  directionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  directionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  confidenceValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  patternName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recommendationItem: {
    flex: 1,
  },
  recommendationLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  recommendationValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  summary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginTop: 8,
  },
});