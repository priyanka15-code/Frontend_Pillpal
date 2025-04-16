import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AuthService } from '../services/apiservice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreen'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [editMode, setEditMode] = useState<boolean>(false); // Track edit mode
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>({ profilePhoto: null });

  const fetchProfile = async () => {
    try {
      const response = await AuthService.getProfile(userId);
      console.log('Fetched Profile Data:', response?.data); // Log the updated profile data
      setProfileData(response?.data);
      setUpdatedProfile(response?.data); // Synchronize updated profile data
    } catch (err: any) {
      setError(err.response?.data || err.message || err); // Capture error properly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleImageChange = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    } as const;

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newPhotoUri = response.assets[0].uri;
        setUpdatedProfile({ ...updatedProfile, profilePhoto: newPhotoUri });
      }
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
  
      // Append fields to FormData
      formData.append('FullName', updatedProfile.FullName || '');
      formData.append('Email', updatedProfile.Email || '');
      formData.append('Password', updatedProfile.Password || '');
      formData.append('Gender', updatedProfile.Gender || '');
      formData.append('Age', updatedProfile.Age?.toString() || '');
      formData.append('Country', updatedProfile.Country || '');
      formData.append('State', updatedProfile.State || '');
      formData.append('City', updatedProfile.City || '');
  
      // Handle MobileNumber
      const mobileNumbers = Array.isArray(updatedProfile.MobileNumber)
        ? updatedProfile.MobileNumber
        : [{ number: updatedProfile.MobileNumber, isVerified: false }];
      formData.append('MobileNumber', JSON.stringify(mobileNumbers));
  
      // Format DateOfBirth
      if (updatedProfile.DateOfBirth) {
        const dobFormatted = formatDateForBackend(updatedProfile.DateOfBirth); // Convert to YYYY-MM-DD format
        formData.append('DateOfBirth', dobFormatted);
      }
  
      // Handle profile image (uri to file)
      if (updatedProfile.profilePhoto?.startsWith('http://10.0.2.2:3000/uploads/${fileName}')) {
        const uri = updatedProfile.profilePhoto;
        const fileName = uri.split('/').pop();
        const fileType = fileName?.split('.').pop();
  
        const photo = {
          uri,
          name: fileName ,
          type: `image/${fileType}`,
        };
  
        console.log('Profile Photo Object:', photo);
  
        formData.append('profilePhoto', photo as any);
      }
  
      // Debug FormData: Log all keys and values
      console.log('FormData Debugging:');
      const debugFormData = (formData as any)._parts;
      debugFormData.forEach(([key, value]: [string, any]) => {
        if (key === 'profilePhoto') {
          console.log(`${key}:`, value);
        } else {
          console.log(`${key}: ${value}`);
        }
      });
  
      // Send API request
      const response = await AuthService.updateProfile(userId, formData);
      console.log('Profile update response:', response);
  
      Alert.alert('Success', 'Profile updated successfully');
      await fetchProfile(); 
      setEditMode(false); 
    } catch (error: any) {
      console.error('Failed to update profile:', error.response?.data || error.message || error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };
 
  const formatDateForBackend = (date: string | Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };
  
 
  

  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    const fileName = filePath.split(/[\\/]/).pop();
    return `http://10.0.2.2:3000/uploads/${fileName}`;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>
          {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
        <TouchableOpacity
  style={styles.iconBtn}
  onPress={() => setEditMode(!editMode)}
>
  <Icon
    name={editMode ? 'close-thick' : 'account-edit'}
    size={28}
    color="#6C63FF"
  />
</TouchableOpacity>

        <TouchableOpacity onPress={editMode ? handleImageChange : undefined}>
  <Image
    source={{
      uri: getFileUrl(
        editMode
          ? updatedProfile?.profilePhoto || profileData?.profilePhoto
          : profileData?.profilePhoto
      ) || 'https://your-app.com/default-profile.png', 
    }}
    style={styles.avatar}
  />
</TouchableOpacity>

          <Text style={styles.name}>{profileData.FullName}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        {editMode ? (
          
          // Editable fields
          <>
          
            <EditableField
              label="Full Name"
              value={updatedProfile.FullName}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, FullName: text })}
            />
            <EditableField
              label="Email"
              value={updatedProfile.Email}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, Email: text })}
            />
           
            <Text style={styles.label}>Date of Birth</Text>
            <>
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {updatedProfile.DateOfBirth
                    ? new Date(updatedProfile.DateOfBirth).toLocaleDateString()
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={updatedProfile.DateOfBirth ? new Date(updatedProfile.DateOfBirth) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setUpdatedProfile({
                        ...updatedProfile,
                        DateOfBirth: selectedDate.toISOString(),
                      });
                    }
                  }}
                />
              )}
            </>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.genderOption}
                  onPress={() => setUpdatedProfile({ ...updatedProfile, Gender: option })}
                >
                  <View
                    style={[styles.radioCircle, updatedProfile.Gender === option && styles.selectedRadio]}
                  />
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <EditableField
              label="City"
              value={updatedProfile.City}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, City: text })}
            />
            <EditableField
              label="State"
              value={updatedProfile.State}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, State: text })}
            />
            <EditableField
              label="Country"
              value={updatedProfile.Country}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, Country: text })}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Static fields
          <>
            <InfoItem icon="email-outline" label="Email" value={profileData.Email} />
            <InfoItem icon="phone-outline" label="Phone" value={profileData.MobileNumber?.[0]?.number || 'N/A'} />
            <InfoItem icon="calendar-month-outline" label="DOB" value={profileData.DateOfBirth ? profileData.DateOfBirth : 'N/A'} />
            <InfoItem icon="gender-male-female" label="Gender" value={profileData.Gender} />
            <InfoItem icon="map-marker-outline" label="Location" value={`${profileData.City}, ${profileData.State}`} />
            <InfoItem icon="earth" label="Country" value={profileData.Country} />
            <InfoItem icon="account-box-outline" label="User ID" value={profileData.UserID} />
            <InfoItem icon="account-tie-outline" label="User Type" value={profileData.UserType} />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const EditableField = ({
  label,
  value,
  editable = true,
  onChangeText,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
      />
    ) : (
      <Text style={styles.valueText}>{value}</Text>
    )}
  </View>
);

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={22} color="#6C63FF" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9ff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#444',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#6C63FF',
    paddingVertical: 30, // Increase padding for top/bottom space
    paddingHorizontal: 10, // Optional, for left/right space
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center', // Center content horizontally
    position: 'relative', // P
    
  },
  headerInner: {
    
    alignItems: 'center', // Keep everything centered
    width: '100%', 
    
  },
  editBtn: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 20,
  },
  editBtnText: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 14,
  },
  avatar: {
    width: 110, // Width of the avatar
    height: 110, // Height of the avatar
    marginTop: 60,
    borderRadius: 55, // Round the avatar (half of width/height)
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
    overflow: 'hidden', // Crop the image to fit the rounded border
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Position of the shadow (creates depth)
    shadowOpacity: 0.3, // How opaque the shadow is
    shadowRadius: 20, // Radius of the shadow for a blurred effect
    elevation: 10, 
  },
  iconBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },  
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  subId: {
    color: '#e0dfff',
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editableField: {
    marginBottom: 15,
  },
  editableLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  editableInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  valueText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  // Add missing styles
  dateBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6C63FF',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

export default ProfileScreen;
