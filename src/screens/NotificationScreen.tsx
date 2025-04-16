
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { getNotifications, NotificationService } from '../services/apiservice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FloatingButton from '../Components/atoms/FloatingButton';
import BottomNavigationBar from '../Components/atoms/navbar';
import Header from '../Components/atoms/Header';

import { RootStackParamList } from '../navigation/AppNavigator'; // Import RootStackParamList
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



interface NotificationScreenProps {
  route: { params: { userId: string } };
}

interface Medicine {
  medicineName: string;
  take: string;
}

interface Timing {
  meal?: string;
  time?: string;
  customTime?: string;
}

interface Notification {
  _id: string;
  dosage: string;
  timing: Timing[];
  medicines: {
    _id: string;
    medicineName: string;
    take: string;
  }[];
  startDate: string;
  endDate: string;
  userId: string;
  mobileNumber?: string;
  DelegatedPatientID?: string | null;
  DelegateAuthID?: string | null;
  createdAt: string;
  updatedAt: string;
  duration?: {
    value: number;
    unit: string;
  }; // 👈 Add this line
}



const NotificationScreen: React.FC<NotificationScreenProps> = ({ route }) => {
  const { userId } = route.params || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Use NativeStackNavigationProp with useNavigation

  useEffect(() => {
    console.log('Route params:', route.params);
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);


  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(userId);
      if (Array.isArray(response?.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
        console.warn('Invalid notification response format:', response);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };


  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User ID is missing. Please provide a valid User ID.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Header title="Notification" userId={userId}/>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <View key={notification._id} style={styles.notificationItem}>
              <View style={styles.notificationDetails}>
              <View style={styles.iconWrapper}>
  <MaterialCommunityIcons name="pill" size={50} color="#4B4DED" style={styles.notificationIcon} />
</View>
                <View>
                  {notification.medicines.map((medicine: Medicine, index: number) => (
                    <Text key={index} style={styles.medicineName}>{medicine.medicineName} ({medicine.take})</Text>
                  ))}
                  <Text style={styles.dosageText}>Dosage: {notification.dosage}</Text>
                  {notification.duration && (
                    <Text style={styles.durationText}>
                      Duration: {notification.duration.value} {notification.duration.unit}
                    </Text>
                  )}
                  <Text style={styles.dateText}>
                    Start Date: {new Date(notification.startDate).toISOString().split("T")[0]}
                  </Text>
                  <Text style={styles.dateText}>
                    End Date: {notification.endDate ? new Date(notification.endDate).toISOString().split("T")[0] : "N/A"}
                  </Text>

                </View>
              </View>
              <View style={styles.timingContainer}>
                {notification.timing.map((time, index) => (
                  <Text key={index} style={styles.timingText}>{time.meal || time.time || time.customTime || "N/A"}</Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        <FloatingButton onPress={() => navigation.navigate('AddNotificationScreen', { userId })} />
      </View>
      <BottomNavigationBar userId={userId} activeScreen="Notifications" />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  notificationItem: {
    backgroundColor: '#E3E6FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 20,
  },
  notificationIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4,
  shadowColor: '#000',
  shadowOffset: { width: 3, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  transform: [{ rotateX: '15deg' }, { rotateY: '15deg' }],
    marginRight: 10,
  },
  medicineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B4DED',
  },
  dosageText: {
    fontSize: 14,
    marginTop: 5,
  },
  durationText: {
    fontSize: 14,
    marginTop: 5,
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
  },
  timingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
   

  },
  timingText: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#4B4DED',
    color: '#FFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#4B4DED',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    marginBottom: 20,
  },
  modelbutton: {
    backgroundColor: '#4B4DED',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modelbuttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modelbuttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
});

export default NotificationScreen;