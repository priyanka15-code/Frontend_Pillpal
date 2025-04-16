import React from 'react';
import { Text, TextStyle } from 'react-native';

interface TextComponentProps {
  text: string;
  style?: TextStyle;
}

const TextComponent: React.FC<TextComponentProps> = ({ text, style }) => {
  return <Text style={style}>{text}</Text>;
};

export default TextComponent;
