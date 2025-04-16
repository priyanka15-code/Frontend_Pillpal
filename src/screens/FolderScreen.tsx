import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Controller, Folder } from '../services/apiservice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../Components/atoms/Header';
import BottomNavigationBar from '../Components/atoms/navbar';
import { Picker } from '@react-native-picker/picker';

import FloatingButton from '../Components/atoms/FloatingButton';
import Loader from '../Components/molecules/Loader';
import SearchBar from '../Components/atoms/SearchBar';

interface RouteParams {
  userId: string;
}
interface FolderData {
  _id: string;
  folderName: string;
  folderAccess: {
    DelegateFolderAuthID: string;
    AccessFolderID: string[];
  }[];
}

const FolderManagementScreen = ({ route }: { route: any }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'FolderManagementScreen'>>();
  const { userId } = route.params as RouteParams;
  const [authData, setAuthData] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [folderName, setFolderName] = useState('');
  const [delegateUserId, setDelegateUserId] = useState('');
  const [accessType, setAccessType] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState('');
  const [searchText, setSearchText] = useState('');


  const fetchFolders = async () => {
    if (!userId) {
      console.error('User ID is missing');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await Folder.getAllFolders(userId) as { folders: any[] };
      if (data && data.folders) {
        setFolders(data.folders);
      }
    } catch (error: any) {
      console.error('Error fetching folders:', error.message);
      Alert.alert('Error', 'Failed to fetch folders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [userId]);

  useEffect(() => {
    const fetchAuthData = async () => {
      console.log('Fetching Auth Data...');
      console.log('UserId:', userId);

      if (userId) {
        try {
          const data = await Controller.getAuth(userId);
          console.log('Fetched Auth Data:', data);

          if (data) {
            // Extract only _id and name for the picker
            const filteredAuthData = data.map((user: any) => ({
              _id: user._id,
              name: user.name
            }));
            setAuthData(filteredAuthData);
          }
        } catch (error) {
          console.error('Error fetching Auth data:', error);
        }
      } else {
        console.log('No userId found.');
      }
    };

    fetchAuthData();
  }, [userId]);

  const filteredFolders = folders.filter(folder =>
    folder.folderName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFolderPress = (userId: string, folderId: string) => {
    navigation.navigate('FileManagementScreen', { userId, folderId });
  };

  const handleEditPress = (folderId: string) => {
    const folder = folders.find(f => f._id === folderId);
    if (folder) {
      setFolderName(folder.folderName);
      setDelegateUserId(folder.folderAccess.length > 0 ? folder.folderAccess[0].DelegateFolderAuthID : '');
      setAccessType(folder.folderAccess.length > 0 ? folder.folderAccess[0].AccessFolderID : []);
      setCurrentFolderId(folderId);
      setEditMode(true);
      setModalVisible(true);
    }
  };

  const handleDeletePress = async (folderId: string) => {
    try {
      if (!userId || !folderId) {
        console.error('User ID or Folder ID is missing');
        return;
      }

      const response = await Folder.deleteFolder(userId, folderId);
      console.log('Folder deleted successfully:', response);
      Alert.alert('Success', 'Folder deleted successfully!');
      fetchFolders();
    } catch (error: any) {
      console.error('Delete Folder Error:', error.message);
      Alert.alert('Error', 'Failed to delete folder. Please try again.');
    }
  };

  const createFolder = async () => {
    try {
      if (!folderName) {
        Alert.alert('Error', 'Please enter a folder name.');
        return;
      }

      // Ensure delegateUserId is valid
      if (!delegateUserId) {
        console.log('Selected Delegate User ID:', delegateUserId);

        Alert.alert('Error', 'Please select a delegate user.');
        return;
      }

      // Ensure accessType is an array and not empty
      if (accessType.length === 0) {
        Alert.alert('Error', 'Please select at least one access type.');
        return;
      }

      // Construct folderAccessData
      const folderAccessData = [{
        DelegateFolderAuthID: delegateUserId,
        AccessFolderID: accessType
      }];

      setLoading(true);
      const response = await Folder.createFolder(userId, {
        folderName,
        folderAccess: folderAccessData
      });

      console.log('Folder Created Successfully:', response);
      Alert.alert('Success', 'Folder created successfully!');
      setFolderName('');
      setDelegateUserId('');
      setAccessType([]);
      setModalVisible(false);
      fetchFolders();
    } catch (error: any) {
      console.error('Create Folder Error:', error);
      Alert.alert('Error', 'Failed to create folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFolder = async () => {
    try {
      if (!folderName) {
        Alert.alert('Error', 'Please enter a folder name.');
        return;
      }

      // Ensure delegateUserId is valid
      if (!delegateUserId) {
        console.log('Selected Delegate User ID:', delegateUserId);

        Alert.alert('Error', 'Please select a delegate user.');
        return;
      }

      // Ensure accessType is an array and not empty
      if (accessType.length === 0) {
        Alert.alert('Error', 'Please select at least one access type.');
        return;
      }

      // Construct folderAccessData
      const folderAccessData = [{
        DelegateFolderAuthID: delegateUserId,
        AccessFolderID: accessType
      }];

      setLoading(true);
      const response = await Folder.updateFolder(userId, currentFolderId, {
        folderName,
        folderAccess: folderAccessData
      });

      console.log('Folder Updated Successfully:', response);
      Alert.alert('Success', 'Folder updated successfully!');
      setFolderName('');
      setDelegateUserId('');
      setAccessType([]);
      setModalVisible(false);
      fetchFolders();
    } catch (error: any) {
      console.error('Update Folder Error:', error);
      Alert.alert('Error', 'Failed to update folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAccessType = (type: string) => {
    if (accessType.includes(type)) {
      setAccessType(accessType.filter(item => item !== type));
    } else {
      setAccessType([...accessType, type]);
    }
  };

  return (
    <LinearGradient colors={['#F0F4FF', '#D9E4FF']} style={{ flex: 1 }}>
      <Header title="Folder Management" userId={userId}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 16, position: 'relative' }}>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Files"
          iconName="folder-search-outline"
        />

        {loading ? (
          <Loader />
        ) : (
          <View style={styles.foldersContainer}>
            {filteredFolders.map(folder => (
              <LinearGradient key={folder._id} colors={['#6C63FF', '#8A85FF']} style={styles.folderWrapper}>
                <TouchableOpacity style={styles.folderItem} onPress={() => handleFolderPress(userId, folder._id)}>
                  <MaterialCommunityIcons name="folder-open" size={60} color="#FFF" />
                  <Text style={styles.folderText}>{folder.folderName}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleEditPress(folder._id)}>
                      <MaterialCommunityIcons name="rename-box" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(folder._id)}>
                      <MaterialCommunityIcons name="delete" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ))}


          </View>
        )}

      </ScrollView>
      <View style={styles.floatingButtonContainer}>
        <FloatingButton onPress={() => {
          setEditMode(false);
          setModalVisible(true);
        }} />
      </View>


      <BottomNavigationBar userId={userId} activeScreen="Folders" />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Folder Name"
              value={folderName}
              onChangeText={setFolderName}
              style={styles.input}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={delegateUserId}
                onValueChange={(itemValue) => setDelegateUserId(itemValue)}
                style={styles.picker}
                dropdownIconColor="#6C63FF"
              >
                <Picker.Item label="Select Delegate User" value="" />
                {authData.map(user => (
                  <Picker.Item label={user.name} value={user._id} key={user._id} />
                ))}
              </Picker>
            </View>
            <View style={styles.toggleContainer}>
              <Text style={styles.sectionTitle}>Patient Access</Text>
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
                    <View
                      style={[
                        styles.iconWrapper,
                        accessType.includes(type)
                          ? styles.iconRight
                          : styles.iconLeft,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={accessType.includes(type) ? 'check-circle' : 'close-circle'}
                        size={20}
                        color="white"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={editMode ? handleUpdateFolder : createFolder}>
              <Text style={styles.createButtonText}>{editMode ? 'Update Folder' : 'Create Folder'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  foldersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  folderWrapper: {
    borderRadius: 15,
    padding: 12,
    marginVertical: 8,
    width: '48%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  folderItem: {
    alignItems: 'center',
  },
  folderImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  folderText: {
    fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 3
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 95,
    right: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'red',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
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
  createButton: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
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

export default FolderManagementScreen;