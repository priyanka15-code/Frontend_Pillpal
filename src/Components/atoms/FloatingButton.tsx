import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface FloatingButtonProps {
  onPress: () => void;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress, text = '+', style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.floatingButton, style]} onPress={onPress}>
      <Text style={[styles.floatingButtonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6C63FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButtonText: {
    fontSize: 30,
    color: 'white',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navItem: {
    flex: 1, // Ensure equal spacing
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
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
});

export default FloatingButton;
