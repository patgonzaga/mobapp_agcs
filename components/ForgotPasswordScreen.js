import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../config";
import backgroundImage from '../assets/bg.jpg'; 


const ForgotPasswordScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSent, setIsSent] = useState(false);


  const handleResetPassword = () => {
    if (password !== confirmPassword) {
        return Promise.reject(new Error('Passwords do not match'));
      }
      const params = {
          email: email,
          otp: otp,
          password: password
        };
        console.log(email)
      axios.get(`${BASE_URL}/reset-password.php`, { params })
      .then((res) => {
        console.log(res.data)
        alert(res.data.msg)
        if(res.data.status){
        navigation.navigate('Login');
        }
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
      });
  };

  const handleSendEmail = () => {
    if (email) {
        const params = {
            email: email,
          };
          
      
          axios.get(`${BASE_URL}/send-email.php`, { params })
           
        .then((res) => {

            alert(res.data.msg)
            if(res.data.status){
                setIsSent(true);

            }
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    } else {
      alert('Please enter your email.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      {isSent ? (
        <>
          <TextInput
          style={styles.input}
            label="Enter Password Reset Code"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
          style={styles.input}
            label="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
          style={styles.input}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button mode="contained" style={styles.button} onPress={handleResetPassword}>
            Reset Password
          </Button>
        </>
      ) : (
        <>
          <TextInput
          style={styles.input}
            label="Enter email"
            value={email}
            onChangeText={setEmail}
          />
          <Button mode="contained" style={styles.button} onPress={handleSendEmail}>
            Send Password Reset Code
          </Button>
        </>
      )}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: '80%',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    width: '80%',
    height: 50,
    borderRadius: 15,
    backgroundColor: '#018de5',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default ForgotPasswordScreen;
