import React from 'react';
//import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { NavigationContainer, createSwitchNavigator, createAppContainer } from '@react-navigation/native'


import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  Main: MainTabNavigator
}));