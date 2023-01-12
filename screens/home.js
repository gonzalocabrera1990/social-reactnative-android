import React, { useEffect, createContext } from 'react';
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client";
import { fetchUser } from "../redux/ActionCreators";
import { baseUrl } from '../shared/baseurl';
import { SocketContext } from '../components/contextSocketIO';
const socket = io(baseUrl)


import MainStack from '../navigation/MainTabNavigator';
import HomeScreen from './login';

const mapDispatchToProps = dispatch => ({
  fetchUser: (id) => dispatch(fetchUser(id))
})

const Home = (props) => {

  useEffect(() => {
    async function payload() {
      const tok = await AsyncStorage.getItem('creds');
      const id = JSON.parse(tok);
      if (id) props.fetchUser(id.username);
    }
    payload()
  }, []);

  return (
    <NavigationContainer>
      <SocketContext.Provider value={{ socket }}>
        <MainStack />
      </SocketContext.Provider>
    </NavigationContainer>
  )
  // }
}
export default connect(null, mapDispatchToProps)(Home);