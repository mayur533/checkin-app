import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Animated, Easing, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { checkInReservation } from '../services/api';
import { saveScanHistory } from '../services/history';

interface CameraDevice {
  id: string;
  name: string;
  type: CameraType;
}

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraType>('back');
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // Animation for corner thickness (using scale and opacity)
  const cornerScale = useRef(new Animated.Value(1)).current;
  const cornerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const loadCameras = async () => {
    try {
      // Default cameras that are typically available
      const cameras: CameraDevice[] = [
        { id: 'back', name: 'Back Camera', type: 'back' },
        { id: 'front', name: 'Front Camera', type: 'front' },
      ];
      
      // Note: expo-camera doesn't directly expose external camera enumeration
      // External cameras would need to be detected through native modules
      // For now, we'll show the standard cameras
      // In production, you might want to use a native module to detect external cameras
      setAvailableCameras(cameras);
    } catch (error) {
      console.error('Error loading cameras:', error);
      Alert.alert('Error', 'Failed to load cameras. Please try again.');
    }
  };

  // Load available cameras
  useEffect(() => {
    if (permission?.granted) {
      loadCameras();
    }
  }, [permission]);

  // Corner animation - thickening and thinning
  useEffect(() => {
    const animateCorners = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(cornerScale, {
              toValue: 1.4,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(cornerScale, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(cornerOpacity, {
              toValue: 0.7,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(cornerOpacity, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    animateCorners();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      const response = await checkInReservation(data);

      // Save to history
      await saveScanHistory({
        qrToken: data,
        success: response.success,
        message: response.message,
        attendedAt: response.attendedAt,
      });

      setLoading(false);

      if (response.success) {
        navigation.navigate('Success', { 
          message: response.message,
          attendedAt: response.attendedAt 
        });
      } else {
        navigation.navigate('Failed', { message: response.message });
      }
    } catch (error) {
      setLoading(false);
      
      // Save failed scan to history
      await saveScanHistory({
        qrToken: data,
        success: false,
        message: 'An unexpected error occurred',
      });
      
      navigation.navigate('Failed', { message: 'An unexpected error occurred' });
    }

    // Reset scanned state after navigation
    setTimeout(() => setScanned(false), 3500);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <Text style={styles.permissionSubText}>
          Please grant camera access to scan QR codes
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={selectedCamera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          {/* Settings button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowCameraModal(true)}
            >
              <MaterialIcons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Top overlay - transparent */}
          <View style={styles.overlayTop} />

          {/* Middle section with scanner frame */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlayLeft} />
            
            {/* Scanner Frame Container */}
            <View style={styles.scannerFrameContainer}>
              {/* Rounded corner indicators with animation */}
              {/* Top Left Corner */}
              <Animated.View
                style={[
                  styles.roundedCorner,
                  styles.cornerTopLeft,
                  {
                    transform: [{ scale: cornerScale }],
                    opacity: cornerOpacity,
                  },
                ]}
              />
              {/* Top Right Corner */}
              <Animated.View
                style={[
                  styles.roundedCorner,
                  styles.cornerTopRight,
                  {
                    transform: [{ scale: cornerScale }],
                    opacity: cornerOpacity,
                  },
                ]}
              />
              {/* Bottom Left Corner */}
              <Animated.View
                style={[
                  styles.roundedCorner,
                  styles.cornerBottomLeft,
                  {
                    transform: [{ scale: cornerScale }],
                    opacity: cornerOpacity,
                  },
                ]}
              />
              {/* Bottom Right Corner */}
              <Animated.View
                style={[
                  styles.roundedCorner,
                  styles.cornerBottomRight,
                  {
                    transform: [{ scale: cornerScale }],
                    opacity: cornerOpacity,
                  },
                ]}
              />
            </View>

            <View style={styles.overlayRight} />
          </View>

          {/* Bottom overlay with text - transparent */}
          <View style={styles.overlayBottom}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Checking reservation...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.instructionText}>Scan QR Code to Check-in</Text>
                <Text style={styles.instructionSubText}>
                  Position the QR code within the frame
                </Text>
              </>
            )}
          </View>
        </View>
      </CameraView>

      {/* Camera Selection Modal */}
      <Modal
        visible={showCameraModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCameraModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCameraModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.cameraList}>
              {/* Camera Selection Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Select Camera</Text>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={loadCameras}
                  >
                    <MaterialIcons name="refresh" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
                {availableCameras.map((camera) => (
                  <TouchableOpacity
                    key={camera.id}
                    style={[
                      styles.cameraOption,
                      selectedCamera === camera.type && styles.cameraOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedCamera(camera.type);
                      setShowCameraModal(false);
                    }}
                  >
                    <Text style={[
                      styles.cameraOptionText,
                      selectedCamera === camera.type && styles.cameraOptionTextSelected,
                    ]}>
                      {camera.name}
                    </Text>
                    {selectedCamera === camera.type && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Scan History Section */}
              <View style={[styles.sectionContainer, styles.lastSection]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Scan History</Text>
                </View>
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => {
                    setShowCameraModal(false);
                    navigation.navigate('History');
                  }}
                >
                  <MaterialIcons name="history" size={20} color="#fff" />
                  <Text style={styles.historyButtonText}>View All Scans</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 300,
  },
  overlayLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayRight: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scannerFrameContainer: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  roundedCorner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderColor: '#10b981',
    borderWidth: 6,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 24,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 24,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 24,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 24,
  },
  instructionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionSubText: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionSubText: {
    color: '#d1d5db',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
      modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '90%',
      },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
  },
  cameraList: {
    padding: 20,
    paddingBottom: 0,
  },
  cameraOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cameraOptionSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  cameraOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  cameraOptionTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

