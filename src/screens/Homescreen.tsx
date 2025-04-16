import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Animated, Alert, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { Controller, getNotifications } from '../services/apiservice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomNavigationBar from '../Components/atoms/navbar';
import { TextInput } from 'react-native-gesture-handler';
import Header from '../Components/atoms/Header';

interface HomeScreenProps {
  route: { params: { userId: string } };
}

interface Patient {
  userId: string;
  _id: string;
  name: string;
  profileImage?: string;
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
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { userId } = route.params;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [markedDates, setMarkedDates] = useState<any>({});
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


  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    // Filter notifications for selected date
    const filtered = notifications.filter(notification => {
      const date = moment(dateString);
      return date.isBetween(
        moment(notification.startDate),
        moment(notification.endDate),
        null,
        '[]'
      );
    });
    // You can use these filtered notifications to show in a modal or different view
  };


  useEffect(() => {
    const fetchPatients = async () => {
      if (userId) {
        try {
          const patientsData = await Controller.getPatient(userId);
          if (patientsData) {
            setPatients(patientsData);
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
        }
      }
    };
    fetchPatients();
  }, [userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const response = await getNotifications(userId);
          const notificationsArray: Notification[] = response?.data;

          if (!Array.isArray(notificationsArray)) {
            console.error('Error: Fetched notifications data is not an array.', notificationsArray);
            return;
          }

          const mealOptions = [
            { meal: 'Breakfast', defaultTime: '08:00 AM' },
            { meal: 'Lunch', defaultTime: '01:00 PM' },
            { meal: 'Dinner', defaultTime: '08:00 PM' }
          ];

          // Map all notification timings to actual datetime objects
          const upcomingTimings: { notification: Notification; timing: Timing; datetime: moment.Moment }[] = [];

          notificationsArray.forEach((notification) => {
            notification.timing.forEach((timing: Timing) => {
              let timeString = '';

              if (timing.customTime) {
                timeString = timing.customTime;
              } else if (timing.meal) {
                const mealMatch = mealOptions.find((m) => m.meal === timing.meal);
                if (mealMatch) {
                  timeString = mealMatch.defaultTime;
                }
              }

              if (timeString) {
                const datetime = moment(timeString, ['hh:mm A']);
                if (datetime.isValid() && datetime.isAfter(moment())) {
                  upcomingTimings.push({ notification, timing, datetime });
                }
              }
            });
          });

          // Sort all upcoming timings by their actual time
          upcomingTimings.sort((a, b) => a.datetime.diff(b.datetime));

          // Take only the first 5 upcoming
          const next5 = upcomingTimings.slice(0, 5);

          // Build structured notifications
          const sortedNotifications: Notification[] = [];

          next5.forEach(({ notification, timing }) => {
            const existing = sortedNotifications.find((n) => n._id === notification._id);
            if (existing) {
              existing.timing.push(timing);
            } else {
              sortedNotifications.push({
                ...notification,
                timing: [timing]
              });
            }
          });

          setNotifications(sortedNotifications);
          const today = moment().startOf('day');

          // Mark dates on calendar
          const datesWithPills: Record<string, any> = {};
          sortedNotifications.forEach((notification) => {
            const start = moment(notification.startDate);
            const end = moment(notification.endDate);
            const currentDate = start.clone();

            while (currentDate.isSameOrBefore(end, 'day')) {
              if (currentDate.isSameOrAfter(today, 'day')) {
                const dateKey = currentDate.format('YYYY-MM-DD');
                datesWithPills[dateKey] = {
                  marked: true,
                  dotColor: '#4B4DED',
                  customStyles: {
                    container: {
                      backgroundColor: '#4B4DED',
                    },
                    text: {
                      color: 'white',
                    },
                  },
                };
              }
              currentDate.add(1, 'day');
            }
          });

          setMarkedDates(datesWithPills);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          Alert.alert('Error', 'Failed to fetch notifications. Please try again later.');
        }
      }
    };

    fetchNotifications();
  }, [userId]);


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

    } catch (error) {
      console.error('Error adding patient:', error);
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  useEffect(() => {

  }, [userId]);

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

  return (
    <>

      <Header title="Healthy With PillPal"  userId={userId}/>


      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.sectionContainer}>
          <Calendar
            markedDates={markedDates}
            style={{
              borderRadius: 20,
              padding: 10,
              backgroundColor: '#fff',
            }}
            theme={{
              todayTextColor: '#4B4DED',
              arrowColor: '#4B4DED',
              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-SemiBold',
              textDayHeaderFontFamily: 'Poppins-Medium',
            }}
            onDayPress={({ dateString }) => handleDateSelect(dateString)}
          />
        </View>


        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today Pills</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {notifications.map((notification) => (
              <View key={notification._id} style={styles.pillItem}>
                <View style={styles.pillDetails}>
                  <MaterialCommunityIcons name="pill" size={30} color="#4B4DED" style={styles.pillIcon} />
                  <View>
                    <Text style={styles.pillName}>{notification.medicines[0].medicineName}</Text>
                    <Text style={styles.pillDosage}>{notification.dosage}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  {notification.timing.map((timingItem, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.pillTimeButton}
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                    >
                      <Text style={styles.pillTimeText}>
                        {timingItem.meal ? ` ${timingItem.time} -${timingItem.meal}` : `${timingItem.customTime}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Member</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PatientListScreen', { userId })}>
              <MaterialCommunityIcons name="view-grid-plus-outline" size={30} color="#4B4DED" style={styles.pillIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientScroll}>
            {patients.slice(0, 2).map((patient) => (  // Only showing the first two patients
              <View key={patient._id} style={styles.patientCard}>
                <Image
                  source={patient.profileImage ? { uri: patient.profileImage } : require('../assets/image12.png')}
                  style={styles.patientImage}
                />
                <Text style={styles.patientName}>{patient.name}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPressIn={handlePressIn} onPressOut={handlePressOut}>
              <MaterialCommunityIcons name="plus-thick" size={40} color="#4B4DED" style={styles.pillIcon} />
            </TouchableOpacity>
          </ScrollView>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }} />
        </View>
      </ScrollView>
      <Modal visible={showModal} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.title}> New Member</Text>

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

      <BottomNavigationBar userId={userId} activeScreen="Home" />
    </>
  );
};


const styles = StyleSheet.create({
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#4B4DED',
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  rightImages: {
    flexDirection: 'row',
    gap: 10,
  },
  smallImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    paddingTop: 20,
    marginTop: 25,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B4DED',
    marginBottom: 15,
    textAlign: 'center',
  },
  pillItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    backgroundColor: '#E3E6FD',
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
  },
  pillDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10
  },
  pillIcon: {
    marginRight: 10,
  },
  pillName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B4DED',
    marginBottom: 5,
  },
  pillDosage: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  pillTimeButton: {
    flexWrap: 'wrap',
    backgroundColor: '#4B4DED',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,

    marginBottom: 10,
  },
  pillTimeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientScroll: {
    marginTop: 10,
  },
  patientCard: {
    alignItems: 'center',
    width: 100,
    height: 150,
    marginRight: 15,
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: '#E3E6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  patientName: {
    marginTop: 5,
    color: '#4B4DED',
    fontSize: 20,
  },
  addButton: {
    width: 110,
    height: 150,
    backgroundColor: '#E3E6FD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
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

export default HomeScreen;
