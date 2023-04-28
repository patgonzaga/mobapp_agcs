import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, TextInput ,TouchableOpacity,ImageBackground} from 'react-native';
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from "axios";
import { BASE_URL } from "../config";
import { AuthContext } from '../context/AuthContext';
import ModalView from './modals/ModalView';
import backgroundImage from '../assets/bg.jpg'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RfidScreen = () => {
  const {isLoading, userInfo} = useContext(AuthContext);
  const [title, setTitle] = useState('Add RFID');
  const [submitText, setSubmitText] = useState('Add');
  const [rfidList, setRfidList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [visible, setVisible] = useState(false);
  const [rfidId, setRfidId] = useState(0);
  const [rfid, setRfid] = useState('');

  useEffect(() => {
    getRfidList();
    const intervalId = setInterval(getRfidList, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getRfidList = () => {
    axios.get(`${BASE_URL}/get-rfid.php`)
      .then(res => {
        setRfidList(res.data);
      })
      .catch(error => {
        alert(error);
      });
  };

  useEffect(() => {
    setTableData([...rfidList]);
  }, [rfidList]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = rfidList.filter(item =>
      item.rfid.toLowerCase().includes(text.toLowerCase()) ||
      item.created_by.toLowerCase().includes(text.toLowerCase()) ||
      item.created_at.toLowerCase().includes(text.toLowerCase()) ||
      item.updated_at.toLowerCase().includes(text.toLowerCase()) 
    );
    setTableData(filteredData);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View>
          <Text style={styles.plate_no}>{item.rfid}</Text>
          <Text>Added by: {item.created_by}</Text>
          <Text>Date Updated: {item.updated_at}</Text>
        </View>
        <View style={styles.rowView}>
          <Button
            onPress={() => edit(item.id, item.rfid)}
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
  const addRfid = (rfid) => {
    const params = {
      rfid: rfid,
      action: 'add',
      created_by: userInfo.username ?? 'unknown'
    };
    
    console.log(params)

    axios.get(`${BASE_URL}/rfid.php`, { params })
      .then(res => {
    
        alert(res.data.msg);
        if(res.data.status){
          setVisible(false)
          getRfidList()
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  const edit = (id, rfid) => {
    setSubmitText('Update')
    setTitle('Edit RFID')
    setVisible(true)
    setRfidId(id)
    setRfid(rfid)
  }


  const editRfid = (id, rfid) => {
    const params = {
      id:id,
      rfid: rfid,
      action: 'update',
      created_by: userInfo.username ?? 'ss'
    };
    
    console.log(params)
    axios.get(`${BASE_URL}/rfid.php`, { params })
      .then(res => {
    
        alert(res.data.msg);
        if(res.data.status){
          setVisible(false)
          setRfid('')
          getRfidList()
        }
      })
      .catch(error => {
        alert(error);
      });
  }


  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <Spinner visible={isLoading}/>
           <TouchableOpacity style={styles.addButton} onPress={() => {
            setTitle('Add RFID')
            setSubmitText('Add')
            setRfid('')
            setRfidId('')
            setVisible(true)
        }}>
           <Icon name="plus" size={25} color={'#fff'} />
        </TouchableOpacity>
      
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
        title={title}
        submitText = {submitText}
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (rfidId && rfid) {
            editRfid(rfidId, rfid)
          } else {
            addRfid(rfid)
          }
        }}
        cancelable
      >
        <Text
        style={styles.modalLabel}
        >RFID:</Text>
        <TextInput
        style={styles.modalTextInput}
          label="RFID"
          value={rfid}
          onChangeText={(text) => setRfid(text)}
          placeholder="Enter RFID"
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
    marginTop: 20,
    paddingHorizontal: 8,
    backgroundColor:'#f9f9f9'
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'yellowgreen',
  },
  buttonText: {
    color: 'white'
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'yellowgreen',
    width: '15%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10
  },
});
export default RfidScreen;