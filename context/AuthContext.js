import React, { createContext, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState({});
  const [userActivities, setUserActivities] = useState({});

  const registerUser = (email, username, password) => {

    const params = {
      email: email,
      username: username,
      password: password
    };
    
    setIsLoading(true);

    axios.get(`${BASE_URL}/register-user.php`, { params })
      .then(res => {


        let userInfo = res.data;
        
        if(userInfo.status){
          alert('Registration is for approval. Please Contact Administrator.')
          // setUserInfo(userInfo);
          // AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
        }else{
          alert(userInfo.msg);
        }
        
        setIsLoading(false);

      })
      .catch(error => {

        setIsLoading(false);
        alert(error);


      });
  };

  const login = (username, password) => {

    const params = {
      username: username,
      password: password
    };
    
    setIsLoading(true);

    axios.get(`${BASE_URL}/login.php`, { params: params })
    .then(res => {

        let userInfo = res.data;
        if(userInfo.status){
    
          // console.log(userInfo)
          setUserInfo(userInfo);
          AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
          getTables();
        }else{
          alert(res.data.msg);
        }
        setIsLoading(false);

      })
      .catch(error => {

        setIsLoading(false);

        alert(error);


      });
  };

  const logout = () => {
    setUserInfo({});
    AsyncStorage.removeItem('userInfo')
  };

  const registerPlate = (fullname, plateNo, licenseNo, address, contactNo, rfid) => {

    const params = {
      fullname: fullname,
      plate_no: plateNo,
      license_no: licenseNo,
      address: address,
      contact_no: contactNo,
      rfid: rfid,
      created_by: userInfo.username
    };
    
    setIsLoading(true);

    axios.get(`${BASE_URL}/register-plate.php`, { params })
      .then(res => {
    
        alert(res.data.msg);
        setIsLoading(false);

      })
      .catch(error => {
        setIsLoading(false);
        alert(error);
      });
  };

  const getActivityLogs = () => {

    axios.get(`${BASE_URL}/activity-logs.php`)
      .then(res => {
        setActivityLogs(res.data)
      })
      .catch(error => {
        alert(error);
      });
  };

  const getUserActivities = () => {

    const params = {
      created_by: userInfo.username
    };
    axios.get(`${BASE_URL}/get-audit-trails.php`,{ params })
      .then(res => {
        setUserActivities(res.data)
      })
      .catch(error => {
        alert(error);
      });
  };
  const getRegisteredPlates = () => {

    axios.get(`${BASE_URL}/get-registered-plates.php`)
      .then(res => {
 
        setRegisteredPlates(res.data)
      })
      .catch(error => {
        alert(error);
      });
  };

  const getTables = () => {
      if(userInfo.username){
        getActivityLogs();
        getUserActivities();
        getRegisteredPlates();
        getUserList();
      }
  
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isLoading,
        userInfo,
        activityLogs,
        userActivities,
        registerUser,
        registerPlate,
        login,
        logout
      }}>{children}</AuthContext.Provider>
  );
};
