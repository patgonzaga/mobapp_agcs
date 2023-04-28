import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';


const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = 'https://example.com/api';
  
const resetPassword = (token, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Promise.reject(new Error('Passwords do not match'));
    }
  
    return axios.post(`${API_URL}/reset-password`, {
      token,
      password,
    });
  };
  
  const handleResetPassword = () => {
    const { token } = route.params;

    resetPassword(token, password, confirmPassword)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
      });
  };

  return (
    <>
      <TextInput
        label="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleResetPassword}>
      Reset Password
      </Button>
    </>
  );
};

export default ResetPasswordScreen;
