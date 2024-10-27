import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
}

const Input: React.FC<InputProps> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false, 
  keyboardType = 'default', 
  ...props 
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.input}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default Input;