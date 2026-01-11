import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';

const { width, height } = Dimensions.get('window');
const SCANNER_SIZE = Math.min(width * 0.7, 280);

export default function ScannerScreen({ onScanSuccess, onCancel }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCANNER_SIZE - 2],
  });

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      let parsedData;
      if (data.startsWith('INVENTO:')) {
        const parts = data.split(':');
        if (parts.length >= 3) {
          parsedData = {
            format: 'INVENTO',
            userId: parts[1],
            email: parts[2],
            raw: data,
            timestamp: new Date().toISOString(),
          };
        } else {
          throw new Error('Invalid INVENTO QR format');
        }
      } else {
        parsedData = JSON.parse(data);
        parsedData.timestamp = new Date().toISOString();
      }
      onScanSuccess(parsedData);
    } catch (error) {
      console.error('QR Parse Error:', error);
      const errorData = {
        verified: false,
        error: 'INVALID_QR',
        message: 'QR code format not recognized',
        raw: data,
        timestamp: new Date().toISOString(),
      };
      onScanSuccess(errorData);
    }
  };

  const handleCameraReady = () => {
    console.log('Camera is ready!');
    setCameraReady(true);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.cameraIcon}>
          <Text style={styles.cameraIconText}>📷</Text>
        </View>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need permission to scan event passes.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Text style={styles.cancelLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        onCameraReady={handleCameraReady}
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Show loading indicator until camera is ready */}
      {!cameraReady && (
        <View style={styles.cameraLoadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Starting camera...</Text>
        </View>
      )}

      {/* Mask Overlay */}
      <View style={styles.maskContainer} pointerEvents="box-none">
        <View style={styles.maskRow} />
        <View style={styles.maskCenterRow}>
          <View style={styles.maskSide} />
          <View style={styles.scanWindow}>
            {/* Scanner Corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Animated Laser Line */}
            {!scanned && cameraReady && (
              <Animated.View
                style={[
                  styles.laserLine,
                  { transform: [{ translateY }] }
                ]}
              />
            )}
          </View>
          <View style={styles.maskSide} />
        </View>
        <View style={styles.maskRow} />
      </View>

      {/* UI Controls */}
      <View style={styles.uiContainer} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.topControls} pointerEvents="none">
          <Text style={styles.headerTitle}>Scan Pass</Text>
          <Text style={styles.headerSubtitle}>Align QR code within the frame</Text>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomControls} pointerEvents="box-none">
          {/* Torch Toggle */}
          <TouchableOpacity
            style={[styles.iconButton, torch && styles.iconButtonActive]}
            onPress={() => setTorch(!torch)}
            activeOpacity={0.7}
          >
            <Text style={[styles.iconText, torch && styles.iconTextActive]}>
              {torch ? '🔦' : '💡'}
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Processing Overlay */}
      {scanned && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  cameraLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 14,
  },
  
  // Permission Screen
  permissionContainer: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 40,
  },
  cameraIconText: {
    fontSize: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 24,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelLink: {
    marginTop: 24,
    padding: 10,
  },
  cancelLinkText: {
    color: '#52525b',
    fontSize: 14,
  },

  // Mask Overlay
  maskContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskRow: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  maskCenterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanWindow: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    backgroundColor: 'transparent',
    position: 'relative',
  },

  // Scanner Corners
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFF',
    borderWidth: 4,
    borderRadius: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  laserLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    position: 'absolute',
    top: 0,
  },

  // UI Controls
  uiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  topControls: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#FFF',
  },
  iconText: {
    fontSize: 24,
  },
  iconTextActive: {
    opacity: 1,
  },
  closeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '300',
  },

  // Processing State
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});