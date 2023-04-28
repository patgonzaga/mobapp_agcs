import React, { useState, useEffect, useContext } from 'react';
import { Image, Text, TouchableOpacity, StyleSheet,ImageBackground } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { BASE_URL } from "../config";
import { Picker } from '@react-native-picker/picker';
import backgroundImage from '../assets/bg.jpg'; 

function RegistrationScreen({navigation}) {
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [rfid, setRfid] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [options, setOptions] = useState([]);

  const {isLoading, registerPlate} = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${BASE_URL}/get-rfid.php`)
      .then(response => {
        setOptions(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleRegisterPress = () => {
    if (fullname && plateNo && licenseNo) {
      registerPlate(fullname, plateNo, licenseNo, address, contactNo, rfid)


    } else {
      alert('Please fill out all fields.');
    }
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading}/>
      {/* <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50} /> */}
        <Text style={styles.welcome}>Plate Number Registration</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fullname"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setFullname(text)}
          value={fullname}
        /> 
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setAddress(text)}
          value={address}
        /> 
        <TextInput
          style={styles.input}
          placeholder="Enter contact no."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setContactNo(text)}
          value={contactNo}
        /> 
      
        <Picker
         style={styles.pickerView}
          selectedValue={rfid}
          onValueChange={itemValue => setRfid(itemValue)}
          placeholder="Enter RFID"
        >
        {options.map(option => (
          <Picker.Item key={option.id} label={option.rfid} value={option.rfid} />
        ))}
      </Picker>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle plate number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPlateNo(text)}
          value={plateNo}
        /> 
        <TextInput
          style={styles.input}
          placeholder="Enter license number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setLicenseNo(text)}
          value={licenseNo}
        /> 
      <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
        <Text style={styles.loginText}
        >Register</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registered Plate List')}>
        <Text style={styles.switchText}>Click here to view registered plate lists.</Text>
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
  pickerView: {
    backgroundColor: "#ededed",
    borderRadius: 30,
    width: "80%",
    height: 30,
    marginVertical: 5,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
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
    marginLeft: '-17%',
    color: 'lightblue'
  },
  switchText: {
    marginTop: 30,
    marginBottom: 10,
    color: '#018de5',
    fontWeight: 'bold',
  },
});
export default RegistrationScreen;