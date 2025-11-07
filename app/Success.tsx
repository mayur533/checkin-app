import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;

export default function Success() {
  const route = useRoute<SuccessScreenRouteProp>();
  const navigation = useNavigation();
  const { message, attendedAt } = route.params;
  const normalizedMessage = message?.toLowerCase?.() ?? '';
  const isAlreadyCheckedIn = normalizedMessage.includes('already');

  const gradientColors = isAlreadyCheckedIn
    ? ['#facc15', '#f59e0b', '#d97706']
    : ['#10b981', '#059669', '#047857'];

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
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
      // Checkmark draw animation
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
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

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.content}>
        {/* Animated Circle Background */}
        <Animated.View
          style={[
            styles.circleBackground,
            {
              backgroundColor: isAlreadyCheckedIn
                ? 'rgba(255, 255, 255, 0.35)'
                : 'rgba(255, 255, 255, 0.3)',
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Checkmark */}
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                opacity: checkmarkAnim,
                transform: [
                  {
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1.2, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.successTitle, isAlreadyCheckedIn && styles.alreadyTitle]}>
            {isAlreadyCheckedIn ? 'Already Checked In' : 'Check-in Successful!'}
          </Text>
          
          {/* Details Card */}
          <View style={styles.detailsCard}>
            <Text
              style={[
                styles.messageText,
                isAlreadyCheckedIn && styles.alreadyMessageText,
              ]}
            >
              {message || (isAlreadyCheckedIn ? 'Already checked in' : 'Check-in successful')}
            </Text>
            {attendedAt && (
              <Text style={styles.detailText}>
                Checked in at: {new Date(attendedAt).toLocaleString()}
              </Text>
            )}
          </View>

          <Text style={[styles.welcomeText, isAlreadyCheckedIn && styles.alreadySubtitle]}>
            {isAlreadyCheckedIn ? 'Please verify with the event team if needed.' : 'Welcome! Enjoy your visit.'}
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
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  alreadyTitle: {
    color: '#1f2937',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
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
  messageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
    marginBottom: 16,
  },
  alreadyMessageText: {
    color: '#b45309',
  },
  detailText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginVertical: 4,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
  alreadySubtitle: {
    color: '#1f2937',
  },
});

