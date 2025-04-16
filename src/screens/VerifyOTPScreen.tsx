import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

import MainLayout from '../Components/Layouts/MainLayout';
import LinearGradient from 'react-native-linear-gradient';
import { AuthService } from '../services/apiservice';

type VerifyOTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOTPScreen'>;

const VerifyOTPScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<VerifyOTPScreenNavigationProp>();
  const { mobileNumber } = route.params as { mobileNumber: string };
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    if (otp.trim().length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit OTP.');
      return;
    }
  
    try {
      const response = await AuthService.verifyOTP(mobileNumber, otp);
  
      if (response.status === 200 && response.data) {
        const { FullName, _id, userId } = response.data; // Ensure userId is included here
        Alert.alert('Success', 'OTP Verified Successfully');
        navigation.navigate('HomeScreen', { userId, fullName: FullName, _id }); // Pass userId along with other params
      } else {
        Alert.alert('Error', 'Invalid OTP, please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleResendOTP = async () => {
    try {
     // await AuthService.resendOTP(mobileNumber);  // Assuming you have a method to resend OTP
      Alert.alert('Success', 'OTP has been resent to your mobile number.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again later.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Health, Our Priority!</Text>
          <Text style={styles.subtitle}>Enter Your PillPal OTP</Text>
        </View>

        <View style={styles.formContainer}>
          <OtpInputs
            autofillFromClipboard={false}
            handleChange={(code) => setOtp(code)}
            numberOfInputs={6}
            style={styles.otpContainer}
            inputStyles={styles.otpInput}
          />

          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>
              Didn't Receive an OTP? <Text style={styles.resendBold}>RESEND IT</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleVerifyOTP} style={styles.buttonWrapper}>
            <LinearGradient
              colors={['#7267CB', '#B19FFF']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#655ED9', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#655ED9', marginBottom: 20 },
  formContainer: { alignItems: 'center', marginTop: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7267CB',
    textAlign: 'center',
    fontSize: 20,
    color: '#655ED9',
    margin: 5,
    backgroundColor: '#F4F4F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resendText: { 
    color: '#655ED9', 
    marginTop: 20, 
    fontSize: 14 
  },
  resendBold: { 
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default VerifyOTPScreen;