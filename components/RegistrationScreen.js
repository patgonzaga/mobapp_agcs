import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { BASE_URL } from "../config";
import { Picker } from '@react-native-picker/picker';

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
    <View style={styles.container}>
      <Spinner visible={isLoading}/>
        {/* <Image source={require('../assets/agcs_logo.png')} width={20} height={20}/> */}
        <Text style={styles.welcome}>Plate Number Registration</Text>
        
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Enter fullname"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setFullname(text)}
          value={fullname}
        /> 
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Enter address"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setAddress(text)}
          value={address}
        /> 
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Enter contact no."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setContactNo(text)}
          value={contactNo}
        /> 
      </View>
        {/* <TextInput
          style={styles.inputView}
          placeholder="Enter rfid"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setRfid(text)}
          value={rfid}
        />  */}
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
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Enter vehicle plate number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPlateNo(text)}
          value={plateNo}
        /> 
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Enter license number"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setLicenseNo(text)}
          value={licenseNo}
        /> 
      </View>
      

      <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterPress}>
        <Text style={styles.loginText}
        >Register</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registered Plate List')}>
        <Text style={styles.switchText}>Click here to view registered plate lists.</Text>
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
  pickerView: {
    backgroundColor: "lightgray",
    borderRadius: 30,
    width: "70%",
    height: 30,
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

export default RegistrationScreen;