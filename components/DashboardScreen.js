import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';

 function DashboardScreen({navigation}) {

  const {isLoading, logout} = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
  };
  return (
    <View style={styles.container}>
      <Spinner visible={isLoading}/>
        <Image style={styles.logo} source={require('../assets/agcs_logo.png')} width={50} height={50}/>
        <Text style={styles.welcome}>Automatic Gate Control System</Text>
        
    <View style={styles.container2}>

    <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}
        >Home</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttons}  onPress={() => navigation.navigate('About')}>
        <Text style={styles.buttonText}>About</Text> 
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttons}  onPress={handleLogout}>
        <Text style={styles.buttonText}
        >Logout</Text> 
      </TouchableOpacity>

    </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    width:'100%',
    height: '40%',
    alignItems: "center",
    paddingTop: "10%"
  },
  buttons:
  {
    width:"70%",
    height:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#fff",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    borderRadius: 10
   
  },
  buttonText:{
    fontSize: 25,
    fontWeight: '800'
  },
  welcome: {
    marginBottom: 30,
    fontSize: 20,
    fontWeight: 'bold'
  },
  logo:{
    width: 200,
    height: 200,
  }
});

export default DashboardScreen;