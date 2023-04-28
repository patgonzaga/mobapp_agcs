import { Button, TextInput } from 'react-native-paper';
import { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../assets/bg.jpg'; 

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, login } = useContext(AuthContext);

  const handleLogin = () => {
    if (username && password) {
      login(username, password);
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading} />
      <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50} />
      <Text style={styles.welcome}>Welcome!</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('Forgot password')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signup}>Don't have an account? Sign up</Text>
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

export default LoginScreen;
