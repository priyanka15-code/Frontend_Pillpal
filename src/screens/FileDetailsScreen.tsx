import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getAllFiledetails } from '../services/apiservice';
import Header from '../Components/atoms/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigationBar from '../Components/atoms/navbar';
import ImageViewer from 'react-native-image-zoom-viewer';

type FileDetailsScreenRouteProp = RouteProp<RootStackParamList, 'FileDetailsScreen'>;

const FileDetailsScreen = () => {
  const route = useRoute<FileDetailsScreenRouteProp>();
  const { fileId, folderId, userId } = route.params;

  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const res = await getAllFiledetails(userId, folderId, fileId);
        if (res && Array.isArray(res.files)) {
          const specificFile = res.files.find((f: any) => f._id === fileId); // Match fileId
          if (specificFile) {
            setFile(specificFile); // Set the specific file
          } else {
            Alert.alert('File not found');
          }
        } else {
          Alert.alert('No files found');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch file details');
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [userId, folderId, fileId]);

  const isImage = file?.fileType?.includes('jpeg') || file?.fileType?.includes('png') || file?.fileType?.includes('jpg');

  const getFileUrl = (filePath: string) => {
    const fileName = filePath.split(/[\\/]/).pop();
    return `http://10.0.2.2:3000/uploads/${fileName}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!file) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>No file found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="File Details"  userId={userId} />

      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.card, { marginBottom: 20 }]}>
          {isImage ? (
            <>
              <TouchableOpacity onPress={() => setIsZoomVisible(true)}>
                <Image
                  source={{ uri: `${getFileUrl(file.filePath)}?${Date.now()}` }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Modal
                visible={isZoomVisible}
                transparent={true}
                onRequestClose={() => setIsZoomVisible(false)}
              >
                <ImageViewer
                  imageUrls={[{ url: getFileUrl(file.filePath) }]}
                  enableSwipeDown={true}
                  onSwipeDown={() => setIsZoomVisible(false)}
                  onCancel={() => setIsZoomVisible(false)}
                />
              </Modal>
            </>
          ) : (
            <Text style={styles.noPreview}>
              No preview available for this file type: {file?.fileType}
            </Text>
          )}

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Update file')}>
              <MaterialCommunityIcons name="file-document-edit" style={styles.iconButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Delete file')}>
              <MaterialCommunityIcons name="file-remove" style={styles.iconButton} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoValue}>{file.fileName}</Text>
            <Text style={styles.infoLabel}>
              {new Date(file.uploadedAt).toLocaleString()}
            </Text>
            {file.fileType === 'pdf' && (
              <TouchableOpacity
                style={styles.pdfButton}
                onPress={() => {
                  Alert.alert('PDF URL', getFileUrl(file.filePath));
                }}
              >
                <Text style={styles.pdfButtonText}>📄 View PDF</Text>
              </TouchableOpacity>
            )}
          </View>

          {file?.fileAccess?.length > 0 && (
            <View style={styles.accessSection}>
              <Text style={styles.label}>Access Permissions</Text>
              {file.fileAccess.map((access: any, idx: number) => (
                <View key={idx} style={styles.accessItem}>
                  <Image
                    source={{
                      uri: access?.profileImage
                        ? `${getFileUrl(access.profileImage)}`
                        : 'https://via.placeholder.com/50',
                    }}
                    style={styles.profileImage}
                  />
                  <View style={styles.accessInfo}>
                    <Text style={styles.accessName}>{access.FullName ?? 'Unknown'}</Text>
                    <Text style={styles.accessType}>{access.DelegateFileType ?? 'Unknown'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigationBar userId={userId} activeScreen="Folders" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 70, // Add margin to prevent overlapping with the BottomNavigationBar
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  noPreview: {
    marginTop: 20,
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  iconButton: {
    fontSize: 22,
    color: '#6C63FF',
    marginHorizontal: 8,
  },
  infoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  pdfButton: {
    marginTop: 16,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  accessSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  accessInfo: {
    flex: 1,
  },
  accessName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  accessType: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default FileDetailsScreen;