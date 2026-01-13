import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Image } from 'react-native';

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <View className="flex-1 bg-slate-950 items-center justify-center">
            {/* Background Glow Effect */}
            <View className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }}
                className="items-center"
            >
                {/* Logo SVG */}
                <View className="mb-8">
                    <Image
                        source={require('../assets/images/Logo-loader.svg')}
                        style={{ width: 120, height: 120 }}
                        resizeMode="contain"
                    />
                </View>

                {/* Text */}
                <Text className="text-4xl font-black text-white tracking-[4px] text-center mb-2">
                    INVENTO
                </Text>
                <Text className="text-sm font-medium text-cyan-400 tracking-[3px] uppercase">
                    Pass Validator
                </Text>

                {/* Loading Indicator */}
                <View className="mt-12 flex-row items-center space-x-2">
                    <View className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <View className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <View className="w-2 h-2 bg-cyan-500 rounded-full" />
                </View>

                <Text className="text-xs text-slate-500 tracking-wider mt-6 uppercase">
                    Loading System...
                </Text>
            </Animated.View>
        </View>
    );
};

export default SplashScreen;
