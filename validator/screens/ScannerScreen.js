import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions, Platform, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Zap, ZapOff, X, Camera } from 'lucide-react-native';

const { width } = Dimensions.get('window');
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
    outputRange: [0, SCANNER_SIZE],
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
            format: 'INVENTO', userId: parts[1], email: parts[2], raw: data, timestamp: new Date().toISOString(),
          };
        } else {
          throw new Error('Invalid Format');
        }
      } else {
        parsedData = JSON.parse(data);
        parsedData.timestamp = new Date().toISOString();
      }
      onScanSuccess(parsedData);
    } catch (error) {
      onScanSuccess({
        verified: false,
        error: 'INVALID_QR',
        raw: data,
        timestamp: new Date().toISOString(),
      });
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-zinc-950 justify-center items-center p-6">
        <View className="w-16 h-16 bg-zinc-900 rounded-full items-center justify-center mb-4">
          <Camera color="white" size={30} />
        </View>
        <Text className="text-white text-lg font-bold">Camera Access Required</Text>
        <TouchableOpacity 
          className="bg-white px-8 py-3 rounded-full mt-6" 
          onPress={requestPermission}
        >
          <Text className="text-black font-bold">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* CAMERA LAYER */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        onCameraReady={() => setCameraReady(true)}
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* OVERLAY LAYER (Grid Method for Perfect Alignment) */}
      <View style={StyleSheet.absoluteFill} className="z-10" pointerEvents="box-none">
        
        {/* Top Dark Bar */}
        <View className="flex-1 bg-black/60 w-full items-center justify-end pb-10">
           <Text className="text-white text-lg font-semibold uppercase tracking-widest">Scan Pass</Text>
        </View>

        {/* Middle Row */}
        <View style={{ height: SCANNER_SIZE }} className="flex-row w-full">
            <View className="flex-1 bg-black/60" />
            
            {/* The Scanning Hole */}
            <View style={{ width: SCANNER_SIZE, height: SCANNER_SIZE }} className="relative">
                {/* Corners */}
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />
                
                {/* Animated Laser */}
                {!scanned && cameraReady && (
                    <Animated.View 
                        style={{ transform: [{ translateY }] }} 
                        className="w-full h-1 bg-cyan-400 shadow shadow-cyan-400" 
                    />
                )}
            </View>

            <View className="flex-1 bg-black/60" />
        </View>

        {/* Bottom Dark Bar */}
        <View className="flex-1 bg-black/60 w-full items-center pt-10">
            <Text className="text-white/50 text-xs">Align QR code within the frame</Text>
            
            {/* Controls */}
            <View className="flex-row items-center space-x-12 mt-auto mb-16">
                <TouchableOpacity 
                    onPress={() => setTorch(!torch)}
                    className={`w-14 h-14 rounded-full items-center justify-center ${torch ? 'bg-white' : 'bg-white/10'}`}
                >
                    {torch ? <ZapOff size={24} color="black" /> : <Zap size={24} color="white" />}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={onCancel}
                    className="w-16 h-16 bg-red-500 rounded-full items-center justify-center shadow-lg"
                >
                    <X size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
      </View>

      {/* Processing State */}
      {scanned && (
        <View className="absolute inset-0 bg-black/80 z-20 items-center justify-center">
          <ActivityIndicator size="large" color="#FFF" />
          <Text className="text-white mt-4 font-bold tracking-widest uppercase">Verifying...</Text>
        </View>
      )}
    </View>
  );
}