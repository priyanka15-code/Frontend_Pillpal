import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Controller } from '../services/apiservice';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../Components/atoms/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigationBar from '../Components/atoms/navbar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



type PatientDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PatientDetailsScreen'>;
type PatientDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PatientDetailsScreen'>;

interface MobileNumber {
  number: string;
  isVerified: boolean;
  _id: string;
}

interface FolderAccess {
  AccessFolderID: string[];
  DelegateFolderAuthID: string;
  FullName: string;
}

interface Folder {
  _id: string;
  folderName: string;
  folderAccess: FolderAccess[];
}

interface AccessAccount {
  _id: string;
  FullName: string;
  Email: string;
  MobileNumber: MobileNumber[];
  accessAccount: string[]; 
  profileImage?: string;
}
interface DelegateAuth {
  _id: {
    _id: string;
    FullName: string;
    Email: string;
    MobileNumber: MobileNumber[];
  };
  accessAccount: string[];
}

interface PatientDetails {
  name: string;
  email: string;
  mobileNumber: MobileNumber[];
  userId: string;
  userType: string;
  createdBy: string;
  delegatedPatientID: string;
  delegateAuthID: DelegateAuth[];
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  accessAccount: AccessAccount[];
  folders: Folder[];
}



const PatientDetailsScreen: React.FC = () => {
  const navigation = useNavigation<PatientDetailsScreenNavigationProp>();
  const route = useRoute<PatientDetailsScreenRouteProp>();
  const { userId, patientId } = route.params;
  const [patientInfo, setPatientInfo] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        console.log('User ID:', userId);
        console.log('Patient ID:', patientId);
  
        if (userId && patientId) {
          const response = await Controller.getParticularPatientasync(userId, patientId);
  
          console.log('Response patient details:', response); 
  
          if (response) {
            setPatientInfo(response);
          } else {
            console.error('Invalid response structure:', response);
          }
        } else {
          console.error('Invalid userId or patientId');
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [userId, patientId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#655ED9" />;
  }
  if (!patientInfo) {
    return <Text style={styles.errorText}>Pill Family Member details not found.</Text>;
  }

  return (
    <View style={styles.fullScreen}>
    {/* Header outside of LinearGradient */}
    <Header title="Pill  Member Details" userId={userId}/>

    <LinearGradient colors={['#F0F4FF', '#D9E4FF']} style={styles.container}>
     
      <ScrollView style={styles.container}>
        <View style={styles.detailsCard}>
          <Image
            source={
              patientInfo.profileImage
                ? { uri: patientInfo.profileImage }
                : require('../assets/image12.png')
            }
            style={styles.patientImage}
          />
          <Text style={styles.detailText}>Name: {patientInfo.name}</Text>
          <Text style={styles.detailText}><MaterialCommunityIcons name="email-outline" size={20} /> {patientInfo.email}</Text>
          
          {patientInfo.mobileNumber?.length ? (
  patientInfo.mobileNumber.map((mobile) => (
    <View
      key={mobile._id} 
      style={[
        styles.mobileNumberContainer,
        mobile.isVerified ? styles.verified : styles.notVerified,
      ]}
    >
      <Text
        style={[
          styles.mobileNumberText,
          mobile.isVerified ? styles.verifiedText : styles.notVerifiedText,
        ]}
      >
        {mobile.number} (Verified: {mobile.isVerified ? 'Yes' : 'No'})
      </Text>
    </View>
  ))
) : (
  <Text style={styles.detailText}>Mobile Number: N/A</Text>
)}

          <Text style={styles.detailText}>User ID: {patientInfo.userId}</Text>
          <Text style={styles.detailText}>User Type: {patientInfo.userType}</Text>
        </View>
        {patientInfo.delegateAuthID && patientInfo.delegateAuthID.length > 0 ? (
  patientInfo.delegateAuthID.map((delegate: DelegateAuth, index: number) => (
    <View key={index} style={styles.delegateCard}>
      <Text style={styles.delegateTitle}>Delegate Authorization Details:</Text>
      <Text style={styles.delegateDetails}>
        Name: {delegate._id?.FullName ?? 'No Name Available'}
      </Text>
      <Text style={styles.delegateDetails}>
        Email: {delegate._id?.Email ?? 'No Email Available'}
      </Text>
      {delegate._id?.MobileNumber && delegate._id.MobileNumber.length > 0 ? (
        delegate._id.MobileNumber.map((mobile: MobileNumber) => (
          <Text key={mobile._id} style={styles.delegateDetails}>
            Mobile: {mobile.number} (Verified: {mobile.isVerified ? 'Yes' : 'No'})
          </Text>
        ))
      ) : (
        <Text style={styles.delegateDetails}>Mobile: No Mobile Number Available</Text>
      )}
      <Text style={styles.delegateDetails}>
        Access: {delegate.accessAccount?.join(', ') || 'No Access Provided'}
      </Text>
    </View>
  ))
) : (
  <Text style={styles.detailText}>No Delegate Authorization Details Available</Text>
)}
        <TouchableOpacity
  style={styles.uploadButton}
  onPress={() => navigation.navigate('AddNotificationScreen', { userId: patientInfo?.userId })} // Pass parameters
>
  <Text style={styles.uploadButtonText}>+ Upload New Prescription</Text>
</TouchableOpacity>
      </ScrollView>
    </LinearGradient>
    <BottomNavigationBar userId={userId} activeScreen="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  container: { flex: 1, padding: 10 },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  patientImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  detailText: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: '#655ED9' 
  },
  mobileNumberContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  verified: {
    backgroundColor: '#D4F5D4', 
  },
  notVerified: {
    backgroundColor: '#F5D4D4', 
  },
  mobileNumberText: {
    fontSize: 16,
  },
  verifiedText: {
    color: '#0C9D58', 
  },
  notVerifiedText: {
    color: '#D93025', 
  },
  accessCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  accessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#655ED9',
    marginBottom: 10,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E6FD',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  accountImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#655ED9',
  },
  accountDetails: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  
  delegateCard: {
    backgroundColor: '#F9F9FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  delegateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#655ED9',
    marginBottom: 5,
  },
  delegateDetails: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: '#655ED9',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom:20
  },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
 
  foldersCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#E3E6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#655ED9',
    marginBottom: 10,
  },
  folderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  folderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#655ED9',
    marginBottom: 5,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  accessInfo: {
    flex: 1,
  },
  accessName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  accessDetails: {
    fontSize: 13,
    color: '#666',
  },
  
});

export default PatientDetailsScreen;
