import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Button,
} from 'react-native';
import { commentsPost } from '../redux/ActionCreators';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

//import { useFocusEffect } from '@react-navigation/native';
import WallImageItem from '../components/WallImageItem';

//import Imagine from 'react-native-scalable-image';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import RenderItem from '../components/renderItemsImgWall';
import RenderItemVid from '../components/renderItemsVidWall';

import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    users: state.users.users,
  };
};
const mapDispatchToProps = (dispatch) => ({
  commentsPost: (dataComment) => dispatch(commentsPost(dataComment)),
});

const ImageWall = ({ route, navigation, user, users, commentsPost }) => {
  const [userState, setUserState] = useState(null);
  const [index, setIndex] = useState(null);
  const [userpage, setUserpage] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [isLodaing, setIsloading] = useState(true);
  const [ID, setId] = useState('');

  useEffect(() => {
    let usuario = !route.params.info ? null : route.params.info;
    
    let images = route.params.mediaType === 'photo' ? 
    usuario.imagesWall : route.params.mediaType === 'video' ? 
    usuario.videosWall : null;
    let indexImg = !images
      ? null
      : images.findIndex((i) => i._id === route.params.itemId);
    setIndex(indexImg);

    setUserState(user);
    setUserpage(route.params.info);
    setIsloading(false);

    async function saveId() {
      let idA = await AsyncStorage.getItem('id');
      setId(idA);
    }

    saveId();
  }, [user, users, route.params]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        setUserState(null);
        setIndex(null);
        setUserpage(null);
        setIsloading(true);
        setId('');
      };
    }, [])
  );

  const handleCommentSubmit = (value, imgID, cb) => {
    const comment = {
      comment: value,
      author: JSON.parse(ID),
      image: imgID,
    };
    commentsPost(comment).then(() => {
      cb(imgID);
    });
  };

  const getItemLayout = (data, index) => ({
    length: 350,
    offset: 350 * index,
    index,
  });
  const ref = useRef(null);
  if (isLodaing || index < 0) {
    return (
      <View>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {route.params.mediaType === 'photo' && index !== -1 ? (
          <FlatList
            ref={ref}
            initialScrollIndex={index}
            data={userpage.imagesWall}
            renderItem={({ item }) => (
              <RenderItem
                item={item}
                idUser={ID}
                navigation={navigation}
                userpage={userpage}
                handleLike={route.params.handleLike}
                handleCommentSubmit={handleCommentSubmit}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : route.params.mediaType === 'video' && index !== -1 ? (
          <FlatList
            ref={ref}
            initialScrollIndex={index}
            data={userpage.videosWall}
            renderItem={({ item }) => (
              <RenderItemVid
                item={item}
                idUser={ID}
                navigation={navigation}
                userpage={userpage}
                handleLike={route.params.handleLike}
                handleCommentSubmit={handleCommentSubmit}
              />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  containerElement: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  imgWall: {
    width: 118,
    height: 120,
  },
  padding: {
    padding: 8,
  },
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
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  contentContainer: {
    paddingTop: 30,
    margin: 30,
  },
  imgContent: {
    flex: 3,
    marginBottom: 25,
  },
  imageContent: {
    flex: 1,
  },
  img: {
    height: 80,
    // width: 360,
    // height: 210
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'space-between',
  },
  imgProfile: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "black",
    //     shadowOffset: { height: -3 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 3,
    //   },
    //   android: {
    //     elevation: 20,
    //   },
    // }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
});

//export default ImageWall;
export default connect(mapStateToProps, mapDispatchToProps)(ImageWall);