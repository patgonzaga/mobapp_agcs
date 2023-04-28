import React, { useContext,useState } from 'react';
import { View, Alert, ImageBackground, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from "../config";
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/bg.jpg'; 

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { isLoading, userInfo } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirm new password do not match.');
      return;
    }

      const params = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: userInfo.id,
        created_by: userInfo.username ?? 'unknown'
      };
      
      // console.log(params)
  
      axios.get(`${BASE_URL}/change-password.php`, { params })
        .then(res => {
      
          alert(res.data.msg);
          if(res.data.status){
            // navigation.navigate('User Information');
            navigation.goBack();
          }
  
        })
        .catch(error => {
          alert(error);
        });

  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <TextInput
       style={styles.input}
        placeholder="Current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TextInput
       style={styles.input}
        placeholder="New password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
       style={styles.input}
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
      />

      <Button mode="contained" style={styles.button} onPress={handleChangePassword}>
      Change Password
      </Button>

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
  logo: {
    width: 200,
    height: 200,
  },
  welcome: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '-55%',
    color: 'lightblue'
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
  signup: {
    marginTop: 30,
    marginBottom: 10,
    color: '#018de5',
    fontWeight: 'bold',
  },
  forgot: {
    marginTop: 50,
    color: '#018de5',
    fontWeight: 'bold',
  },
});
export default ChangePasswordScreen;
