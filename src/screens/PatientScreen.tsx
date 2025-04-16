import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Controller } from '../services/apiservice';
import Header from '../Components/atoms/Header';
import BottomNavigationBar from '../Components/atoms/navbar';
import FloatingButton from '../Components/atoms/FloatingButton';
import SearchBar from '../Components/atoms/SearchBar';

interface Patient {
  userId: string;
  _id: string;
  name: string;
  profileImage?: string;
  mobileNumber?: string;
}

type RootStackParamList = {
  PatientDetailsScreen: { patientId: string; userId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'PatientDetailsScreen'>;

const PatientListScreen: React.FC = () => {
  const route = useRoute();
  const { _id, userId } = route.params as { _id: string; userId: string };
  const [searchText, setSearchText] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Password: '',
    MobileNumber: '',
    UserType: 'Patient',
    DelegateAuthID: '',
    DelegatedPatientID: ''
  });
  const navigation = useNavigation<NavigationProp>();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchPatients = async () => {
    console.log('Fetching patients...');
    console.log('UserId:', userId);

    if (userId) {
      try {
        const patientsData = await Controller.getPatient(userId);
        console.log('Patients Data:', patientsData);

        if (Array.isArray(patientsData)) {
          setPatients(patientsData);
        } else {
          console.log('Invalid patient data received.');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No userId found.');
      setLoading(false);
    }
  };

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
        formData.DelegateAuthID,
      );
      console.log('Response:', response);
      Alert.alert('Success', 'Patient added successfully');
      setShowModal(false);
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6C63FF" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <LinearGradient colors={['#F0F4FF', '#D9E4FF']} style={styles.container}>
      <Header title="Pill Family Member" userId={userId}/>
      <LinearGradient colors={['#F0F4FF', '#D9E4FF']} style={styles.container}>
        <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Files"
          iconName="account-search-outline"
        />

        </View>
        <ScrollView contentContainerStyle={styles.patientGrid}>
          {filteredPatients.map(patient => (
            <TouchableOpacity
              key={patient._id}
              onPress={() => navigation.navigate('PatientDetailsScreen', { userId: userId!, patientId: patient._id })}
            >
              <LinearGradient colors={['#6C63FF', '#8A85FF']} style={styles.patientCard}>
                <Image
                  source={patient.profileImage ? { uri: patient.profileImage } : require('../assets/image12.png')}
                  style={styles.patientImage}
                />
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientMobile}>{patient.mobileNumber ? `+91 ${patient.mobileNumber}` : ''}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Floating Add Patient Button */}
        <FloatingButton onPress={() => setShowModal(true)} />
      </LinearGradient>
      <BottomNavigationBar userId={userId} activeScreen="Profile" />
      <Modal visible={showModal} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.title}>New PillMember</Text>

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
              <Text style={styles.addButtonText}>Add Pill  Member</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  searchContainer: { marginBottom: 20, paddingHorizontal: 20 },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 20,
  },
  patientGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  patientCard: {
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 165,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  patientImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 10, backgroundColor: '#fff' },
  patientName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 3 },
  patientMobile: { fontSize: 14, color: '#f0f0f0' },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  closeButton: {
    width: 20,
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
  }
});

export default PatientListScreen;