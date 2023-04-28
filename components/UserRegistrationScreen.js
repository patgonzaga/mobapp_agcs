import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';

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
    <View style={styles.container}>
      <Spinner visible={isLoading}/>
        <Image source={require('../assets/agcs_logo.png')} width={50} height={50}/>
        <Text style={styles.welcome}>Register</Text>
        
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          value={email}
        /> 
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
          value={username}
        /> 
      </View>
       <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        /> 
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Confirm Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
        /> 
      </View>

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterPress}>
        <Text style={styles.loginText}
        >Register</Text> 
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    backgroundColor: "lightgray",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn:
  {
    width:"70%",
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
  registerBtn:
  {
    width:"70%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"green",
  },
  welcome: {
    marginBottom: 30,
    fontSize: 30,
    fontWeight: 'bold'
  },
  switchText: {
    marginTop: 30,
  },
});

export default UserRegistrationScreen;