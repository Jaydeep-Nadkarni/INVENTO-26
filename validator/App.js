import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [scanData, setScanData] = useState(null);

  const handleStartScan = () => {
    setScanData(null);
    setCurrentScreen('scanner');
  };

  const handleScanSuccess = (data) => {
    setScanData(data);
    setCurrentScreen('result');
  };

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
