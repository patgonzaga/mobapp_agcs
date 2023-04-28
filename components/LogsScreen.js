import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, TextInput, TouchableOpacity ,ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BASE_URL } from "../config";
import { AuthContext } from '../context/AuthContext';
import backgroundImage from '../assets/bg.jpg'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

const LogsScreen = () => {
  const { isLoading } = useContext(AuthContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('Search');
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;

    let year = currentDate.getFullYear(); // get the year (yyyy)
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // get the month (mm) and pad with leading zero if necessary
    let day = String(currentDate.getDate()).padStart(2, '0'); // get the day (dd) and pad with leading zero if necessary
    let dateStr = year + '-' + month + '-' + day;
    
    setDate(currentDate);
    setSearchText(dateStr);
    handleSearch(dateStr);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  useEffect(() => {
    getActivityLogs();
    // const intervalId = setInterval(getActivityLogs, 5000);
    // return () => clearInterval(intervalId);
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

  const exportCsv = async (tableData) => {
    const headers = ['Fullname', 'Plate No.', 'RFID', 'Time In'];
    const csvRows = [];
  
    // Add headers to CSV rows
    csvRows.push(headers.join(','));
  
    // Add data rows to CSV
    tableData.forEach((item) => {
      const rowData = [
        `"${item.fullname}"`,
        `"${item.plate_no}"`,
        `"rfid:(${item.rfid})"`,
        `"${item.time_in}"`
      ];
      csvRows.push(rowData.join(','));
    });
  
    // Combine all rows into a single CSV string
    const csvString = csvRows.join('\n');
  
    try {
      const fileUri = FileSystem.documentDirectory + 'Activity Logs.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export activity logs', UTI: 'public.comma-separated-values-text' });
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleExport = async () => {
    try {
      const csvData = exportCsv(tableData);
      const fileUri = FileSystem.documentDirectory + 'ActivityLogs.csv';
      await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export activity logs' });
    } catch (error) {
      console.error(error);
    }
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
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading}/>
           <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Icon name="file-export" size={25} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.searchBox}>
            {searchText}
          </Text>
          </TouchableOpacity>
   
        <TableHeader />

        <FlatList data={tableData} renderItem={renderItem} style={styles.table}  ListEmptyComponent={() => <Text style={styles.noDataDisplay}>NO DATA FOUND</Text>}/>
      </ImageBackground>
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

export default LogsScreen;