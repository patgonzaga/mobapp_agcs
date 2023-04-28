import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text,FlatList, View, TextInput, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import axios from "axios";

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
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleUserAction('rejected',item.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
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
            <Text style={styles.buttonText}>Deactivate</Text>
          </TouchableOpacity>
        </View>
      )}
           {item.status === 'inactive' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleUserAction('active',item.id)}
          >
            <Text style={styles.buttonText}>Activate</Text>
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
    <View>
      <Spinner visible={isLoading} />
      <View style={styles.container1}>
        <Text style={styles.textDisplay}>List of Registered Plates</Text>
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
  },
  actionButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginEnd: 8,
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