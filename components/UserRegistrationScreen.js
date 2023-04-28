import { Button, TextInput } from 'react-native-paper';
import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../assets/bg.jpg'; 

function UserRegistrationScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {isLoading, registerUser} = useContext(AuthContext);

  const handleRegisterPress = () => {
    if (email && username && password && confirmPassword) {
      if (password === confirmPassword) {
        registerUser(email, username, password);
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Please fill out all fields.');
    }
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading}/>
      <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50} />
        <Text style={styles.welcome}>Register</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          value={email}
        /> 
      
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
          value={username}
        /> 
       
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        /> 
      
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
        /> 

      <Button mode="contained" style={styles.button} onPress={handleRegisterPress}>
      Register
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 200,
    height: 200,
  },
  input: {
    width: '80%',
    marginVertical: 5,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn:
  {
    width:"80%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,
    backgroundColor:"green",
  },
  forgot_button: {
    height: 30,
    marginTop: 30,
    marginBottom: 0,
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
  welcome: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '-60%',
    color: 'lightblue'
  },
  switchText: {
    marginTop: 30,
    marginBottom: 10,
    color: '#018de5',
    fontWeight: 'bold',
  },
});

export default UserRegistrationScreen;