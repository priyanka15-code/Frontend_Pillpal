import React, { useState } from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AuthService } from '../services/apiservice';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import SignUpContent from '../Components/organisms/SignUpContent';

import MainLayout from '../Components/Layouts/MainLayout';
import LoginContent from '../Components/organisms/loginContent';
import { CountryCode } from 'react-native-country-picker-modal';




interface LoginResponse {
  FullName: string;
  _id: string;
}


type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpScreen'>;

const SignUpScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  const navigation = useNavigation<SignUpScreenNavigationProp & NativeStackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    try {
      const response = await AuthService.signUp({
        FullName: fullName,
        Password: password,
        Email: email,
        MobileNumber: [{ number: mobileNumber }],
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP sent successfully');
        navigation.navigate('VerifyOTPScreen', { mobileNumber });
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data.message || 'Signup failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await AuthService.login(mobileNumber, password, navigation);
  
      // Log the full response to check its structure
      console.log("Full Response Data: ", response.data);
  
      if (response && response.data) {
        const userData = response.data.message.user; 
        if (userData && userData._id) {
          Alert.alert('Success', 'Login successful');
          navigation.navigate('HomeScreen', { userId: userData._id });
        } else {
          Alert.alert('Error', 'User  data not found in the response.');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data.message || 'Login failed');
    }
  };
  
  return (
    <MainLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Health, Our Priority!</Text>
          <Text style={styles.subtitle}>Welcome to PillPal</Text>
        </View>
        <View style={styles.tabContainer}>
         
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab('signup')}
      >
        {activeTab === 'signup' ? (
          <LinearGradient
            colors={['#655ED9', '#B19FFF']}
            style={styles.activeTab}
          >
            <Text style={styles.activeTabText}>SIGN UP</Text>
          </LinearGradient>
        ) : (
          
          <Text style={styles.inactiveTabText}>SIGN UP</Text>
       
      )}
      </TouchableOpacity>

      
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setActiveTab('login')}
      >
        {activeTab === 'login' ? (
          <LinearGradient
            colors={['#655ED9', '#B19FFF']}
            style={styles.activeTab}
          >
            <Text style={styles.activeTabText}>LOGIN</Text>
          </LinearGradient>
        ) : (
          
          <Text style={styles.inactiveTabText}>Login</Text>
        
        )}
      </TouchableOpacity>
      </View>
                {activeTab === 'signup' ? (
          <SignUpContent
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            confirmPassword={confirmPassword}  
            setConfirmPassword={setConfirmPassword}
            handleSignUp={handleSignUp}
          />
        ) : (
          <LoginContent
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#655ED9' },
  subtitle: { fontSize: 18, color: '#655ED9' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F2F2',
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 30,
  },
  activeTab: {
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  inactiveTabText: {
    color: '#655ED9',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
});

export default SignUpScreen;
