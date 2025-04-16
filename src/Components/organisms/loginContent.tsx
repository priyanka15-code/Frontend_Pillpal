import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';

interface LoginContentProps {
  mobileNumber: string;
  setMobileNumber: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: () => void;
}

const LoginContent: React.FC<LoginContentProps> = ({
  mobileNumber,
  setMobileNumber,
  password,
  setPassword,
  handleLogin,
}) => {
  const navigation = useNavigation<any>();
   const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('IN');
    const [callingCode, setCallingCode] = useState<string>('91');
  
    const onSelect = (country: Country) => {
      setCountryCode(country.cca2);
      setCallingCode(country.callingCode[0]);
      setMobileNumber(`+${country.callingCode[0]}`); // Pre-fill the input with the selected country code
      setShowCountryPicker(false); // Hide the country picker after selection
    };

    const handleInputPress = () => {
      setShowCountryPicker(true); // Show the country picker when the input is clicked
    };
  return (
    <View>
      {/* Phone Input */}
      <View style={styles.inputContainer}>
  <TouchableOpacity onPress={handleInputPress} style={styles.flagContainer}>
    {showCountryPicker ? (
      <CountryPicker
        countryCode={countryCode}
        withCallingCode
        withFlag
        withFilter
        onSelect={onSelect}
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
      />
    ) : (
      <MaterialCommunityIcons name="cellphone-check" size={30} style={styles.icon} />
    )}
  </TouchableOpacity>

  <TouchableOpacity onPress={handleInputPress} style={styles.flagContainer}>
    <Text style={styles.flagText}>+{callingCode}</Text>
  </TouchableOpacity>

  <TextInput
    style={styles.input}
    placeholder="Phone"
    value={mobileNumber}
    onChangeText={setMobileNumber}
    keyboardType="phone-pad"
  />
</View>


      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={30} style={[styles.icon, styles.iconShadow]} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#7267CB"
        />
        <MaterialCommunityIcons name="eye-off" size={30} style={styles.iconRight} />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <LinearGradient colors={["#7267CB", "#B19FFF"]} style={styles.gradientButton}>
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#7267CB',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
    color: '#7267CB',
  },
  iconRight: {
    marginLeft: 10,
    color: '#7267CB',
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  flagContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 16,
    color: '#7267CB',
    fontWeight: 'bold',
  },
  countryPicker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#655ED9',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFF',
  },
  forgotPassword: {
    color: '#7267CB',
    textAlign: 'right',
    marginVertical: 5,
  },
  button: {
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginContent;
