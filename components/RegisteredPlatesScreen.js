import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, TextInput ,TouchableOpacity, ImageBackground} from 'react-native';
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from "axios";
import { BASE_URL } from "../config";
import { AuthContext } from '../context/AuthContext';
import ModalView from './modals/ModalView';
import backgroundImage from '../assets/bg.jpg'; 

const RegisteredPlatesScreen = () => {
  const { isLoading, userInfo} = useContext(AuthContext);
  const [registeredPlates, setRegisteredPlates] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [visible, setVisible] = useState(false);
  const [plateId, setPlateId] = useState(0);
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [rfid, setRfid] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getRegisteredPlates();
    const intervalId = setInterval(getRegisteredPlates, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getRegisteredPlates = () => {
    axios.get(`${BASE_URL}/get-registered-plates.php`)
      .then(res => {
        setRegisteredPlates(res.data);
      })
      .catch(error => {
        alert(error);
      });
  };

  useEffect(() => {
    setTableData([...registeredPlates]);
    axios.get(`${BASE_URL}/get-rfid.php`)
    .then(response => {
      setOptions(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, [registeredPlates]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = registeredPlates.filter(item =>
      item.fullname.toLowerCase().includes(text.toLowerCase()) ||
      item.plate_no.toLowerCase().includes(text.toLowerCase()) ||
      item.license_no.toLowerCase().includes(text.toLowerCase()) ||
      item.address.toLowerCase().includes(text.toLowerCase()) ||
      item.contact_no.toLowerCase().includes(text.toLowerCase()) ||
      item.rfid.toLowerCase().includes(text.toLowerCase()) ||
      item.created_by.toLowerCase().includes(text.toLowerCase()) ||
      item.created_at.toLowerCase().includes(text.toLowerCase())
    );
    setTableData(filteredData);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View>
          <Text style={styles.plate_no}>{item.plate_no}</Text>
          <Text>Fullname: {item.fullname}</Text>
          <Text>Contact No: {item.contact_no}</Text>
          <Text>RFID: {item.rfid}</Text>
          <Text>License No: {item.license_no}</Text>
          <Text>Address: {item.address}</Text>
          <Text>Added by: {item.created_by}</Text>
          <Text>Date Added/Updated: {item.created_at}</Text>
        </View>
        <View style={styles.rowView}>
          <Button
            onPress={() => edit(item.id, item.fullname, item.contact_no, item.rfid, item.plate_no, item.address, item.license_no)}
            icon="edit"
            style={{ marginHorizontal: 16 }} />
        </View>
      </View>
    </Card>
  );

  const Button = ({ onPress, style, icon }) => (
    <TouchableOpacity style={style} onPress={onPress}>
      <Feather name={icon} size={24} />
    </TouchableOpacity>
  )
  const edit = (id, fullname, contact_no, rfid, plate_no, address, license_no) => {
    setVisible(true)
    setPlateId(id)
    setFullname(fullname)
    setAddress(address)
    setContactNo(contact_no)
    setRfid(rfid)
    setPlateNo(plate_no)
    setLicenseNo(license_no)
  }

  const editPost = (id, fullname, contactNo, rfid, plateNo, address, licenseNo) => {
    const params = {
      id:id,
      fullname: fullname,
      plate_no: plateNo,
      license_no: licenseNo,
      address: address,
      contact_no: contactNo,
      rfid: rfid,
      created_by: userInfo.username ?? 'unknown'
    };
    
    axios.get(`${BASE_URL}/update-registered-plate.php`, { params })
      .then(res => {
    
        alert(res.data.msg);
        if(res.data.status){
          setVisible(false)
          getRegisteredPlates()
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <Spinner visible={isLoading}/>
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />
        <FlatList
          data={tableData}
          renderItem={renderItem}
          style={styles.table}
        />
      <ModalView
        visible={visible}
        title="Edit Registered Plate"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (plateId) {
            editPost(plateId, fullname, contactNo, rfid, plateNo, address, licenseNo)
          } 
        }}
        cancelable
      >
        <Text
        style={styles.modalLabel}
        >Fullname:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="Fullname"
          value={fullname}
          onChangeText={(text) => setFullname(text)}
          placeholder="Enter fullname"
          placeholderTextColor="#003f5c"
          mode="outlined"
        />

        <Text>Address:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
           placeholder="Enter address"
          placeholderTextColor="#003f5c"
          mode="outlined"
        />
        <Text>Contact Number:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="Contact No."
          value={contactNo}
          onChangeText={(text) => setContactNo(text)}
           placeholder="Enter contact no."
          placeholderTextColor="#003f5c"
          mode="outlined"
        />   
 
       <Text>RFID:</Text>
         <Picker
         style={styles.pickerView}
          selectedValue={rfid}
          onValueChange={itemValue => setRfid(itemValue)}
          placeholder="Enter RFID"
          mode='dropdown'
        >
        {options.map(option => (
          <Picker.Item key={option.id} label={option.rfid} value={option.rfid} />
        ))}
      </Picker>
      <Text>Plate number:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="Plate No."
          value={plateNo}
          onChangeText={(text) => setPlateNo(text)}
           placeholder="Enter plate no."
          placeholderTextColor="#003f5c"
          mode="outlined"
        />   
        <Text>License number:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="License No."
          value={licenseNo}
          onChangeText={(text) => setLicenseNo(text)}
           placeholder="Enter license no."
          placeholderTextColor="#003f5c"
          mode="outlined"
        />   
      </ModalView>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  textDisplay: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  tableName: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 8,
    marginBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  module: {
    flex: 1,
  },
  action: {
    flex: 1,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    marginEnd: 10
  },
  table: {
    borderRadius: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  editButton: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  searchBox: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    paddingHorizontal: 8,
    backgroundColor:'#f9f9f9'
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight:'8%'
  },
  item: {
    padding: 16,
    margin: 16,
    elevation: 4,
    borderRadius: 8
  },
  plate_no: {
    fontSize: 18,
  },
  modalTextInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalLabel: {
    marginTop: 16
  },
  pickerView: {
    backgroundColor: "#ededed",
    borderRadius: 30,
    height: 30,
    marginBottom: 10,
    alignItems: "center",
  },
});
export default RegisteredPlatesScreen;