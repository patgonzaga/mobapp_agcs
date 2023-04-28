import { StatusBar } from 'expo-status-bar';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

 function LoginScreen({navigation }) {

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, login} = useContext(AuthContext);

  const handleLogin = () => {
    // Add your authentication logic here
    if (username && password) {
        login(username, password);
    } else {
      alert('Please fill out all fields.');
    }
   
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner visible={isLoading}/>
        <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50}/>
        <Text style={styles.welcome}>Welcome User!</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={setUsername}
        /> 
      </View>
       <View style={styles.inputView}>
        <TextInput
          style={styles.inputView}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        /> 
      </View>
      
      <TouchableOpacity style={styles.loginBtn} 
        onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text> 
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgot_button}>Don't have an account?</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerBtn}
      onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.loginText} >Signup</Text> 
      </TouchableOpacity>

      <StatusBar style="auto" />
    </SafeAreaView>
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
  logo:{
    width: 250,
    height: 250,
  }
});

export default LoginScreen;