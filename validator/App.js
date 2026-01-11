import React, { useState } from 'react';
import { View } from 'react-native';
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
    <View className="flex-1">
      <StatusBar style="light" />

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

