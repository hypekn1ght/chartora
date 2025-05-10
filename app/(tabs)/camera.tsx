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
import { Camera as CameraIcon, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { AnimatedCamera } from '@/components/AnimatedCamera';
import { CameraOverlay } from '@/components/CameraOverlay';
import { Button } from '@/components/Button';
import { sampleAnalyses } from '@/data/sampleData';

export default function CameraScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
        // On web, we'll use a simulated photo capture
        setHasCapture(true);
        setCapturedImage('https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg');
      } else {
        const photo = await cameraRef.current.takePictureAsync();
        setHasCapture(true);
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const handleRetake = () => {
    setHasCapture(false);
    setCapturedImage(null);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate API call to analyze the image
    setTimeout(() => {
      setIsAnalyzing(false);
      // Navigate to the result page with the first sample analysis
      router.push({
        pathname: '/result',
        params: { id: sampleAnalyses[0].id },
      });
    }, 2000);
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions not granted yet
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.background }]}>
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
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          >
            <CameraOverlay
              onCapture={handleCapture}
              onClose={() => router.back()}
              onGallery={() => {
                // For demonstration, we'll use a sample image
                setHasCapture(true);
                setCapturedImage('https://images.pexels.com/photos/7567490/pexels-photo-7567490.jpeg');
              }}
            />
          </CameraView>
          
          <View style={[styles.tipContainer, { backgroundColor: colors.card }]}>
            <AlertCircle size={16} color={colors.warning} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: colors.textDim }]}>
              For best results, ensure good lighting and a clear view of the chart
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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