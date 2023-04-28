import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from "axios";
import { BASE_URL } from "../config";
import { AuthContext } from '../context/AuthContext';

const LogsScreen = () => {
  const { isLoading } = useContext(AuthContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getActivityLogs();
    const intervalId = setInterval(getActivityLogs, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getActivityLogs = () => {

    axios.get(`${BASE_URL}/activity-logs.php`)
      .then(res => {
        setActivityLogs(res.data)
      })
      .catch(error => {
        alert(error);
      });
  };

  useEffect(() => {
    setTableData([...activityLogs]);
  }, [activityLogs]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = activityLogs.filter(item =>
      item.fullname.toLowerCase().includes(text.toLowerCase()) ||
      item.plate_no.toLowerCase().includes(text.toLowerCase()) ||
      item.rfid.toLowerCase().includes(text.toLowerCase()) || 
      item.time_in.toLowerCase().includes(text.toLowerCase())  
    );
    setTableData(filteredData);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fullname}</Text>
      <Text style={styles.cell}>{item.plate_no}</Text>
      <Text style={styles.cell}>{item.rfid}</Text>
      <Text style={styles.cell}>{item.time_in}</Text>
    </View>
  );

  return (
    <View>
    <Spinner visible={isLoading}/>
      <View style={styles.container1}>
          <Text style={styles.textDisplay}>
           List of Activities</Text> 
      </View>
      <View style={styles.container2}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TableHeader />
        <FlatList data={tableData} renderItem={renderItem} style={styles.table} />
      </View>

  </View>
  );
}
const TableHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, styles.module]}>Fullname</Text>
      <Text style={[styles.headerText, styles.action]}>Plate No.</Text>
      <Text style={[styles.headerText, styles.action]}>RFID</Text>
      <Text style={[styles.headerText, styles.action]}>Time In</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    backgroundColor: '#fff',
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: 'lightgray',
    width: '100%',
    height: '80%'
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
  }
});

export default LogsScreen;