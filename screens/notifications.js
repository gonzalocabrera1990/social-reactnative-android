import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, Text, Image, Dimensions } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { fetchNotifications } from '../redux/ActionCreators';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import ItemNotifications from '../components/renderItemsNotifications';
import { baseUrl } from '../shared/baseurl';
const { width, height } = Dimensions.get('window');


const mapStateToProps = (state) => {
  return {
    notifications: state.notifications,
    auth: state.auth,
    user: state.user.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchNotifications: () => dispatch(fetchNotifications()),
});

const Notifications = ({
  route, 
  navigation,
  user,
  notifications,
  fetchNotifications,
}) => {
  const [index, setIndex] = useState(null);
  useEffect(() => {
    setIndex(notifications.results);
  }, [notifications]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIndex(null);
        fetchNotifications();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {!index || index.length === 0 ? (
         <>
         <View style={styles.imaginaContent}>
            <Image
              source={require('../shared/assets/images/noNotifications.png')}
              style={styles.imagina}
              resizeMode={'contain'} 
            />
             <Text style={styles.padding}> No notifications yet.</Text>
           </View>
         </>
      ) : (
        <FlatList
          data={index}
          renderItem={({ item }) => (
            <ItemNotifications item={item} navigation={navigation} localHost={user._id}/>
          )}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 15,
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  imgProfile: {
    height: 39,
    width: 39,
    borderRadius: 50,
    marginRight: 15,
  },
  likeButton: {
    width: 40,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  like: {
    backgroundColor: '#fff',
    color: '#fff',
    padding: 0,
    fontSize: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imaginaContent: {
    display: 'flex',
    alignItems: 'center',
    width, height: '100%',
    marginTop: 100
  },
  imagina: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width:180, height:180,
    borderRadius: 50
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
