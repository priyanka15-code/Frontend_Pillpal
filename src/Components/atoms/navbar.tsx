import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface BottomNavigationBarProps {
  activeScreen: string;
  userId?: string;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ activeScreen, userId }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigation = (screen: keyof RootStackParamList) => {
    if (!userId) {
      Alert.alert('User ID is missing', 'Please login again or try refreshing the app.');
      return;
    }

    switch (screen) {
      case 'HomeScreen':
        navigation.navigate('HomeScreen', { userId });
        break;
      case 'FolderManagementScreen':
        navigation.navigate('FolderManagementScreen', { userId });
        break;
      case 'PatientListScreen':
        navigation.navigate('PatientListScreen', { userId });
        break;
      case 'NotificationScreen':
        navigation.navigate('NotificationScreen', { userId });
        break;
      default:
        Alert.alert('Navigation Error', 'Invalid screen specified.');
    }
  };

  return (
    <View style={styles.bottomNavBar}>
      <TouchableOpacity onPress={() => handleNavigation('HomeScreen')} style={styles.navItem}>
        <MaterialCommunityIcons
          name="home"
          size={28}
          color={activeScreen === 'Home' ? '#6C63FF' : '#B0B0C3'}
        />
        <Text style={[styles.navItemText, activeScreen === 'Home' && styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('FolderManagementScreen')} style={styles.navItem}>
        <MaterialCommunityIcons
          name="prescription"
          size={28}
          color={activeScreen === 'Folders' ? '#6C63FF' : '#B0B0C3'}
        />
        <Text style={[styles.navItemText, activeScreen === 'Folders' && styles.activeText]}>Prescription</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('PatientListScreen')} style={styles.navItem}>
        <MaterialCommunityIcons
          name="account"
          size={28}
          color={activeScreen === 'Profile' ? '#6C63FF' : '#B0B0C3'}
        />
        <Text style={[styles.navItemText, activeScreen === 'Profile' && styles.activeText]}>Member</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigation('NotificationScreen')} style={styles.navItem}>
        <MaterialCommunityIcons
          name="reminder"
          size={28}
          color={activeScreen === 'Notifications' ? '#6C63FF' : '#B0B0C3'}
        />
        <Text style={[styles.navItemText, activeScreen === 'Notifications' && styles.activeText]}>
          Pill Reminder
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navItem: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  navItemText: {
    color: '#B0B0C3',
    fontSize: 12,
    marginTop: 4,
  },
  activeText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  activeIcon: {
    color: '#6C63FF',
  },
});

export default BottomNavigationBar;