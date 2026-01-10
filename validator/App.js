import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';

/**
 * INVENTO Validator App
 * Main entry point for the QR code validation application
 * 
 * Screens:
 * - home: Initial home/welcome screen
 * - scanner: QR code scanner using camera
 * - result: Validation result display
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scanData, setScanData] = useState(null);

  /**
   * Navigate to scanner screen
   */
  const handleStartScan = () => {
    setScanData(null);
    setCurrentScreen('scanner');
  };

  /**
   * Handle successful QR code scan
   * @param {Object} data - Scanned data containing QR information
   */
  const handleScanSuccess = (data) => {
    setScanData(data);
    setCurrentScreen('result');
  };

  /**
   * Return to home screen
   */
  const handleReturnHome = () => {
    setScanData(null);
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Screen Router */}
      {currentScreen === 'home' && (
        <HomeScreen onVerify={handleStartScan} />
      )}

      {currentScreen === 'scanner' && (
        <ScannerScreen 
          onScanSuccess={handleScanSuccess} 
          onCancel={handleReturnHome}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen 
          scanData={scanData} 
          onNextParticipant={handleStartScan}
          onReturnHome={handleReturnHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanDataText: {
    fontSize: 12,
    color: '#f5c842',
    fontFamily: 'monospace',
    marginTop: 20,
    textAlign: 'center',
  },
});
