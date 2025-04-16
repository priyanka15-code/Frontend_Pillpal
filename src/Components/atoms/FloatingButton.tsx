
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
});

export default FloatingButton;
