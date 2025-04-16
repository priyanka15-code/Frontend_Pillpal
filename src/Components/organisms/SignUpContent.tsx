import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import LinearGradient from 'react-native-linear-gradient';

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

      
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={30} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-check" size={24} color="#7267CB" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#7267CB"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <LinearGradient
          colors={['#7267CB', '#B19FFF']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Verify Number</Text>
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
  countryPicker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#655ED9',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFF',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SignUpContent;