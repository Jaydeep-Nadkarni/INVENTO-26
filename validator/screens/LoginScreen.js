import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Lock, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react-native';

// Use localhost for emulator, or your machine IP for physical device
// Android Emulator uses 10.0.2.2 usually.
// NOTE: Replace 192.168.x.x with YOUR actual machine IP (run: ipconfig)
const BASE_URL = "http://192.168.1.6:5000"; // CHANGE THIS TO YOUR LOCAL IP IF TESTING ON DEVICE


const LoginScreen = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [accessId, setAccessId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async () => {
        if (!email || !accessId) {
            Alert.alert('Missing Fields', 'Please enter both Email and Access ID.');
            return;
        }

        setLoading(true);

        try {
            // Find the correct API endpoint
            // NOTE: For now using a hardcoded IP. In production, use ENV.
            // Assuming the user runs this on same network.

            const response = await fetch(`${BASE_URL}/api/volunteers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    accessId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onLoginSuccess(data.volunteer);
            } else {
                Alert.alert('Access Denied', data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Connection Error', 'Could not connect to server. Ensure you are on the same network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 justify-center px-8"
            >
                <View className="mb-10">
                    <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
                    <Text className="text-slate-400 text-base">Enter your volunteer credentials to continue.</Text>
                </View>

                <View className="space-y-4">
                    <View className="space-y-2">
                        <Text className="text-slate-300 font-medium ml-1">Email Address</Text>
                        <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                            <Mail color="#94a3b8" size={20} />
                            <TextInput
                                placeholder="tech@invento.com"
                                placeholderTextColor="#475569"
                                className="flex-1 ml-3 text-white text-base"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <View className="space-y-2 mb-6">
                        <Text className="text-slate-300 font-medium ml-1">Access ID</Text>
                        <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                            <Lock color="#94a3b8" size={20} />
                            <TextInput
                                placeholder="INV-TECH-001"
                                placeholderTextColor="#475569"
                                className="flex-1 ml-3 text-white text-base"
                                autoCapitalize="none"
                                secureTextEntry={!showPassword}
                                value={accessId}
                                onChangeText={setAccessId}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff color="#94a3b8" size={20} />
                                ) : (
                                    <Eye color="#94a3b8" size={20} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`flex-row justify-center items-center bg-cyan-500 py-4 rounded-xl shadow-lg shadow-cyan-500/20 ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#0f172a" />
                        ) : (
                            <>
                                <Text className="text-slate-950 font-bold text-lg uppercase tracking-wider mr-2">Login</Text>
                                <ChevronRight color="#0f172a" size={20} strokeWidth={3} />
                            </>
                        )}
                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
