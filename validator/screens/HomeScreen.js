import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

/**
 * HomeScreen - Welcome screen for INVENTO Validator
 * Dark spy theme with high contrast for easy readability
 * 
 * @param {Function} onVerify - Callback to navigate to scanner screen
 */
export default function HomeScreen({ onVerify }) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.badge}>CLASSIFIED</Text>
        <Text style={styles.title}>INVENTO</Text>
        <Text style={styles.titleAccent}>VALIDATOR</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Spyverse Clearance Check</Text>
      </View>

      {/* Main Action */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onVerify}
          activeOpacity={0.8}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonIcon}>🔍</Text>
            <Text style={styles.buttonText}>VERIFY USER</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.instructionText}>
          Tap to scan QR codes and verify agent credentials
        </Text>
      </View>

      {/* Footer Info */}
      <View style={styles.footerSection}>
        <Text style={styles.footerText}>🔒 Authorized Personnel Only</Text>
        <Text style={styles.versionText}>v1.0.0 | INVENTO 2026</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  
  // Header Section
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  badge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 3,
    backgroundColor: '#1a0a0a',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#dc2626',
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f5c842',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: '#f5c842',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // Action Section
  actionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: '#f5c842',
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#f5c842',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  buttonInner: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 2,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    letterSpacing: 1,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 10,
    color: '#444444',
    letterSpacing: 1,
  },
});
