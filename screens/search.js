import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../shared/baseurl';

export const Search = ({ navigation }) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [ID, setId] = useState('');

  useEffect(() => {
    async function saveId() {
      let idA = await AsyncStorage.getItem('id');
      setId(idA);
    }
    saveId();
  }, []);

  const handleSearch = async (e) => {
    setSearchLoading(true);
    if (!e) {
      setResults(null);
      setSearchLoading(false);
      return;
    }
    // const tok = await AsyncStorage.getItem('token');
    // const token = JSON.parse(tok);
    // const bearer = `Bearer ${token}`;
    // var config = {
    //   headers: { Authorization: bearer },
    // };
    return fetch(baseUrl + `search/search?q=${e}`)
      .then((data) => data.json())
      .then((json) => {
        setResults(json);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let mapSearch = !results ? (
    <>
      <Text style={styles.padding}> Resultados de busqueda.</Text>
    </>
  ) : (
    results.map((user) => {
      return (
        <View style={styles.commentsContent} key={user._id} >
          <TouchableOpacity
            style={styles.commentsContent}
            onPress={() =>
              navigation.navigate('Users', {
                localId: JSON.parse(ID),
                userId: user._id,
              })
            }>
            <Image
              style={styles.imgProfile}
              source={{ uri: `${baseUrl}${user.image.filename}` }}
            />
            <Text>
              <Text style={styles.author}>{user.firstname}</Text>
            </Text>
            <Text>
              <Text style={styles.author}>{user.lastname}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContent}>
        <TextInput
          style={styles.input}
          type="email"
          placeholder="User"
          onChangeText={(text) => handleSearch(text)}
        />
      </View>
      {searchLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View>{mapSearch}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  inputContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: 50,
  },
  input: {
    width: '98%',
    height: 50,
    borderColor: 'green',
    borderWidth: 3,
    borderRadius: 30,
    padding: 10,
  },
  activityIndicator: {
    marginTop: 15,
  },
  commentsContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    padding: 8,
  },
  imgProfile: {
    height: 30,
    width: 30,
    borderRadius: 50,
    marginRight: 15,
  },
  author: {
    fontSize: 14,
    marginRight: 10,
    color: 'black',
  },
});
