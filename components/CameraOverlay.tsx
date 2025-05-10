import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface CameraOverlayProps {
  onCapture: () => void;
  onClose: () => void;
  onGallery: () => void;
}

export function CameraOverlay({ onCapture, onClose, onGallery }: CameraOverlayProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.overlay}>
      {/* Chart Guides */}
      <View style={styles.guideContainer}>
        <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
        <View style={[styles.cornerTR, { borderColor: colors.primary }]} />
        <View style={[styles.cornerBL, { borderColor: colors.primary }]} />
        <View style={[styles.cornerBR, { borderColor: colors.primary }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.card }]}
          onPress={onClose}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text, backgroundColor: colors.card }]}>
          Align Chart
        </Text>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.card }]}>
        <Text style={[styles.instructionText, { color: colors.text }]}>
          Position the trading chart within the frame
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.galleryButton, { backgroundColor: colors.card }]}
          onPress={onGallery}
        >
          <ImageIcon size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
          <View style={[styles.captureOuter, { borderColor: colors.primary }]}>
            <View style={[styles.captureInner, { backgroundColor: colors.primary }]} />
          </View>
        </TouchableOpacity>

        <View style={styles.placeholderButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 16,
  },
  guideContainer: {
    ...StyleSheet.absoluteFillObject,
    margin: 40,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 16,
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    borderRadius: 20,
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructions: {
    alignSelf: 'center',
    padding: 12,
    borderRadius: 24,
    marginTop: -120,
  },
  instructionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
});