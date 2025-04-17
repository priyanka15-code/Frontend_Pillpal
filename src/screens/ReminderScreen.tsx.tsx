// reminder.tsx

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const ReminderScreen = () => {
  const reminders = [
    {
      name: 'Metoprolol',
      time: 'Morning',
      food: 'After Meal',
      icon: require('../assets/pill.png'), 
    },
    {
      name: 'Atorvastatin',
      time: 'Afternoon',
      food: 'After Meal',
      icon: require('../assets/tablet.png'), 
    },
    {
      name: 'Fexofenadine',
      time: 'Evening',
      food: 'Before Meal',
      icon: require('../assets/pill.png'), 
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Alarm Icon and Title */}
      <View style={styles.alarmSection}>
        <Image
          source={require('../assets/alarm.png')} 
          style={styles.alarmIcon}
        />
        <Text style={styles.reminderTitle}>Pill Reminder</Text>
      </View>

      {/* User Greeting */}
      <View style={styles.userSection}>
        <Image
          source={require('../assets/user.png')} 
          style={styles.userAvatar}
        />
        <View>
          <Text style={styles.greetingText}>
            Hello olivia👋
          </Text>
          <Text style={styles.greetingSubText}>Time to take medicine</Text>
        </View>
        <Text style={styles.time}>11:30 PM</Text>
      </View>

      {/* Reminder Cards */}
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {reminders.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.icon} style={styles.cardIcon} />
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.time}</Text>
              <Text style={styles.cardSub}>{item.food}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5c3dff',
  },
  closeButton: {
    fontSize: 20,
    color: '#5c3dff',
  },
  alarmSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  alarmIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c3dff',
  },
  userSection: {
    backgroundColor: '#f3f3ff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingText: {
    color: '#5c3dff',
    fontWeight: 'bold',
  },
  greetingSubText: {
    color: '#666',
  },
  time: {
    marginLeft: 'auto',
    color: '#aaa',
    fontSize: 12,
  },
  cardContainer: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#dcd6ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c3fc5',
  },
  cardSub: {
    fontSize: 12,
    color: '#666',
  },
});
