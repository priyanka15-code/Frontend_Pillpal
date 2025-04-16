import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  iconName?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  iconName = 'magnify',
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={iconName}
        size={20}
        color="#888"
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
});

export default SearchBar;
