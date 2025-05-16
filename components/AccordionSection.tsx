import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionSectionProps {
  title: string;
  content: string;
  index: number;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, content, index }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggle}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {expanded ? (
          <ChevronUp size={18} color="#fff" />
        ) : (
          <ChevronDown size={18} color="#fff" />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.contentBox}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: '#23242B',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#32343A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#313338',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#6EE7B7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentBox: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    color: '#C9CBCE',
    fontSize: 15,
  },
});
