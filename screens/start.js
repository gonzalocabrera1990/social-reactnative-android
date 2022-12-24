import React from 'react';
import { Dimensions, View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Stories from './stories';
import StartContent from './contentStart';
const { width } = Dimensions.get('window');
export const Start = ({ navigation }) => {
  return (
    <>
    
    <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.story}>
      <Stories navigation={navigation} style={styles.storys}/>
      </View>

      <View style={styles.start}>
        <StartContent navigation={navigation} />
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    
  },
  story: {
    height: 130,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    width
  },
  storys: {
    width
  },
  start: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
});
