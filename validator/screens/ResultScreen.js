import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { CheckCircle2, XCircle, User, Mail, School, IdCard, ArrowRight, Home } from 'lucide-react-native';

const API_URL = 'http://192.168.1.6:5000'; // Update to your server

export default function ResultScreen({ scanData, onNextParticipant, onReturnHome }) {
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateAndFetchData();
  }, [scanData]);

  const validateAndFetchData = async () => {
    setLoading(true);
    try {
      if (scanData?.error || scanData?.verified === false) {
        setValidationResult({
          verified: false,
          message: scanData.message || 'Invalid QR Code Format',
          data: null,
        });
        return;
      }

      if (scanData?.format === 'INVENTO' && scanData?.userId) {
        try {
          const response = await fetch(`${API_URL}/api/users/validate/${scanData.userId}`);
          if (!response.ok) throw new Error(`User not found (${response.status})`);

          const result = await response.json();
          setValidationResult({
            verified: true,
            message: 'Clearance Verified ✓',
            data: {
              userId: scanData.userId,
              email: result.data.email,
              name: result.data.name,
              college: result.data.college,
              type: result.data.passType,
              profilePhoto: result.data.profilePhoto,
            },
          });
        } catch (error) {
          setValidationResult({
            verified: false,
            message: 'User not found in system',
            data: null,
          });
        }
      } else {
        setValidationResult({
          verified: false,
          message: 'Invalid QR Code Format',
          data: null,
        });
      }
    } catch (error) {
      setValidationResult({ verified: false, message: 'Validation error occurred', data: null });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#09090b] justify-center items-center">
        <ActivityIndicator size="large" color="#f5c842" />
        <Text className="text-[#f5c842] mt-4 font-semibold">Validating user...</Text>
      </View>
    );
  }

  const { verified, message, data } = validationResult || {};

  return (
    <View className="flex-1 bg-[#09090b]">
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} className="px-5 pt-10">

        {/* Status Badge */}
        <View className={`flex-row items-center justify-center py-4 px-6 rounded-xl mb-6 border-2 ${verified ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'
          }`}>
          {verified ? <CheckCircle2 color="#22c55e" size={28} /> : <XCircle color="#dc2626" size={28} />}
          <Text className="text-white text-lg font-black tracking-widest ml-3">
            {verified ? 'VERIFIED' : 'NOT VERIFIED'}
          </Text>
        </View>

        {/* User Card */}
        <View className="bg-[#18181b] rounded-2xl p-5 mb-6 border-2 border-[#f5c842]">
          {/* Profile Photo */}
          <View className="items-center mb-5 border-b border-[#f5c842] pb-5">
            {data?.profilePhoto && verified ? (
              <Image
                source={{ uri: `${API_URL}${data.profilePhoto}` }}
                className="w-32 h-32 border-4 border-[#f5c842]"
              />
            ) : (
              <View className="w-32 h-32 bg-[#f5c842] justify-center items-center">
                <Text className="text-4xl font-black text-black">{data?.name?.charAt(0) || '?'}</Text>
              </View>
            )}
          </View>

          {/* User Details */}
          {verified && data ? (
            <View className="items-center">
              <Text className="text-white text-2xl font-black mb-3 text-center">{data.name}</Text>
              <View className="flex-row items-center mb-5 px-5">
                <School size={14} color="#a1a1aa"  />
                <Text className=" ml-3 text-[#a1a1aa] text-sm">{data.college}</Text>
              </View>

              <View className="flex-row justify-around w-full py-5 border-y border-[#3f3f46] mb-5">
                <View className="items-center">
                  <Text className="text-[#71717a] text-[10px] font-bold tracking-widest mb-1 uppercase">ID</Text>
                  <Text className="text-[#f5c842] text-base font-black">{data.userId?.toUpperCase()}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[#71717a] text-[10px] font-bold tracking-widest mb-1 uppercase">Pass Type</Text>
                  <Text style={getTypeColor(data.type)} className="text-base font-black">{data.type}</Text>
                </View>
              </View>

              <View className="w-full">
                <Text className="text-[#71717a] text-[10px] font-bold tracking-widest mb-1 uppercase">Email Address</Text>
                <View className="flex-row items-center">
                  <Mail size={14} color="#f5c842" />
                  <Text className="text-white text-sm ml-2 font-mono">{data.email}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className="items-center py-5">
              <Text className="text-[#dc2626] text-lg font-bold text-center">{message}</Text>
            </View>
          )}
        </View>

        {/* Message Card */}
        <View className={`p-4 rounded-xl border-l-4 ${verified ? 'bg-green-500/5 border-green-500' : 'bg-red-500/5 border-red-500'
          }`}>
          <Text className="text-white font-semibold text-base mb-1">{message}</Text>
          <Text className="text-[#71717a] text-xs italic">{new Date().toLocaleTimeString()}</Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#09090b] p-5 border-t border-[#27272a] gap-3">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#f5c842] py-4 rounded-xl flex-row justify-center items-center shadow-lg"
          onPress={onNextParticipant}
        >
          <Text className="text-black font-black tracking-widest mr-2">NEXT PARTICIPANT</Text>
          <ArrowRight color="black" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-[#3f3f46] py-4 rounded-xl flex-row justify-center items-center"
          onPress={onReturnHome}
        >
          <Home color="white" size={18} className="mr-2" />
          <Text className="text-white font-black tracking-widest ml-2">RETURN HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getTypeColor(type) {
  switch (type) {
    case 'AAA': return { color: '#22c55e' };
    case 'AA': return { color: '#eab308' };
    default: return { color: '#f5c842' };
  }
}