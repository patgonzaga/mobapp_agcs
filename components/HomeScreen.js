import { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({navigation}) {

  const {isLoading, userInfo} = useContext(AuthContext);

  return (
    <View>
      <Spinner visible={isLoading}/>
        <View style={styles.container1}>
          {userInfo.is_admin == 1 ?   

          <Image
              source={require('../assets/admin-avatar.png')}
              style={styles.avatar}
            />:      
          <Image
              source={require('../assets/user-avatar.png')}
              style={styles.avatar}
            />
          }
   
            <Text style={styles.greetings}>Hi! {userInfo.username}</Text>
        </View>
        <View style={styles.container2}>

        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('User Information')}>
         <Text style={styles.buttonText}>User Information</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('Register Plate')}>
        <Text style={styles.buttonText}
        >Register Plate</Text> 
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('Activity Logs')}>
          <Text style={styles.buttonText}
          >Activity Logs</Text> 
        </TouchableOpacity>

        {userInfo.is_admin == 1 ?   
        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('User List')}>
          <Text style={styles.buttonText}
          >User List</Text> 
        </TouchableOpacity>
        :''}

        </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container1: {
    backgroundColor: '#fff',
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '50%',
    alignItems: "center",
    paddingTop: "10%"
  },
  greetings:{
    fontSize: 35,
    fontWeight: '800',
  },
  dateTime:{
    backgroundColor: 'lightgreen',
    width: 300,
    height: 100,
    borderRadius: 30
  },
  textDisplay: {
    fontSize: 25,
    paddingLeft: 20,
    paddingTop: 7
  },
  buttons:
  {
    width:"70%",
    height:50,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"#fff",
    marginBottom: 10,
    borderRadius: 10
   
  },
  buttonText:{
    fontSize: 25,
    fontWeight: '800'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
});
