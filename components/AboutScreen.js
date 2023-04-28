
import { useContext } from 'react';
import { StyleSheet, Text, Image, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../assets/bg.jpg'; 

export default function AboutScreen() {

  const {isLoading} = useContext(AuthContext);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading}/>
      <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50} />
        <Text style={styles.title}>AGCS</Text>
        <Text style={styles.subtitle}>Automatic Gate Control System </Text>
        <Text style={styles.aboutText}>An automatic gate control system is an electronic system that allows for the remote or automatic opening and closing of gates or doors. It typically consists of a control panel, a receiver, and a transmitter (e.g., remote control). The system can be activated by various means, including a keypad, card reader, or sensor, and it can be configured to allow access only to authorized individuals. Automatic gate control systems are commonly used in residential and commercial properties to enhance security and convenience.</Text>
  
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
  title:{
    fontSize: 30,
    fontWeight: '800',
    
  },
  subtitle:{
    fontSize: 20,
    fontWeight: '800',
    
  },
  logo: {
    width: 200,
    height: 200,
  },
  aboutText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 7
  },
});
