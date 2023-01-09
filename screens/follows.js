import React, { useState, useEffect, useCallback } from 'react';
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

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { baseUrl } from '../shared/baseurl';

import { connect } from 'react-redux';
import { getFollows } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
  getFollows: (type, userId) => dispatch(getFollows(type, userId)),
});

const Follows = ({ navigation, route, getFollows }) => {
  const [searchLoading, setSearchLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [ID, setId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async function () {
      let idA = await AsyncStorage.getItem('id');
      setId(idA);
    })();
    getResultsFollow();
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setResults(null);
      };
    }, [])
  );

  const getResultsFollow = () => {
    getFollows(route.params.type, route.params.userId)
      .then((json) => {
        setResults(json);
        setSearchLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  };

  let mapFollow = !results ? (
    <>
      <Text style={styles.padding}> Sin usuarios</Text>
    </>
  ) : (
    results.map((user) => {
      return (
        <View style={styles.followsContent} key={user.id._id} >
          <TouchableOpacity
            style={styles.followsContent}
            onPress={() =>
              navigation.navigate('Users', {
                localId: JSON.parse(ID),
                userId: user.id._id,
              })
            }>
            <Image
              style={styles.imgProfile}
              source={{ uri: `${baseUrl}${user.id.image.filename}` }}
            />
            <Text>
              <Text style={styles.author}>{user.id.firstname}</Text>
            </Text>
            <Text>
              <Text style={styles.author}>{user.id.lastname}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    })
  );

  return (
    <View>
      <View style={styles.arrowBack}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={35}
          color={'green'}
          onPress={() => navigation.goBack()}
        />
      </View>
      {searchLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : (
        <View style={styles.followContainer} >{mapFollow}</View>
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
  arrowBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  activityIndicator: {
    marginTop: 15,
  },
  followContainer: {
    marginTop: 30,
  },
  followsContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
export default connect(null, mapDispatchToProps)(Follows);
