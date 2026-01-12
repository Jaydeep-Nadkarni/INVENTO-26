import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Image } from 'react-native';

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <View className="flex-1 bg-slate-950 items-center justify-center">
            <Animated.View style={{ opacity: fadeAnim }} className="items-center">
                {/* You can replace this with an actual Logo Image if available */}
                <View className="w-32 h-32 bg-cyan-500 rounded-full items-center justify-center mb-6 shadow-lg shadow-cyan-500/50">
                    <Text className="text-4xl font-bold text-white">IV</Text>
                </View>
                <Text className="text-3xl font-bold text-cyan-400 tracking-widest text-center">
                    INVENTO
                </Text>
                <Text className="text-sm font-light text-slate-400 tracking-[5px] mt-2 uppercase">
                    Validator Access
                </Text>
            </Animated.View>
        </View>
    );
};

export default SplashScreen;
