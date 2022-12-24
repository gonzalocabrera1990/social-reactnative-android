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

  useEffect( ()=>{
    async function payload(){
      let id = JSON.parse(await AsyncStorage.getItem("creds"))
      return id.username
    } 
    let an = payload();
    props.fetchUser(an)
  }, [])

        return (
        <NavigationContainer>
            <MainStack/>
        </NavigationContainer>
        )
   // }
}
export default connect(null, mapDispatchToProps)(Home);