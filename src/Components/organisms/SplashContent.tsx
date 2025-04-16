import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashContent = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.9)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, 
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000, 
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#D35AF1', '#3F72E1']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <ImageBackground
            source={require('../../assets/Group.png')}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  fullImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SplashContent;