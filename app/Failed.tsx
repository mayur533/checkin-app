import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';

type FailedScreenRouteProp = RouteProp<RootStackParamList, 'Failed'>;

export default function Failed() {
  const route = useRoute<FailedScreenRouteProp>();
  const navigation = useNavigation();
  const { message } = route.params;

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Scale animation for background circle
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Rotate and shake X mark
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Auto navigate back after 3 seconds
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const shake = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-10, 10],
  });

  return (
    <LinearGradient
      colors={['#ef4444', '#dc2626', '#b91c1c']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated Circle Background */}
        <Animated.View
          style={[
            styles.circleBackground,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* X Mark */}
          <Animated.View
            style={[
              styles.xMarkContainer,
              {
                transform: [
                  { rotate: rotation },
                  { translateX: shake },
                ],
              },
            ]}
          >
            <Text style={styles.xMark}>✕</Text>
          </Animated.View>
        </Animated.View>

        {/* Error Message */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.errorTitle}>Check-in Failed</Text>
          
          {/* Error Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.errorMessage}>{message || 'User Not Found'}</Text>
            <Text style={styles.tryAgainText}>Please try again</Text>
          </View>

          <Text style={styles.instructionText}>
            Scan a valid QR code to check in
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circleBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  xMarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  xMark: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorMessage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 12,
  },
  tryAgainText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
});

