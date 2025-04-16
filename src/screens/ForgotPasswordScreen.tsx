
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert  } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MainLayout from '../Components/Layouts/MainLayout';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigation = useNavigation<any>();

  const handleResetPassword = () => {
    if (email) {
      setShowPasswordFields(true);
    }
  };

  const handleSubmitNewPassword = () => {
    if (password && confirmPassword && password === confirmPassword) {
      // Perform your password update logic here
      Alert.alert('Passwords do not match. Please try again.');

      navigation.goBack();
    } else {
     Alert.alert('Passwords do not match. Please try again.');
    }
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        {!showPasswordFields ? (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>No Worries, we’ll send you reset instructions.</Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#7267CB" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#7267CB"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
              <LinearGradient colors={["#7267CB", "#B19FFF"]} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Reset password</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Set New Password</Text>
            <Text style={styles.subtitle}>Enter your new password below.</Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#7267CB" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#7267CB"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
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

            <TouchableOpacity style={styles.button} onPress={handleSubmitNewPassword}>
              <LinearGradient colors={["#7267CB", "#B19FFF"]} style={styles.gradientButton}>
                <Text style={styles.buttonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backToLogin}>← Back to Log In</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7267CB',
  },
  subtitle: {
    fontSize: 14,
    color: '#7267CB',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#7267CB',
    width: '100%',
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
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#7267CB',
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
