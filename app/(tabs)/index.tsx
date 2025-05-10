import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, ImagePlus } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
      <Image
        source={{ uri: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg' }}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handlePhotoPress}
      >
        <Camera size={32} color="#fff" />
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
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
              <ImagePlus size={24} color="#fff" />
              <Text style={styles.optionText}>Upload Photo</Text>
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
    paddingVertical: 48,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 48,
  },
  button: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 32,
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