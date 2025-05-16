import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, ImagePlus, History, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { RainbowButton } from '../components/ui/rainbow-button';

export default function Dashboard() {
  const colors = Colors['dark'];
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  const handlePhotoPress = () => {
    setShowOptions(true);
  };

  const handleOptionSelect = (option: 'camera' | 'upload') => {
    setShowOptions(false);
    if (option === 'camera') {
      router.push('/camera');
    } else {
      // For demonstration, we'll use a sample image
      router.push({
        pathname: '/result',
        params: { id: sampleAnalyses[0].id },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/profile')}
        >
          <User size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/history')}
        >
          <History size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handlePhotoPress}
      >
        <Camera size={32} color="#fff" />
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide" // Restored to 'slide' for vertical modal animation on Analyze
        onRequestClose={() => setShowOptions(false)}
      >
      {/*
        To achieve a true horizontal slide transition, consider wrapping the modal content in an Animated.View
        and animating the translateX property using react-native-reanimated or Animated API.
        The built-in Modal only supports 'slide' (vertical) and 'fade'.
      */}
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Option</Text>
            
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.primary }]}
              onPress={() => handleOptionSelect('camera')}
            >
              <Camera size={24} color="#fff" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleOptionSelect('upload')}
            >
              <ImagePlus size={24} color="#000" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.error }]}
              onPress={() => setShowOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: 8,
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
  logo: {
    width: 200,
    height: 200,
  },
  button: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  uploadText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});