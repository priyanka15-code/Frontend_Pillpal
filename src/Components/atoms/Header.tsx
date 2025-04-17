import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation types
type RootStackParamList = {
  ProfileScreen: { userId: string };
  // other screens can be added here
};

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileScreen'>;

interface HeaderProps {
  title: string;
  userId: string;
}

const Header: React.FC<HeaderProps> = ({ title, userId }) => {
  const navigation = useNavigation<HeaderNavigationProp>();

  return (
    <LinearGradient colors={['#6C63FF', '#8A85FF']} style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('ProfileScreen', { userId })}
        >
          <Image source={require('../../assets/image12.png')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Header;
