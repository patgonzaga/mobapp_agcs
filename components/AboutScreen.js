
import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';

export default function AboutScreen() {

  const {isLoading} = useContext(AuthContext);

  return (
    <View>
      <Spinner visible={isLoading}/>
        <View style={styles.container1}>
            <Text style={styles.title}>About </Text>
            <Text style={styles.subTitle}>Automatic Control Gate System</Text>
        </View>
        <View style={styles.container2}>
            <Text style={styles.aboutText}>An automatic gate control system is an electronic system that allows for the remote or automatic opening and closing of gates or doors. It typically consists of a control panel, a receiver, and a transmitter (e.g., remote control). The system can be activated by various means, including a keypad, card reader, or sensor, and it can be configured to allow access only to authorized individuals. Automatic gate control systems are commonly used in residential and commercial properties to enhance security and convenience.</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container1: {
    backgroundColor: '#fff',
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: 'lightgreen',
    width: '100%',
    height: '70%'
  },
  title:{
    fontSize: 35,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',

  },
  aboutText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 7
  },
});
