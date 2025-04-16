import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../Components/atoms/Header';
import BottomNavigationBar from '../Components/atoms/navbar';
import FloatingButton from '../Components/atoms/FloatingButton';
import SearchBar from '../Components/atoms/SearchBar';

import { RootStackParamList } from '../navigation/AppNavigator';
import { addFileToFolder, getAllFileFromFolder, deleteFileFromFolder, Controller } from '../services/apiservice';
import { Picker } from '@react-native-picker/picker';


type FileManagementScreenRouteProp = RouteProp<RootStackParamList, 'FileManagementScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FileManagementScreen'>;

interface File {
  _id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  filePath: string;
}

const FileManagementScreen = () => {
  const route = useRoute<FileManagementScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { folderId, userId } = route.params;

  const [files, setFiles] = useState<File[]>([]);
  const [authData, setAuthData] = useState<any[]>([]); // Added authData state
  const [loading, setLoading] = useState<boolean>(true);
  const [AccessfileID, setAccessfileID] = useState('');
  const [accessType, setAccessType] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loadingAuthData, setLoadingAuthData] = useState(true);


  useEffect(() => {
    const fetchAuthData = async () => {
      setLoadingAuthData(true); // Start loading
      if (userId) {
        try {
          const data = await Controller.getAuth(userId);
          if (data) {
            const filteredAuthData = data.map((user: any) => ({
              _id: user._id,
              name: user.name,
            }));
            setAuthData(filteredAuthData);
          }
        } catch (error) {
          console.error('Error fetching Auth data:', error);
        } finally {
          setLoadingAuthData(false); // Stop loading
        }
      }
    };
  
    fetchAuthData();
  }, [userId]);
  

  useEffect(() => {
    fetchFiles();
  }, [folderId, userId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await getAllFileFromFolder(userId, folderId);
      if (data && typeof data === 'object' && 'files' in data) {
        setFiles(data.files || []);
      } else {
        console.error('Unexpected data structure:', data);
      }
    } catch (error) {
      console.error('Error fetching files:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      setLoadingAuthData(true); // Start loading
      if (userId) {
        try {
          const data = await Controller.getAuth(userId);
          if (data) {
            const filteredAuthData = data.map((user: any) => ({
              _id: user._id,
              name: user.name,
            }));
            setAuthData(filteredAuthData);
            console.log('Auth Data:', filteredAuthData); // Log fetched data
          }
        } catch (error) {
          console.error('Error fetching Auth data:', error);
        } finally {
          setLoadingAuthData(false); // Stop loading
        }
      }
    };
  
 
     fetchAuthData();
   }, [userId]);
  const toggleAccessType = (type: string) => {
    setAccessType((prevAccessType) =>
      prevAccessType.includes(type)
        ? prevAccessType.filter((access) => access !== type)
        : [...prevAccessType, type]
    );
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFileFromFolder(userId, folderId, fileId);
      Alert.alert('Success', 'File deleted successfully.');
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      Alert.alert('Error', 'Failed to delete the file. Please try again.');
    }
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedFile(response.assets[0]);
      }
    });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri.startsWith('file://') ? selectedFile.uri : `file://${selectedFile.uri}`,
        type: selectedFile.type,
        name: selectedFile.fileName || 'file.jpg',
      });

      formData.append('fileName', selectedFile.fileName || 'file.jpg');
      formData.append('fileType', selectedFile.type || 'jpg');
      formData.append('folderId', folderId);
      formData.append('userId', userId);

      // Ensure proper structure for fileAccess
      const formattedFileAccess = [
        {
          DelegateFileType: accessType,
          AccessfileID: AccessfileID || userId,
        },
      ];
      formData.append('fileAccess', JSON.stringify(formattedFileAccess));

      await addFileToFolder(userId, folderId, formData);

      setModalVisible(false);
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient colors={['#F0F4FF', '#D9E4FF']} style={{ flex: 1 }}>
      <Header title="Folder Management"  userId={userId}/>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Files"
          iconName="file-search-outline"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#6C63FF" />
        ) : (
          filteredFiles.map((file) => (
            <TouchableOpacity
              key={file._id}
              onPress={() =>
                navigation.navigate('FileDetailsScreen', {
                  fileId: file._id,
                  folderId,
                  userId,
                })
              }
              style={styles.fileCard}
            >
              <View style={styles.fileInfo}>
                <View style={styles.fileIcon}>
                  <Text style={{ color: '#6C63FF', fontWeight: 'bold' }}>
                    {file.fileType.toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.fileName}>{file.fileName}</Text>
                  <Text style={styles.fileDate}>
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteFile(file._id)}
                style={{ backgroundColor: '#F8D7DA', borderRadius: 10, padding: 8 }}
              >
                <MaterialCommunityIcons name="delete" size={20} color="#B00020" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <View style={styles.floatingButtonContainer}>
        <FloatingButton onPress={() => setModalVisible(true)} />
      </View>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload File</Text>
            {selectedFile && <Image source={{ uri: selectedFile.uri }} style={{ width: 150, height: 150 }} />}
            <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUploadFile} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Select Access For:</Text>
            
            
<View style={styles.pickerContainer}>
  {loadingAuthData ? (
    <ActivityIndicator size="small" color="#6C63FF" />
  ) : (
    <Picker
      selectedValue={AccessfileID}
      onValueChange={(itemValue) => setAccessfileID(itemValue)}
      dropdownIconColor="#6C63FF"
    >
      <Picker.Item label="Select Delegate User" value="" />
      {authData.length > 0 ? (
        authData.map((user) => (
          <Picker.Item label={user.name} value={user._id} key={user._id} />
        ))
      ) : (
        <Picker.Item label="No users available" value="" />
      )}
    </Picker>
  )}
</View>
            <View style={styles.toggleContainer}>
              <Text style={styles.sectionTitle}>File Access</Text>
              {['View', 'Insert', 'Update', 'Delete'].map((type) => (
                <View key={type} style={styles.toggleItem}>
                  <Text style={styles.label}>{type}</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      accessType.includes(type) && styles.toggleButtonActive,
                    ]}
                    onPress={() => toggleAccessType(type)}
                  >
                    <MaterialCommunityIcons
                      name={accessType.includes(type) ? 'check-circle' : 'close-circle'}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavigationBar userId={userId} activeScreen="Folders" />
    </LinearGradient>
  );
};

//<ScrollView contentContainerStyle={styles.scrollContainer}></ScrollView>
const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 95,
    right: 2,
  },
  fileCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fileName: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  fileDate: {
    color: '#6B7280',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  picker: {
    color: '#6C63FF',
    fontSize: 16,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
  },
  toggleContainer: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },

  iconWrapper: {
    width: '100%',
  },

  iconLeft: {
    alignItems: 'flex-start',
  },

  iconRight: {
    alignItems: 'flex-end',
  }
});

export default FileManagementScreen;