import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { addFileToFolder, Controller, NotificationService } from '../services/apiservice';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../Components/atoms/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNavigationBar from '../Components/atoms/navbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type AddNotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'AddNotificationScreen'>;




interface Patient {
    userId: string;
    _id: string;
    name: string;
    profileImage?: string;
}

interface Timing {
    meal: string;
    time: string;
    customTime?: string;
}

interface Duration {
    unit: string;
    value?: number;
    additionalDetails?: string; 
}

const AddNotificationScreen: React.FC<AddNotificationScreenProps> = ({ route, navigation }) => {
    const { userId } = route.params;
    const [medicines, setMedicines] = useState([{ medicineName: "", take: "Full" }]);
    const [dosage, setDosage] = useState("");
    const [timing, setTiming] = useState<Timing[]>([{ meal: "", time: "", customTime: "" }]);
    const [duration, setDuration] = useState<Duration>({ unit: "days" });
    const [startDate, setStartDate] = useState(new Date());
    const [delegatedPatientID, setDelegatedPatientID] = useState("");
    const [delegateAuthID, setDelegateAuthID] = useState("");
    const [colorCode, setColorCode] = useState("red");
    const [authData, setAuthData] = useState<{ _id: string, name: string }[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [currentTimingIndex, setCurrentTimingIndex] = useState<number | null>(null);
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
     const [isModalVisible, setModalVisible] = useState(false);
  

    useEffect(() => {
        const fetchAuthData = async () => {
            if (userId) {
                try {
                    const data = await Controller.getAuth(userId);
                    if (data) {
                        const filteredAuthData = data.map((user: any) => ({
                            _id: user._id,
                            name: user.name
                        }));
                        setAuthData(filteredAuthData);
                    }
                } catch (error) {
                    console.error('Error fetching Auth data:', error);
                }
            }
        };

        fetchAuthData();
    }, [userId]);

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

    const handleAddMedicine = () => {
        setMedicines([...medicines, { medicineName: "", take: "Full" }]);
    };

    const handleMedicineChange = (index: number, key: string, value: string) => {
        const updatedMedicines = medicines.map((med, i) => i === index ? { ...med, [key]: value } : med);
        setMedicines(updatedMedicines);
    };

    const handleAddTiming = () => {
        setTiming([...timing, { meal: "", time: "", customTime: "" }]);
    };

    const handleTimingChange = (index: number, key: string, value: string) => {
        const updatedTimings = timing.map((t, i) => i === index ? { ...t, [key]: value } : t);
        setTiming(updatedTimings);
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
        
         formData.append('userId', userId);   
         setModalVisible(false);
         setSelectedFile(null);
       } catch (error) {
         console.error('Upload error:', error);
         Alert.alert('Error', 'Failed to upload file. Please try again.');
       } finally {
         setUploading(false);
       }
     };
   

    const handleAddNotification = async () => {
        if (
            medicines.some(m => !m.medicineName) ||
            !dosage ||
            timing.length === 0 ||
            !duration.unit ||
            !startDate ||
            !delegatedPatientID ||
            !delegateAuthID ||
            !colorCode
        ) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        if (!["red", "yellow", "blue", "green"].includes(colorCode)) {
            Alert.alert("Error", "Invalid color code");
            return;
        }

        if (["weekbased", "alternative", "weekwise"].includes(duration.unit) && !additionalDetails) {
            Alert.alert(
                "Error",
                `Additional details are required for '${duration.unit}' duration.`
            );
            return;
        }

        const notificationData = {
            medicines,
            dosage: dosage.trim(),
            timing,
            duration: { ...duration, additionalDetails },
            startDate: new Date(startDate).toISOString(),
            userId,
            DelegatedPatientID: delegatedPatientID,
            DelegateAuthID: delegateAuthID,
            colorCode,
        };

        try {
            await NotificationService.addNotification(userId, notificationData);
            Alert.alert("Success", "Notification added successfully.");
            navigation.goBack();
        } catch (error: any) {
            console.error("Error adding notification:", error.response?.data || error.message);
            Alert.alert("Error", error.response?.data?.message || "Failed to add notification");
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);
        if (selectedDate && currentTimingIndex !== null) {
            const hours = selectedDate.getHours();
            const minutes = selectedDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours % 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            handleTimingChange(currentTimingIndex, "customTime", formattedTime);
        }
    };
    const handlePickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setSelectedFile(response.assets[0]);
            }
        });
    };


    const handleCustomTimePress = (index: number) => {
        setCurrentTimingIndex(index);
        setShowTimePicker(true);
    };

    return (
        <GestureHandlerRootView style={styles.root}>
            <Header title="Add Notification"  userId={userId}/>
            <ScrollView contentContainerStyle={styles.container}>

                  {/* File Upload */}
                  <View style={styles.fileUploadContainer}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Choose File</Text>
                    </TouchableOpacity>
                    {selectedFile && (
                        <View>
                            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
                            
                        </View>
                    )}
                </View>
                {/* Medicines */}
                {medicines.map((med, index) => (
                    <View key={index}>
                        <View style={styles.inputGroup}>
                            <MaterialCommunityIcons name="medical-bag" size={24} color="black" />
                            <TextInput
                                placeholder="Medicine Name"
                                style={styles.input}
                                value={med.medicineName}
                                onChangeText={(text) => handleMedicineChange(index, "medicineName", text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Picker
                                selectedValue={med.take}
                                onValueChange={(value) => handleMedicineChange(index, "take", value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Full" value="Full" />
                                <Picker.Item label="Half" value="Half" />
                            </Picker>
                            <TouchableOpacity onPress={handleAddMedicine} style={styles.addButton}>
                                <MaterialCommunityIcons name="plus" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Dosage (e.g., 500mg)"
                        style={styles.input}
                        value={dosage}
                        onChangeText={setDosage}
                    />
                    <Picker selectedValue={colorCode} onValueChange={setColorCode} style={styles.picker}>
                        <Picker.Item label="Red" value="red" />
                        <Picker.Item label="Yellow" value="yellow" />
                        <Picker.Item label="Blue" value="blue" />
                        <Picker.Item label="Green" value="green" />
                    </Picker>
                </View>
                {/* Timings */}
                {timing.map((time, index) => (
                    <View key={index}>
                        <View style={styles.inputGroup}>
                            <Picker
                                selectedValue={time.meal}
                                onValueChange={(value) => handleTimingChange(index, "meal", value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Meal" value="" />
                                <Picker.Item label="Breakfast" value="Breakfast" />
                                <Picker.Item label="Lunch" value="Lunch" />
                                <Picker.Item label="Dinner" value="Dinner" />
                                <Picker.Item label="Custom" value="Custom" />
                            </Picker>
                            {time.meal === "Custom" && (
                                <TouchableOpacity
                                    onPress={() => handleCustomTimePress(index)}
                                    style={styles.dateInput}
                                >
                                    <Text>{time.customTime || "Select Custom Meal Time"}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Picker
                                selectedValue={time.time}
                                onValueChange={(value) => handleTimingChange(index, "time", value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Timing" value="" />
                                <Picker.Item label="Before" value="Before" />
                                <Picker.Item label="After" value="After" />
                            </Picker>
                            <TouchableOpacity onPress={handleAddTiming} style={styles.addButton}>
                                <MaterialCommunityIcons name="plus" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {/* Duration, Start Date, Mobile Number */}
                <View style={styles.inputGroup}>
                    <TextInput
                        placeholder="Duration (e.g., 7)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={duration.value ? duration.value.toString() : ""}
                        onChangeText={(value) =>
                            setDuration({ ...duration, value: parseInt(value, 10) })
                        }
                    />
                    <Picker
                        selectedValue={duration.unit}
                        onValueChange={(value) =>
                            setDuration({ ...duration, unit: value })
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Days" value="days" />
                        <Picker.Item label="Weeks" value="weeks" />
                        <Picker.Item label="Months" value="months" />
                        <Picker.Item label="Weekbased" value="weekbased" />
                        <Picker.Item label="Alternative" value="alternative" />
                        <Picker.Item label="Weekwise" value="weekwise" />
                    </Picker>
                </View>
                {["weekbased", "alternative", "weekwise"].includes(duration.unit) && (
                    <View style={styles.inputGroup}>
                        <TextInput
                            placeholder="Additional Details"
                            style={styles.input}
                            value={additionalDetails}
                            onChangeText={setAdditionalDetails}
                        />
                    </View>
                )}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                        <Text>{startDate.toISOString().split("T")[0]}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>
                <View style={styles.inputGroup}>
                    <Picker
                        selectedValue={delegatedPatientID}
                        onValueChange={(value) => setDelegatedPatientID(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Patient" value="" />
                        {patients.map((patient) => (
                            <Picker.Item key={patient._id} label={patient.name} value={patient._id} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={delegateAuthID}
                        onValueChange={(value) => setDelegateAuthID(value)}
                        style={styles.picker}
                    >
                        {authData.map((auth) => (
                            <Picker.Item key={auth._id} label={auth.name} value={auth._id} />
                        ))}
                    </Picker>
                </View>
                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={handleAddNotification}>
                        <LinearGradient
                            colors={['#6C63FF', '#8A85FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.addButtonText}>Set Notification</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavigationBar userId={userId} activeScreen="Notifications" />
            {showTimePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flexGrow: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 10,
        elevation: 20,
    },
    input: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        height: 50,
    },
    picker: {
        flex: 1,
        height: 50,
        marginLeft: 5,
        borderColor: '#6C63FF',
        borderWidth: 1,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: '#4B4DED',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonRow: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    gradientButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
        borderRadius: 20,
        width: 300,
    },
    addButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    dateInput: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        height: 50,
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    fileUploadContainer: {
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#4B4DED',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    addNotificationButton: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addNotificationButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddNotificationScreen;