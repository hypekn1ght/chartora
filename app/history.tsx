import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, History as HistoryIcon, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AnalysisCard } from '@/components/AnalysisCard';
import { EmptyState } from '@/components/EmptyState';
import { sampleAnalyses } from '@/data/sampleData';
import { Analysis } from '@/types/Analysis';
import { useAnalysisStore } from '@/data/analysisStorage';

export default function HistoryScreen() {
  const colors = Colors['dark'];
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish'>('all');
  const userAnalyses = useAnalysisStore(state => state.analyses);

  const allAnalyses = [...userAnalyses, ...sampleAnalyses];
  const filteredAnalyses = allAnalyses.filter(analysis => {
    if (filter === 'all') return true;
    return analysis.direction === filter;
  });

  const handleAnalysisPress = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderAnalysisItem = ({ item }: { item: Analysis }) => (
    <AnalysisCard
      analysis={item}
      expanded={expandedId === item.id}
      onPress={() => handleAnalysisPress(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <Text style={[styles.title, { color: colors.text }]}>Analysis History</Text>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? '#fff' : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'bullish' && { backgroundColor: colors.chart.bullish },
          ]}
          onPress={() => setFilter('bullish')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'bullish' ? '#fff' : colors.text },
            ]}
          >
            Bullish
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'bearish' && { backgroundColor: colors.chart.bearish },
          ]}
          onPress={() => setFilter('bearish')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'bearish' ? '#fff' : colors.text },
            ]}
          >
            Bearish
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterIconButton,
            { backgroundColor: colors.card },
          ]}
          onPress={() => {}}
        >
          <Filter size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {filteredAnalyses.length > 0 ? (
        <FlatList
          data={filteredAnalyses}
          renderItem={renderAnalysisItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon={<HistoryIcon size={40} color={colors.textDim} />}
          title="No Analysis Found"
          description="You haven't analyzed any charts matching this filter yet. Try changing your filter or capture a new chart."
          actionLabel="Scan New Chart"
          onAction={() => router.push('/camera')}
        />
      )}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  filterIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
});