import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Sparkles, ScanLine, ShieldCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onFinish }) => {
    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <View className="flex-1 px-8 justify-center items-center">
                {/* Illustration Area */}
                <View className="items-center mb-12">
                    <View className="w-64 h-64 bg-slate-900 border border-slate-800 rounded-2xl items-center justify-center relative overflow-hidden">
                        <View className="absolute w-full h-full bg-cyan-500/5 rotate-45 scale-150" />
                        <ScanLine size={80} color="#22d3ee" className="mb-4" />
                        <ShieldCheck size={40} color="#475569" style={{ position: 'absolute', bottom: 20, right: 20 }} />
                    </View>
                </View>

                {/* Text Content */}
                <View className="items-center mb-16">
                    <Text className="text-3xl font-bold text-white text-center mb-4">
                        Verify Participants
                    </Text>
                    <Text className="text-slate-400 text-center text-lg leading-6">
                        Securely scan event passes and manage entry for INVENTO 2026. Your digital validator tool.
                    </Text>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={onFinish}
                    className="w-full bg-cyan-500 py-4 rounded-xl shadow-lg shadow-cyan-500/20 active:opacity-90"
                >
                    <Text className="text-center text-slate-950 font-bold text-lg uppercase tracking-wider">
                        Access System
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OnboardingScreen;
