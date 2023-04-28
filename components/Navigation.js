import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import DashboardScreen from './DashboardScreen';
import HomeScreen from './HomeScreen';
import { AuthContext } from '../context/AuthContext';
import UserRegistrationScreen from './UserRegistrationScreen';
import ProfileScreen from './ProfileScreen';
import LogsScreen from './LogsScreen';
import AboutScreen from './AboutScreen';
import RegisteredPlatesScreen from './RegisteredPlatesScreen';
import UserListScreen from './admin/UserListScreen';

// Import Screens

const Stack = createNativeStackNavigator();

function Navigation() {

  const {userInfo} = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
         {userInfo.username ? 
        <> 
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Register Plate" component={RegistrationScreen} />
        <Stack.Screen name="User Information" component={ProfileScreen} />
        <Stack.Screen name="Activity Logs" component={LogsScreen} />
        <Stack.Screen name="User List" component={UserListScreen} />
        <Stack.Screen name="Registered Plate List" component={RegisteredPlatesScreen} />
         </>
        :
        <>
         <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={UserRegistrationScreen} />
        </>
        } 
       
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigation;