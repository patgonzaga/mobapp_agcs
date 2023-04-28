import { useContext } from 'react';
import { View, StyleSheet,ImageBackground ,TouchableOpacity, Image} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';
import backgroundImage from '../assets/bg.jpg'; 
import { AuthContext } from '../context/AuthContext';
import LogsScreen from './LogsScreen';
import UserListScreen from './admin/UserListScreen';

const Tab = createBottomTabNavigator();

function DashboardScreen() {
  const {isLoading, userInfo} = useContext(AuthContext);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Activity Logs"
        component={ActivityLogScreen}
        options={{
          tabBarLabel: 'Activity Logs',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="format-list-bulleted" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account-circle" size={size} color={color} />;
          },
        }}
      />
    {userInfo.is_admin == 1 &&  
          <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="cog" size={size} color={color} />;
            },
          }}
        />
    }
 


    </Tab.Navigator>
  );
}

function HomeScreen({navigation}) {
  const {isLoading, logout} = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
  };
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('About')}>
    <Icon name="information" size={50} color={'#018de5'} />
    <Text style={styles.buttonText}>About</Text> 
   </TouchableOpacity>

   <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register Plate')}>
   <Icon name="car-cog" size={50} color={'#018de5'} />
   <Text style={styles.buttonText}
   >Register Plate</Text> 

   </TouchableOpacity>
   <TouchableOpacity style={styles.button}  onPress={handleLogout}>
        <Icon name="logout" size={50} color={'#018de5'} />
        <Text style={styles.buttonText}
        >Logout</Text> 
      </TouchableOpacity>
    </ImageBackground>
  );
}
function UserProfileScreen({navigation}) {
  const {userInfo} = useContext(AuthContext);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
       <View style={styles.row}>
          {userInfo.img ?   

          <Image
          style={styles.logo} 
              source={{uri: userInfo.img}}
              
            />:      
          <Image
          style={styles.logo} 
              source={require('../assets/user-avatar.png')}
              
            />
          }
        <View>
          <Text style={styles.textDisplay}>{userInfo.username}</Text>
            <Text style={styles.textDisplayEmail}>{userInfo.email}</Text>
        </View>
           
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edit User Information')}>
        <Icon name="account-edit" size={50} color={'#018de5'} />
         <Text style={styles.buttonText}>Edit Details</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Change Password')}>
        <Icon name="key-change" size={50} color={'#018de5'} />
        <Text style={styles.buttonText}
        >Change Password</Text> 
        </TouchableOpacity>

        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('User Activity Logs')}>
        <Icon name="view-list-outline" size={50} color={'#018de5'} />
          <Text style={styles.buttonText}
          >Activity Logs</Text> 
        </TouchableOpacity>

 
    </ImageBackground>
  );
}
function SettingsScreen({navigation}) {
  const {isLoading, userInfo} = useContext(AuthContext);
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('User List')}>
    <Icon name="account-group" size={50} color={'#018de5'} />
    <Text style={styles.buttonText}>Users</Text> 
   </TouchableOpacity>

   <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RFID List')}>
    <Icon name="card-plus-outline" size={50} color={'#018de5'} />
    <Text style={styles.buttonText}>RFID</Text> 
   </TouchableOpacity>
    </ImageBackground>
  );
}
function ActivityLogScreen({navigation}) {
  
  return (
    <LogsScreen/>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center"
  },
  row:{
    flexDirection:'row',
    paddingHorizontal: 50
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 5,
  },
  textDisplay: {
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 20,
    justifyContent: 'center',
    color: 'lightblue'

  },
  textDisplayEmail:{
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 7,
    justifyContent: 'center',
    color: 'lightblue'
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
    width: '40%',
    height: '20%',
    borderRadius: 15,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00bed8'
  },
  buttonText:{
    color: '#018de5',
    fontWeight: 'bold',
  }
});

export default DashboardScreen;