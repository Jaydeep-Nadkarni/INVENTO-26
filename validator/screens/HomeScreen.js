import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Scan, ShieldAlert, Lock, ChevronRight, Activity } from 'lucide-react-native';

/**
 * HomeScreen - INVENTO Validator
 * Theme: Industrial Dark Mode / High-Tech
 */
export default function HomeScreen({ onVerify }) {
  return (
    <View className="flex-1 bg-[#09090b] relative">
      <StatusBar barStyle="light-content" />
      
      {/* Background Tech Elements (Optional decorative borders) */}
      <View className="absolute top-0 left-0 w-full h-full border-[10px] border-[#18181b] opacity-50 pointer-events-none" />

      <View className="flex-1 justify-between items-center py-20 px-8">
        
        {/* Header Section */}
        <View className="w-full items-center space-y-6">
          {/* Security Badge */}
          <View className="flex-row items-center space-x-2 bg-[#2a1515] px-4 py-2 border border-[#7f1d1d] rounded">
            <ShieldAlert size={14} color="#ef4444" />
            <Text className="text-[10px] font-bold text-[#ef4444] tracking-[3px] uppercase">
              Classified Access
            </Text>
          </View>

          {/* Titles */}
          <View className="items-center mt-8">
            <Text className="text-5xl font-black text-white tracking-[6px] text-center uppercase shadow-sm">
              INVENTO
            </Text>
            <View className="flex-row items-center justify-center space-x-3 mt-2">
              <View className="h-[1px] w-8 bg-[#eab308]" />
              <Text className="text-2xl font-bold text-[#eab308] tracking-[6px] uppercase">
                VALIDATOR
              </Text>
              <View className="h-[1px] w-8 bg-[#eab308]" />
            </View>
          </View>

          {/* Status Text */}
          <View className="flex-row items-center mt-6 opacity-70">
            <Activity size={16} color="#71717a" />
            <Text className="text-xs font-medium text-zinc-400 tracking-[2px] ml-2 uppercase">
              System Online // Ready for Input
            </Text>
          </View>
        </View>

        {/* Main Action Section */}
        <View className="w-full space-y-6">
          <TouchableOpacity 
            onPress={onVerify}
            activeOpacity={0.9}
            className="group w-full"
          >
            {/* Button Container */}
            <View className="bg-[#eab308] w-full py-5 px-6 rounded-lg shadow-xl shadow-yellow-900/20 flex-row items-center justify-between border-b-4 border-[#ca8a04]">
              <View className="flex-row items-center space-x-4">
                <View className="bg-black/10 p-3 rounded-md">
                  <Scan size={28} color="#18181b" strokeWidth={2.5} />
                </View>
                <View>
                  <Text className="text-lg font-black text-[#18181b] tracking-[1px] uppercase">
                    Scan Credentials
                  </Text>
                  <Text className="text-[10px] font-bold text-[#18181b]/70 tracking-[1px] uppercase">
                    Verify Agent Identity
                  </Text>
                </View>
              </View>
              <ChevronRight size={24} color="#18181b" />
            </View>
          </TouchableOpacity>

          <Text className="text-xs text-zinc-500 text-center tracking-wide leading-5 px-4">
            Align camera with authorized QR matrix to proceed with clearance verification.
          </Text>
        </View>

        {/* Footer Info */}
        <View className="items-center space-y-3 w-full border-t border-zinc-800 pt-6">
          <View className="flex-row items-center space-x-2">
            <Lock size={12} color="#52525b" />
            <Text className="text-[10px] font-semibold text-zinc-500 tracking-[2px] uppercase">
              Encrypted Connection
            </Text>
          </View>
          <Text className="text-[10px] text-zinc-700 tracking-[1px] uppercase">
            Invento SecOps v1.0.0
          </Text>
        </View>

      </View>
    </View>
  );
}