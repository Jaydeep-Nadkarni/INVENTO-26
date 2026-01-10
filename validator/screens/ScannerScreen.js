import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

/**
 * ScannerScreen - QR Code Scanner for INVENTO Validator
 * Full-screen camera view with permission handling
 * 
 * @param {Function} onScanSuccess - Callback with scanned data
 * @param {Function} onCancel - Callback to return to home
 */
export default function ScannerScreen({ onScanSuccess, onCancel }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  /**
   * Request camera permission
   */
  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera access is required to scan QR codes.',
          [{ text: 'OK', onPress: onCancel }]
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
      setHasPermission(false);
    }
  };

  /**
   * Handle barcode scan
   * @param {Object} event - Scan event with type and data
   */
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      // Try to parse as JSON first (for structured INVENTO QR codes)
      let parsedData;
      
      if (data.startsWith('INVENTO:')) {
        // Format: INVENTO:userId:email
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
        // Try parsing as JSON
        parsedData = JSON.parse(data);
        parsedData.timestamp = new Date().toISOString();
      }

      // Success - navigate to result screen
      onScanSuccess(parsedData);
      
    } catch (error) {
      // Invalid QR code - treat as NOT VERIFIED
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

  /**
   * Allow user to scan again after successful scan
   */
  const handleScanAgain = () => {
    setScanned(false);
  };

  // Loading state
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Camera access denied</Text>
        <Text style={styles.messageText}>
          Please enable camera permissions in settings
        </Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Scanner view
  return (
    <View style={styles.container}>
      {/* Full-screen camera */}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      />

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>SCAN QR CODE</Text>
          <Text style={styles.subheaderText}>Position QR code within frame</Text>
        </View>

        {/* Scanner Frame */}
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          {scanned ? (
            <View style={styles.scannedContainer}>
              <Text style={styles.scannedText}>✓ QR Code Detected</Text>
              <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={handleScanAgain}
              >
                <Text style={styles.scanAgainText}>SCAN AGAIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              🔍 Align QR code with the frame
            </Text>
          )}
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f5c842',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subheaderText: {
    fontSize: 12,
    color: '#888888',
    letterSpacing: 1,
  },

  // Scanner Frame
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#f5c842',
    borderWidth: 4,
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

  // Controls
  controls: {
    alignItems: 'center',
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scannedContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22c55e',
    marginBottom: 16,
  },
  scanAgainButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginBottom: 16,
  },
  scanAgainText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },

  // Messages
  messageText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
  },
});
