import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchUser,
  logoutUser,
  fetchStart,
  fetchNotifications,
  fetchFollowers,
  fetchFollowing,
} from '../redux/ActionCreators';

import MainStack from '../navigation/MainTabNavigator';
import HomeScreen from './login';

const mapDispatchToProps = (dispatch) => ({
  //   logoutUser: () => dispatch(logoutUser()),
  //   fetchStart: () => dispatch(fetchStart()),
  //   //fetchNotifications: () => dispatch(fetchNotifications()),
  //   fetchFollowers: () => dispatch(fetchFollowers()),
  fetchUser: (id) => dispatch(fetchUser(id)),
});

const Home = (props) => {
  useEffect(() => {
    async function payload() {
      const tok = await AsyncStorage.getItem('creds');
      const id = JSON.parse(tok);
      if(id) props.fetchUser(id.username);
    }
    payload()
  }, []);

  // <Button color='green' title="logout" onPress={()=>map(props.auth)} />
  // <Button color='green' title="logout" onPress={()=>map(props.auth)} />
  // <Button color='green' title="logout" onPress={()=>map(props.auth)} />
  // let a = props.auth.isAuthenticated
  // if (!a) {
  //     return (
  //         <HomeScreen/>
  //     )
  // } else {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
  // }
};
export default connect(null, mapDispatchToProps)(Home);
