import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  
  ImageBackground
} from 'react-native';
import {  Button,TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import backgroundImage from '../assets/bg.jpg'; 

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { userInfo, updateProfile } = useContext(
    AuthContext
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const img = userInfo.img;

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const source = { uri: result.uri };
      setSelectedImage(source);
    }
  };

  const handleUploadImage = async () => {
    const formData = new FormData();

    if (selectedImage) {
      const { uri } = selectedImage;
      const name = uri.split('/').pop();
      const type = 'image/jpeg';

      formData.append('image', {
        uri,
        name,
        type
      });
    }

    formData.append('userId', userInfo.id);
    formData.append('username', username);
    formData.append('email', email);

    updateProfile(formData);
    // setSelectedImage(null);
    // navigation.navigate('User Information');
    // navigation.goBack();
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.row}>
        {selectedImage ? (
          <Image source={selectedImage} style={styles.avatar} />
        ) : (
          <>
            {img ? (
              <Image source={{ uri: img }} style={styles.avatar} />
            ) : (
              <Image
                source={require('../assets/user-avatar.png')}
                style={styles.avatar}
              />
            )}
          </>
        )}
        
        <Button mode="contained" style={styles.updateButton} onPress={handleSelectImage}>
        Edit Image
      </Button>
        </View>
    
   
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          onChangeText={text => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
      {/* {selectedImage && (
          <>
            <Button mode="contained" style={styles.updateButton} onPress={() => setSelectedImage(null)}>
            Cancel
      </Button>
          </>
        )} */}
        <Button mode="contained" style={styles.button} onPress={handleUploadImage}>
        Update
      </Button>
        {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}
        {uploadResult && (
          <Text style={styles.uploadResult}>
            Upload result: {uploadResult}
          </Text>
        )}
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center"
  },
  row:{
    flexDirection: 'row'
  },
  updateButton: {
    marginTop: 50,
    marginLeft: 20,
    width: '30%',
    height: 50,
    borderRadius: 15,
    backgroundColor: '#D21312',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 15,
    backgroundColor: '#018de5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginVertical: 10,
  },
  avatar: {
    width: 150,

      height: 150,
      borderRadius: 75,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "gray"
    },
  uploadResult: {
    marginTop: 20,
    color: 'green',
    fontSize: 16,
  },
});

export default EditProfileScreen;
