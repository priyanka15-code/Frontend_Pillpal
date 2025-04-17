import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import LinearGradient from 'react-native-linear-gradient';
import * as Localize from 'react-native-localize'; // Import react-native-localize

type SignUpContentProps = {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  mobileNumber: string;
  setMobileNumber: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleSignUp: () => void;
};

const SignUpContent: React.FC<SignUpContentProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  mobileNumber,
  setMobileNumber,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
}) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState<string>('91');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Automatically fetch country code based on locale
  useEffect(() => {
    const fetchCountryCode = () => {
      const country = Localize.getCountry(); // Get the user's country code
      setCountryCode(country as CountryCode);

      // Map country code to calling code (you can use a library or a custom mapping)
      const countryCallingCodeMap: { [key: string]: string } = {
        IN: '91',
        US: '1',
        GB: '44',
        // Add more country codes and calling codes as needed
      };

      setCallingCode(countryCallingCodeMap[country] || '91'); // Default to '91' if not found
    };

    fetchCountryCode();
  }, []);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setMobileNumber(`+${country.callingCode[0]}`);
    setShowCountryPicker(false);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account" size={30} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={30} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowCountryPicker(true)} style={styles.flagContainer}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withFlag
            withFilter
            onSelect={onSelect}
            visible={showCountryPicker}
            onClose={() => setShowCountryPicker(false)}
          />
        </TouchableOpacity>

        <Text style={styles.flagText}>+{callingCode}</Text>

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
        <MaterialCommunityIcons name="lock" size={30} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <MaterialCommunityIcons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={30}
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-check" size={30} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <MaterialCommunityIcons
            name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
            size={30}
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <LinearGradient colors={['#7267CB', '#B19FFF']} style={styles.gradientButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRight: {
    marginLeft: 10,
    color: '#7267CB',
  },
});

export default SignUpContent;