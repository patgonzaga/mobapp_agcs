
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text,FlatList, View, TextInput, Image  } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { BASE_URL } from "../config";

const ProfileScreen = () =>{

  const {isLoading, userInfo} = useContext(AuthContext);

  const [userActivities, setUserActivities] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getUserActivities();
    const intervalId = setInterval(getUserActivities, 5000);
    return () => clearInterval(intervalId);
  }, []);

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

  useEffect(() => {
    setTableData([...userActivities]);
  }, [userActivities]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.module}</Text>
      <Text style={styles.cell}>{item.action}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
    </View>
  );
  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = userActivities.filter(item =>
      item.module.toLowerCase().includes(text.toLowerCase()) ||
      item.action.toLowerCase().includes(text.toLowerCase()) ||
      item.created_at.toLowerCase().includes(text.toLowerCase())
    );
    setTableData(filteredData);
  }
  return (
    <View>
    <Spinner visible={isLoading}/>
      <View style={styles.container1}>
      {userInfo.is_admin ?   
        <Image
            source={require('../assets/admin-avatar.png')}
            style={styles.avatar}
          />:      
        <Image
            source={require('../assets/user-avatar.png')}
            style={styles.avatar}
          />
        }
          <Text style={styles.textDisplay}
            >Username : {userInfo.username}</Text> 
          <Text style={styles.textDisplay}
            >Email : {userInfo.email}</Text> 
      </View>
      <View style={styles.container2}>
      <Text style={styles.tableName}
            >User Activity Lists</Text> 
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TableHeader />
        <FlatList
          data={tableData}
          renderItem={renderItem}
          style={styles.table}
        />
      </View>

  </View>
  );
}
const TableHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, styles.module]}>Module</Text>
      <Text style={[styles.headerText, styles.action]}>Action</Text>
      <Text style={[styles.headerText, styles.action]}>Date & Time</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    backgroundColor: '#fff',
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '70%',
    marginTop: 10
  },
  textDisplay: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  tableName: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10,
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
    backgroundColor: '#f9f9f9',
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
    margin: 16,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
});
export default ProfileScreen;