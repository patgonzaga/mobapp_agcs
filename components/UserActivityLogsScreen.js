
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text,FlatList, View, TextInput, ImageBackground  } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import { BASE_URL } from "../config";
import backgroundImage from '../assets/bg.jpg'; 

const UserActivityLogsScreen = () =>{

  const {isLoading, userInfo} = useContext(AuthContext);

  const [userActivities, setUserActivities] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getUserActivities();
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
    <ImageBackground source={backgroundImage} style={styles.background}>
    <Spinner visible={isLoading}/>
      <View style={styles.container}>
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
          ListEmptyComponent={() => <Text style={styles.noDataDisplay}>NO DATA FOUND</Text>}
        />
      </View>

  </ImageBackground>
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
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  textDisplay: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 8,
    marginBottom: 8,
    margin: 10,
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
    margin: 10,
    marginTop: 4,
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
    margin: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor:'#f9f9f9'
  },
  exportButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'yellowgreen',
    width: '15%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 10
  },
  noDataDisplay:{
    alignSelf: 'center'
  }

});
export default UserActivityLogsScreen;