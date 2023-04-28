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
          {userInfo.img ?   

          <Image
              source={{uri: userInfo.img}}
              style={styles.avatar}
            />:      
          <Image
              source={require('../assets/user-avatar.png')}
              style={styles.avatar}
            />
          }
   
            <Text style={styles.textDisplay}>{userInfo.username}</Text>
            <Text style={styles.textDisplay}>{userInfo.email}</Text>
        </View>
        <View style={styles.container2}>

        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('Edit User Information')}>
         <Text style={styles.buttonText}>Edit Details</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('Change Password')}>
        <Text style={styles.buttonText}
        >Change Password</Text> 
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate('User Activity Logs')}>
          <Text style={styles.buttonText}
          >Activity Logs</Text> 
        </TouchableOpacity>


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
    fontSize: 20,
    paddingLeft: 10,
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
