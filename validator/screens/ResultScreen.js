import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

/**
 * ResultScreen - Display validation result for scanned QR code
 * Shows user information and verification status
 * 
 * @param {Object} scanData - Scanned QR code data
 * @param {Function} onNextParticipant - Callback to scan next participant
 * @param {Function} onReturnHome - Callback to return to home
 */
export default function ResultScreen({ scanData, onNextParticipant, onReturnHome }) {
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    validateData();
  }, [scanData]);

  /**
   * Mock validation function
   * Checks if data exists and has required fields
   */
  const validateData = () => {
    try {
      // If scanData already has error flag, it's invalid
      if (scanData?.error || scanData?.verified === false) {
        setValidationResult({
          verified: false,
          message: scanData.message || 'Invalid QR Code Format',
          data: null,
        });
        return;
      }

      // Check if it's INVENTO format
      if (scanData?.format === 'INVENTO' && scanData?.userId && scanData?.email) {
        // Fetch user data from API (mocked here)
        // In production: fetch(`${API_URL}/api/users/validate/${scanData.userId}`)
        
        setValidationResult({
          verified: true,
          message: 'Clearance Verified',
          data: {
            userId: scanData.userId,
            email: scanData.email,
            name: 'Agent Name', // Would come from API
            college: 'College Name', // Would come from API
            type: 'PARTICIPANT', // Would come from API
            profilePhoto: null, // Would come from API
          },
        });
      } else if (scanData?.userId) {
        // Generic user ID found
        setValidationResult({
          verified: true,
          message: 'User Identified',
          data: {
            userId: scanData.userId,
            email: scanData.email || 'N/A',
            name: scanData.name || 'Unknown',
            college: scanData.college || scanData.clgName || 'N/A',
            type: scanData.type || 'PARTICIPANT',
            profilePhoto: scanData.profilePhoto || null,
          },
        });
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        verified: false,
        message: 'Validation Failed',
        data: null,
      });
    }
  };

  if (!validationResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Validating...</Text>
      </View>
    );
  }

  const { verified, message, data } = validationResult;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={[
          styles.statusBadge, 
          verified ? styles.statusVerified : styles.statusDenied
        ]}>
          <Text style={styles.statusIcon}>
            {verified ? '✓' : '✗'}
          </Text>
          <Text style={styles.statusText}>
            {verified ? 'VERIFIED' : 'NOT VERIFIED'}
          </Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            {data?.profilePhoto ? (
              <Image 
                source={{ uri: data.profilePhoto }}
                style={styles.profilePhoto}
                defaultSource={require('../assets/placeholder.png')}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>
                  {data?.name?.charAt(0) || '?'}
                </Text>
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
                  <Text style={styles.metaValue}>{data.type}</Text>
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
              <Text style={styles.errorHint}>
                {scanData?.raw ? `Raw data: ${scanData.raw.substring(0, 50)}...` : 'No valid data detected'}
              </Text>
            </View>
          )}
        </View>

        {/* Validation Message */}
        <View style={[
          styles.messageCard,
          verified ? styles.messageVerified : styles.messageDenied
        ]}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.timestampText}>
            {new Date(scanData?.timestamp || Date.now()).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onNextParticipant}
        >
          <Text style={styles.primaryButtonText}>NEXT PARTICIPANT</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={onReturnHome}
        >
          <Text style={styles.secondaryButtonText}>RETURN HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 180,
  },
  loadingText: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    marginTop: 100,
  },

  // Status Badge
  statusBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 30,
    borderWidth: 3,
  },
  statusVerified: {
    backgroundColor: '#064e3b',
    borderColor: '#22c55e',
  },
  statusDenied: {
    backgroundColor: '#450a0a',
    borderColor: '#dc2626',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },

  // User Card
  userCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  photoContainer: {
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f5c842',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333333',
    borderWidth: 3,
    borderColor: '#f5c842',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#666666',
  },

  // User Details
  userDetails: {
    width: '100%',
    alignItems: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  userCollege: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333333',
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 6,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#f5c842',
    letterSpacing: 1,
  },
  emailContainer: {
    width: '100%',
    backgroundColor: '#0a0a0a',
    padding: 12,
    borderRadius: 6,
  },
  emailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 12,
    color: '#888888',
    fontFamily: 'monospace',
  },

  // Error Details
  errorDetails: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: 18,
  },

  // Message Card
  messageCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  messageVerified: {
    backgroundColor: '#064e3b',
    borderColor: '#22c55e',
  },
  messageDenied: {
    backgroundColor: '#450a0a',
    borderColor: '#dc2626',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  timestampText: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
    fontFamily: 'monospace',
  },

  // Actions
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0a0a',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  primaryButton: {
    backgroundColor: '#f5c842',
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#f5c842',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444444',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888888',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
