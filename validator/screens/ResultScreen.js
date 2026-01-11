import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

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
      // Check for invalid QR
      if (scanData?.error || scanData?.verified === false) {
        setValidationResult({
          verified: false,
          message: scanData.message || 'Invalid QR Code Format',
          data: null,
        });
        setLoading(false);
        return;
      }

      // Validate INVENTO format
      if (scanData?.format === 'INVENTO' && scanData?.userId) {
        try {
          // Fetch user data from API
          const response = await fetch(`${API_URL}/api/users/validate/${scanData.userId}`);
          
          console.log('API Response Status:', response.status);
          console.log('API URL:', `${API_URL}/api/users/validate/${scanData.userId}`);
          
          if (!response.ok) {
            throw new Error(`User not found (${response.status})`);
          }

          const result = await response.json();
          console.log('Validation Result:', result);

          setValidationResult({
            verified: true,
            message: 'Clearance Verified ✓',
            data: {
              userId: scanData.userId,
              email: result.data.email,
              name: result.data.name,
              college: result.data.clgName,
              type: result.data.passType,
              profilePhoto: result.data.profilePhoto,
            },
          });
        } catch (error) {
          console.error('API Error:', error);
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
      console.error('Validation error:', error);
      setValidationResult({
        verified: false,
        message: 'Validation error occurred',
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f5c842" />
        <Text style={styles.loadingText}>Validating user...</Text>
      </View>
    );
  }

  if (!validationResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No validation result</Text>
      </View>
    );
  }

  const { verified, message, data } = validationResult;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, verified ? styles.statusVerified : styles.statusDenied]}>
          <Text style={styles.statusIcon}>{verified ? '✓' : '✗'}</Text>
          <Text style={styles.statusText}>{verified ? 'VERIFIED' : 'NOT VERIFIED'}</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            {data?.profilePhoto && verified ? (
              <Image 
                source={{ uri: `${API_URL}${data.profilePhoto}` }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>{data?.name?.charAt(0) || '?'}</Text>
              </View>
            )}
          </View>

          {/* User Details */}
          {verified && data ? (
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{data.name}</Text>
              <Text style={styles.userCollege}>{data.college}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>ID</Text>
                  <Text style={styles.metaValue}>{data.userId}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>TYPE</Text>
                  <Text style={[styles.metaValue, getTypeColor(data.type)]}>{data.type}</Text>
                </View>
              </View>

              <View style={styles.emailContainer}>
                <Text style={styles.emailLabel}>EMAIL</Text>
                <Text style={styles.emailValue}>{data.email}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorDetails}>
              <Text style={styles.errorMessage}>{message}</Text>
            </View>
          )}
        </View>

        {/* Message Card */}
        <View style={[styles.messageCard, verified ? styles.messageVerified : styles.messageDenied]}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.timestamp}>{new Date().toLocaleTimeString()}</Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.nextButton} onPress={onNextParticipant}>
          <Text style={styles.nextButtonText}>NEXT PARTICIPANT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton} onPress={onReturnHome}>
          <Text style={styles.homeButtonText}>RETURN HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getTypeColor(type) {
  switch (type) {
    case 'AAA':
      return { color: '#22c55e' }; // Green
    case 'AA':
      return { color: '#eab308' }; // Yellow
    case 'A':
    default:
      return { color: '#f5c842' }; // Gold
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 140,
  },

  loadingText: {
    color: '#f5c842',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },

  errorText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },

  statusVerified: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22c55e',
    borderWidth: 1.5,
  },

  statusDenied: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: '#dc2626',
    borderWidth: 1.5,
  },

  statusIcon: {
    fontSize: 28,
    fontWeight: '900',
    marginRight: 12,
    color: '#f5c842',
  },

  statusText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#ffffff',
  },

  // User Card
  userCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderColor: '#f5c842',
    borderWidth: 1.5,
  },

  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#f5c842',
    borderWidth: 3,
  },

  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5c842',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoPlaceholderText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
  },

  // User Details
  userDetails: {
    alignItems: 'center',
  },

  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },

  userCollege: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 20,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomColor: '#3f3f46',
    borderBottomWidth: 1,
  },

  metaItem: {
    alignItems: 'center',
  },

  metaLabel: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 1,
  },

  metaValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#f5c842',
  },

  emailContainer: {
    width: '100%',
  },

  emailLabel: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 1,
  },

  emailValue: {
    fontSize: 13,
    color: '#ffffff',
    fontFamily: 'monospace',
  },

  errorDetails: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  errorMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    textAlign: 'center',
  },

  // Message Card
  messageCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
  },

  messageVerified: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderLeftColor: '#22c55e',
    borderLeftWidth: 4,
  },

  messageDenied: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderLeftColor: '#dc2626',
    borderLeftWidth: 4,
  },

  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },

  timestamp: {
    fontSize: 12,
    color: '#71717a',
  },

  // Actions
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#09090b',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopColor: '#27272a',
    borderTopWidth: 1,
    gap: 12,
  },

  nextButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },

  homeButton: {
    backgroundColor: '#3f3f46',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  homeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
