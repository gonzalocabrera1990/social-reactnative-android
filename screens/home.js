import React , { useEffect } from 'react';
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUser } from "../redux/ActionCreators";


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
      if(id) props.fetchUser(id.username);
    }
    payload()
  }, []);

        return (
        <NavigationContainer>
            <MainStack/>
        </NavigationContainer>
        )
   // }
}
export default connect(null, mapDispatchToProps)(Home);