import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>        
        <ImageBackground source={require('../../assets/dot1.png')} style={styles.dot1} />
        <ImageBackground source={require('../../assets/dot2.png')} style={styles.dot2} />
        <ImageBackground source={require('../../assets/dot3.png')} style={styles.dot3} />
        <ImageBackground source={require('../../assets/dot4.png')} style={styles.dot4} />
        <ImageBackground source={require('../../assets/image.png')} style={styles.pillImage} />

        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 32,
  },
  animatedContainer: {
    flex: 1,
    borderRadius: 32,
  },
  dot1: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.1,
    width: 100,
    height: 100,
  },
  dot2: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.1,
    width: 100,
    height: 100,
  },
  dot3: {
    position: 'absolute',
    bottom: height * 0.05,
    left: width * 0.15,
    width: 100,
    height: 100,
  },
  dot4: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.15,
    width: 100,
    height: 100,
  },
  pillImage: {
    position: 'absolute',
    bottom: height * 0.10,
    alignSelf: 'center',
    width: 150,
    height: 150,
  },
});

export default MainLayout;
