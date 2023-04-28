import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text,FlatList, View, TextInput, TouchableOpacity,ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import axios from "axios";
import backgroundImage from '../../assets/bg.jpg'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserListScreen = () => {
  const { isLoading } = useContext(AuthContext);
  const [userList, setUserList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {

    axios.get(`${BASE_URL}/get-user-list.php`)
      .then(res => {
        setUserList(res.data)
      })
      .catch(error => {
        alert(error);
      });
  };

  useEffect(() => {
    setTableData([...userList]);
  }, [userList]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.username}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleUserAction('active',item.id)}
          >
            <Icon name="check-bold" size={20} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleUserAction('rejected',item.id)}
          >
            <Icon name="close-thick" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
            {item.status === 'rejected' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleUserAction('active',item.id)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
         {item.status === 'active' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleUserAction('inactive',item.id)}
          >
            <Icon name="power" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
           {item.status === 'inactive' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleUserAction('active',item.id)}
          >
            <Icon name="power" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = userList.filter(
      (item) =>
        item.username.toLowerCase().includes(text.toLowerCase()) ||
        item.email.toLowerCase().includes(text.toLowerCase()) ||
        item.status.toLowerCase().includes(text.toLowerCase())
    );
    setTableData(filteredData);
  };

  const handleUserAction = async (status,userId) => {

    try {

      axios.get(`${BASE_URL}/user-action.php?id=${userId}&status=${status}`)
      .then(res => {
        setUserList(res.data)
      })
      .catch(error => {
        alert(error);
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <Spinner visible={isLoading} />
    
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TableHeader />
        <FlatList data={tableData} renderItem={renderItem} style={styles.table} />
    </ImageBackground>
  );
};

const TableHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, styles.module]}>Username</Text>
      <Text style={[styles.headerText, styles.action]}>Email</Text>
      <Text style={[styles.headerText, styles.action]}>Status</Text>
      <Text style={[styles.headerText, styles.action]}>Actions</Text>
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
  actionButtons: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginEnd: 8,
    height: 25,
    width:25,
    backgroundColor: '#018de5',
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
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

});
export default UserListScreen;