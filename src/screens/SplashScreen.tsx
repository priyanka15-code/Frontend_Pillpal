
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import SplashContent from '../Components/organisms/SplashContent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashScreen'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('SignUpScreen');
    }, 3000); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SplashContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default SplashScreen;
