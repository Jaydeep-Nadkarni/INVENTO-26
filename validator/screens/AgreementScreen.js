import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react-native';

export default function AgreementScreen({ onAgree }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (!isChecked) {
      Alert.alert('Required', 'Please accept the terms to proceed.');
      return;
    }
    onAgree();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 mt-8">
        {/* Scrollable Agreement Content */}
        <ScrollView className="flex-1 px-6 py-8" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">Authorization</Text>
            <Text className="text-slate-400 text-base">Pass Verification Terms</Text>
          </View>

          {/* Agreement Box */}
          <View className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <Text className="text-slate-300 text-sm leading-6">
              By proceeding, I acknowledge that I am authorized to scan and verify event passes for INVENTO 2026 using the official system. I agree to use this access responsibly, only for authorized event purposes, and to maintain the confidentiality of all participant information. Any misuse of this authority may result in immediate revocation of access.
            </Text>
          </View>
        </ScrollView>

        {/* Fixed Checkbox and Button at Bottom */}
        <View className="px-6 py-6 mb-16 border-t border-slate-800 bg-slate-950">
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            className="flex-row items-center space-x-3 mb-6"
          >
            {isChecked ? (
              <CheckCircle2 size={24} color="#06b6d4" strokeWidth={2} />
            ) : (
              <Circle size={24} color="#94a3b8" strokeWidth={2} />
            )}
            <Text className="text-slate-300 font-medium flex-1">
              I agree to the Pass Verification Authorization terms.
            </Text>
          </TouchableOpacity>

          {/* Proceed Button */}
          <TouchableOpacity
            onPress={handleAgree}
            disabled={!isChecked}
            className={`flex-row justify-center items-center py-4 rounded-xl shadow-lg ${
              isChecked
                ? 'bg-cyan-500 shadow-cyan-500/20'
                : 'bg-slate-700 shadow-slate-900/20 opacity-50'
            }`}
          >
            <Text
              className={`font-bold text-lg uppercase tracking-wider mr-2 ${
                isChecked ? 'text-slate-950' : 'text-slate-500'
              }`}
            >
              Accept & Continue
            </Text>
            <ChevronRight
              color={isChecked ? '#0f172a' : '#94a3b8'}
              size={20}
              strokeWidth={3}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
