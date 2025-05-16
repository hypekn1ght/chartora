import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';

interface FadeModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayColor?: string;
}

export const FadeModal: React.FC<FadeModalProps> = ({
  visible,
  onClose,
  children,
  overlayColor = 'rgba(0,0,0,0.5)',
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity style={[styles.overlay, { backgroundColor: overlayColor }]} activeOpacity={1} onPress={onClose}>
      <View style={styles.centered}>{children}</View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    minWidth: '80%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
