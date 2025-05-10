import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onOptions?: () => void;
  transparent?: boolean;
}

export function Header({ title, onBack, onOptions, transparent = false }: HeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.border,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {onOptions && (
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={onOptions}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 4,
  },
  leftContainer: {
    width: 40,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  optionsButton: {
    padding: 4,
  },
});