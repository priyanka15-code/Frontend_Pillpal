import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Controller } from '../services/apiservice';

interface AddPatientFormProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
  onPatientAdded: () => void;
}

const AddPatientForm: React.FC<AddPatientFormProps> = ({ userId, visible, onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Password: '',
    MobileNumber: '',
    UserType: 'Patient',
    DelegateAuthID: '',
    DelegatedPatientID: ''
  });

  const handleAddPatient = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    try {
      const response = await Controller.addPatientOrAuthUser(
        userId,
        formData.FullName,
        formData.Email,
        formData.Password,
        [{ number: formData.MobileNumber }], 
        formData.UserType,
        formData.DelegateAuthID
      );
      console.log('Response:', response);
      Alert.alert('Success', 'Patient added successfully');
      onClose();
      onPatientAdded();
    } catch (error) {
      console.error('Error adding patient:', error);
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add New Patient</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, FullName: text })}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, Email: text })}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={text => setFormData({ ...formData, Password: text })}
          />
          <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, MobileNumber: text })}
          />

          <TouchableOpacity onPress={handleAddPatient} style={styles.addButton}>
            <LinearGradient colors={["#6C63FF", "#8A85FF"]} style={styles.gradientButton}>
              <Text style={styles.addButtonText}>Add Patient</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F0F4FF',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  addButton: {
    marginTop: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddPatientForm;
