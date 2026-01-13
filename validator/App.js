import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles } from 'lucide-react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ResultScreen from './screens/ResultScreen';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AgreementScreen from './screens/AgreementScreen';
import LoginScreen from './screens/LoginScreen';

import "./global.css"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // splash, onboarding, agreement, login, home, scanner, result
  const [scanData, setScanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // Check auth status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulated splash delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const token = await AsyncStorage.getItem('userToken');
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');

        if (token) {
          setUserToken(token);
          setCurrentScreen('home');
        } else {
          if (isFirstLaunch === null) {
            setCurrentScreen('onboarding');
            await AsyncStorage.setItem('isFirstLaunch', 'false');
          } else {
            setCurrentScreen('agreement');
          }
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auth Handlers
  const handleLoginSuccess = async (userData) => {
    try {
      // In a real app, you'd store a JWT token. Here we store the user object/ID.
      await AsyncStorage.setItem('userToken', JSON.stringify(userData));
      setUserToken(userData);
      setCurrentScreen('home');
    } catch (e) {
      console.error("Login Persist Error", e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    setCurrentScreen('login');
  };


  // Navigation Handlers
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

  const handleFinishOnboarding = () => {
    setCurrentScreen('agreement');
  };

  const handleAgreem = () => {
    setCurrentScreen('login');
  };

  if (isLoading || currentScreen === 'splash') {
    return <SplashScreen />;
  }

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onFinish={handleFinishOnboarding} />
      )}

      {currentScreen === 'agreement' && (
        <AgreementScreen onAgree={handleAgreem} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen user={userToken} onVerify={handleStartScan} onLogout={handleLogout} />
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

