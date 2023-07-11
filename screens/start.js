import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions, View, Text,
  ScrollView, StyleSheet, RefreshControl,
  StatusBar, Image, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import {
  fetchStart,
  postImageLike,
  postVideoLike,
  commentsPost,
} from '../redux/ActionCreators';
import Constants from 'expo-constants';
import Stories from './stories';
import StartContent from './contentStart';
const { width, height } = Dimensions.get('window');

const mapStateToProps = (state) => {
  return {
    start: state.start.start
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchStart: () => dispatch(fetchStart())
});
export const Start = ({ navigation, start, fetchStart }) => {
  const [content, setContent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [colors, setColors] = useState(['white', 'yellow', 'grey']);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStart();
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  }, []);
  useEffect(() => {
    fetchStart();
  }, []);
  useEffect(() => {
    if(start) setContent(start);
  }, [start]);
  
  if (!content) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size={80} color="grey" />
      </View>
    );
  } else if (content.length === 0) {
    return (
      <View style={styles.imagina}>
          <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      
        <Image
          //src={NoContent}
          source={require('../shared/assets/images/start.png')}
          style={{width}}
        />
        <Text style={styles.description} >Follow other users and see their content here.</Text>
      </View>
    )
  } else {
  return (
    <>
    
    <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
    <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
              colors={colors} progressBackgroundColor={'#4CAF50'} 
              progressViewOffset={100}
            />
          }
        >
      <View style={styles.story}>
      <Stories navigation={navigation} style={styles.storys}/>
      </View>

      <View style={styles.start}>
        <StartContent navigation={navigation} />
      </View>
    </ScrollView>
    </>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    
  },
  story: {
    height: 115,
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
  imagina: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width, height,
    backgroundColor: '#d7f8c8'
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width, height,
    paddingBottom: 80,
    backgroundColor: '#d7f8c8'
  },
  description:{
    fontSize: 18
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Start);