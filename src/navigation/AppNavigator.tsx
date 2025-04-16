
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/singupScreen';
import HomeScreen from '../screens/Homescreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import PatientListScreen from '../screens/PatientScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import FolderManagementScreen from '../screens/FolderScreen';
import FileManagementScreen from '../screens/FileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AddNotificationScreen from '../screens/AddNotificationScreen';
import FileDetailsScreen from '../screens/FileDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';



export type RootStackParamList = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  VerifyOTPScreen: { mobileNumber: string };
  HomeScreen: { userId: string; fullName?: string; _id?: string };
  AuthDetailsScreen: { _id: string };
  FileManagementScreen: { userId: string; folderId: string };
  FolderManagementScreen: { userId: string };
  PatientListScreen: { userId: string; fullName?: string; _id?: string };
  PatientDetailsScreen: { userId: string; patientId: string }; 
  NotificationScreen: { userId: string };
  ForgotPasswordScreen: undefined;
  AddNotificationScreen: { userId: string };
  FileDetailsScreen: {
    fileId: string;
    folderId: string;
    userId: string;
  };
  ProfileScreen: { userId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
      <Stack.Screen name="PatientListScreen" component={PatientListScreen} />
      <Stack.Screen name="PatientDetailsScreen" component={PatientDetailsScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="FolderManagementScreen" component={FolderManagementScreen} />
      <Stack.Screen name="FileManagementScreen" component={FileManagementScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="AddNotificationScreen" component={AddNotificationScreen} />
      <Stack.Screen name="FileDetailsScreen" component={FileDetailsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />


    </Stack.Navigator>
  );
};

export default AppNavigator;