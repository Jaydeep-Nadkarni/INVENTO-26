import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * HomeScreen - Welcome screen for INVENTO Validator
 * Dark spy theme with high contrast for easy readability
 * Uses NativeWind for styling
 * 
 * @param {Function} onVerify - Callback to navigate to scanner screen
 */
export default function HomeScreen({ onVerify }) {
  return (
    <View className="flex-1 bg-[#0a0a0a] justify-between items-center py-16 px-5">
      {/* Header Section */}
      <View className="flex-1 justify-center items-center w-full">
        <Text className="text-[10px] font-black text-[#dc2626] tracking-[3px] bg-[#1a0a0a] px-4 py-1 border border-[#dc2626] mb-8 uppercase">
          CLASSIFIED
        </Text>
        <Text className="text-5xl font-black text-white tracking-[4px] text-center mb-1 uppercase">
          INVENTO
        </Text>
        <Text className="text-3xl font-bold text-[#f5c842] tracking-[8px] text-center mb-5 uppercase">
          VALIDATOR
        </Text>
        <View className="w-20 h-0.5 bg-[#f5c842] my-5" />
        <Text className="text-base font-semibold text-gray-500 tracking-[2px] text-center uppercase">
          Spyverse Clearance Check
        </Text>
      </View>

      {/* Main Action */}
      <View className="flex-1 justify-center items-center w-full">
        <TouchableOpacity 
          onPress={onVerify}
          activeOpacity={0.8}
          className="bg-[#f5c842] w-full py-6 px-8 rounded-lg shadow-lg mb-6"
        >
          <View className="flex-col items-center justify-center">
            <Text className="text-[40px] mb-2">🔍</Text>
            <Text className="text-xl font-black text-black tracking-[2px] text-center uppercase">
              VERIFY USER
            </Text>
          </View>
        </TouchableOpacity>

        <Text className="text-sm text-gray-500 text-center leading-5 px-5">
          Tap to scan QR codes and verify agent credentials
        </Text>
      </View>

      {/* Footer Info */}
      <View className="items-center w-full pb-5">
        <Text className="text-xs font-semibold text-[#dc2626] tracking-[1px] mb-2 uppercase">
          🔒 Authorized Personnel Only
        </Text>
        <Text className="text-[10px] text-gray-600 tracking-[1px] uppercase">
          v1.0.0 | INVENTO 2026
        </Text>
      </View>
    </View>
  );
}
