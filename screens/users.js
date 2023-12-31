import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';

import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';
import {
  fetchDataUser,
  followFetch,
  fetchFollowers,
  fetchFollowing,
} from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user,
    users: state.users,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchDataUser: (url) => dispatch(fetchDataUser(url)),
  followFetch: (followingId, followerId) => dispatch(followFetch(followingId, followerId)),

});

const Users = (props) => {
  const [userpage, setUserpage] = useState(null);
  const [info, setInfo] = useState(null);
  const [toogleTab, seToogleTab] = useState('photo');

  useEffect(() => {
    setInfo(null);
    let ID = {
      host: props.route.params.localId,
      user: props.route.params.userId,
    };

    if (props.route.params.userId == props.route.params.localId) {
      props.navigation.navigate('Profile');
      return;
    }
    setInfo(ID);
    // let currentUser = !props.user.user ? null : props.user.user.usuario
    // if (ID.user === currentUser) {
    //     navigation.navigate('Users')
    //     return
    // //   }

    // return function(){
    //   setUserpage(null);
    //   setInfo(null)
    //   // props.navigation.setParams({localId: null, userId: null})

    // }
  }, [props.route.params.localId, props.route.params.userId]);
  useEffect(() => {
    if (info) props.fetchDataUser(info);
  }, [info]);
  useEffect(() => {
    setUserpage(props.users.users);
  }, [props.users]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        seToogleTab('photo');
      };
    }, [])
  );
  const handleFollow = (followerId) => {
    const followingId = props.route.params.localId;
    const userData = followerId;
    props.followFetch(followingId, userData).then((resp) => {
      if (info) props.fetchDataUser(info);
    });
  };

  const toogleMedia = (value) => {
    if (toogleTab !== value) seToogleTab(value);
  };
  const measure = (timestamp) => {
    let inicio = new Date(timestamp).getTime();
    let now = Date.now();
    let res = now - inicio;
    const hours = (Math.floor((res) / 1000)) / 3600;
    return hours;
  }
  const storiesNoSeen = !props.users.users ? false : props.users.users.stories.some(h => measure(h.timestamp) <= 24000 && !h.views.some(v => v === props.user.user._id))
  const storiesSeen = !props.users.users ? false : props.users.users.stories.some(h => measure(h.timestamp) <= 24000 && h.views.some(v => v === props.user.user._id))

  let userArray = [userpage];
  const UserS = !userpage
    ? null
    : !userArray[0].message
      ? userArray.map((u) => {
        const foll = u.followers.some((foll) =>
          foll.id._id === props.route.params.localId ? true : false
        );
        const noti = u.notifications.some((noti) =>
          noti.followingId === props.route.params.localId ? true : false
        );

        const photosWall = u.imagesWall.map((img) => {
          return (
            <View key={img._id} style={styles.imgWall}>
              <TouchableHighlight
                onPress={() =>
                  props.navigation.navigate('Users', {
                    screen: "ImageWall",
                    params: {
                      itemId: img._id,
                      info: u,
                      mediaType: 'photo'
                    }
                  })
                }>
                <Image
                  style={styles.imgWall}
                  source={{ uri: `${baseUrl}${img.filename}` }}
                />
              </TouchableHighlight>
            </View>
          );
        });
        const videosWall = u.videosWall.map((img) => {
          return (
            <View key={img._id} style={styles.imgWall}>
              <TouchableHighlight
                onPress={() =>
                  props.navigation.navigate('Users', {
                    screen: "ImageWall",
                    params: {
                      itemId: img._id,
                      info: u,
                      mediaType: 'video'
                    }
                  })
                }>
                <Video
                  source={{ uri: `${baseUrl}${img.filename}` }}
                  key={img._id}
                  resizeMode="cover"
                  style={{
                    aspectRatio: 1,
                    width: '100%',
                  }}
                />
              </TouchableHighlight>
            </View>
          );
        });

        return (
          <View key={u._id}>
            <View style={styles.user}>

              {storiesNoSeen ?
                <TouchableHighlight onPress={() =>
                  props.navigation.navigate('StoriesPlayUser', {
                    userId: u._id,
                    storyId: u.stories[0]._id,
                    host: props.route.params.localId,
                    user: props.route.params.userId
                  })
                } >
                  <View style={styles.imgProfileNoSeen}>
                    <Image
                      style={styles.imgProfile}
                      source={{ uri: `${baseUrl}${u.image.filename}` }}
                    />
                  </View>
                </TouchableHighlight>
                : storiesSeen ?
                  <TouchableHighlight onPress={() =>
                    props.navigation.navigate('StoriesPlayUser', {
                      userId: u._id,
                      storyId: u.stories[0]._id,
                      host: props.route.params.localId,
                      user: props.route.params.userId
                    })
                  }>
                    <View style={styles.imgProfileSeen}>
                      <Image
                        style={styles.imgProfile}
                        source={{ uri: `${baseUrl}${u.image.filename}` }}
                      />
                    </View>
                  </TouchableHighlight>
                  :
                  <View style={styles.imgProfileStandar}>
                    <Image
                      style={styles.imgProfile}
                      source={{ uri: `${baseUrl}${u.image.filename}` }}
                    />
                  </View>
              }
              <View style={styles.userInfo}>
                <Text>
                  {u.firstname} {u.lastname}
                </Text>
                <Text>{u.phrase}</Text>
                <View style={styles.follows}>
                  <TouchableHighlight
                    onPress={() => props.navigation.navigate('Follows', {
                      type: 'followers',
                      userId: u._id
                    })}>
                    <Text>Followers {u.followers.length}</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => props.navigation.navigate('Follows', {
                      type: 'following',
                      userId: u._id
                    })}>
                    <Text>Following {u.following.length}</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.buttonItems}>
                  {noti === true ? (
                    <View
                      style={styles.followContainer}
                    >
                      <MaterialCommunityIcons
                        style={styles.follow}
                        name="timer-sand"
                        size={24}
                        color="black"
                      />
                    </View>
                  ) : foll === false ? (
                    <TouchableHighlight
                      onPress={() => handleFollow(u._id)}
                      style={styles.followContainer}
                    >
                      <MaterialIcons
                        style={styles.follow}
                        name="person-add-alt-1"
                        size={24}
                        color="black"
                      />
                    </TouchableHighlight>
                  ) : (
                    <View
                      style={styles.followContainer}>
                      <MaterialIcons
                        style={styles.follow}
                        name="check"
                        size={24}
                        color="black"
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.buttonContent}>
              <View style={styles.buttonItems}>
                <MaterialIcons.Button
                  style={[styles.tab, styles.tabImage]}
                  name="photo"
                  size={24}
                  color="black"
                  onPress={() => toogleMedia('photo')}
                />
              </View>
              <View style={styles.buttonItems}>
                <MaterialCommunityIcons.Button
                  style={[styles.tab, styles.tabVideo]}
                  name="movie-open"
                  size={24}
                  color="black"
                  onPress={() => toogleMedia('video')}
                />
              </View>
            </View>

            <View style={styles.imageWallContent}>
              {toogleTab === 'photo' ? photosWall : videosWall}
            </View>
          </View>
        );
      })
      : userArray.map((u) => {
        const foll = u.followers.some((foll) =>
          foll.id._id === props.route.params.localId ? true : false
        );
        const noti = u.notifications.some((noti) =>
          noti.followingId === props.route.params.localId ? true : false
        );
        return (
          <View key={u._id}>
            <View style={styles.user}>
              <View style={styles.imgProfileStandar}>
                <Image
                  style={styles.imgProfile}
                  source={{ uri: `${baseUrl}${u.image.filename}` }}
                />
              </View>
              <View style={styles.userInfo}>
                <Text>
                  {u.firstname} {u.lastname}
                </Text>
                <Text>{u.phrase}</Text>
                <Text>
                  Followers {u.followers.length} Following {u.following.length}
                </Text>
                <View style={styles.buttonItems}>
                  {noti === true ? (
                    <MaterialCommunityIcons
                      style={styles.follow}
                      name="timer-sand"
                      size={24}
                      color="black"
                    />
                  ) : foll === false ? (
                    <TouchableHighlight onPress={() => handleFollow(u._id)} >
                      <MaterialIcons
                        style={styles.follow}
                        name="person-add-alt-1"
                        size={24}
                        color="black"
                      />
                    </TouchableHighlight>
                  ) : (
                    <MaterialIcons
                      style={styles.follow}
                      name="check"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
              </View>
            </View>

            <View style={styles.buttonContent}>
              <View style={styles.buttonItems}>
                <MaterialIcons.Button
                  style={[styles.tab, styles.tabImage]}
                  name="photo"
                  size={24}
                  color="black"
                />
              </View>
              <View style={styles.buttonItems}>
                <MaterialCommunityIcons.Button
                  style={[styles.tab, styles.tabVideo]}
                  name="movie-open"
                  size={24}
                  color="black"
                />
              </View>
            </View>

            <Text style={styles.imageWallContent}>{u.message}</Text>
          </View>
        );
      });
  return <ScrollView style={styles.container}>{UserS}</ScrollView>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 10,
  },
  imgProfile: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  imgProfileNoSeen: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: '#4CAF50',
    borderStyle: 'solid',
    borderWidth: 5
  },
  imgProfileSeen: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: '#cbc9df',
    borderStyle: 'solid',
    borderWidth: 5
  },
  imgProfileStandar: {
    height: 100,
    width: 100
  },
  userInfo: {
    paddingTop: 30,
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followContainer: {
    width: 100,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#288818',
  },

  follow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#288818',
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  buttonItems: {
    height: 40,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  tab: {
    width: 155,
    height: 35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#fff',
    borderBottomColor: '#aaa',
    borderWidth: 1,
  },
  tabImage: {
    borderRightColor: '#aaa',
  },
  tabVideo: {
    borderLeftColor: '#aaa',
  },
  imageWallContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 'auto',
    width: Dimensions.get('window').width
  },
  imgWall: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
  },
  vidWall: {
    width: 105,
    height: 105,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Users);
// const enteringAnimation = new Keyframe({
  //   0: {
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'dotted',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'dotted',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'dotted',
  //     borderTopColor: '#4CAF50',
  //     borderTopColor: 5,
  //     borderStyle: 'dotted',
  //       transform: [{rotate: '0deg'}],
  //   },
  //   15:{
  //       borderRightColor: '#4CAF50',
  //       borderRightColor: 5,
  //       borderStyle: 'dotted'
  //   },
  //   30:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'dotted',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'dotted'
  //   },
  //   45:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'dashed',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'dotted',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'dotted'
  //   },
  //   60:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'dashed',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'dashed',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'dotted',
  //     borderTopColor: '#4CAF50',
  //     borderTopColor: 5,
  //     borderStyle: 'dotted'
  //   },
  //   75:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'solid',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'dashed',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'dashed',
  //     borderTopColor: '#4CAF50',
  //     borderTopColor: 5,
  //     borderStyle: 'dotted'
  //   },
  //   85:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'solid',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'solid',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'dashed',
  //     borderTopColor: '#4CAF50',
  //     borderTopColor: 5,
  //     borderStyle: 'dashed'
  //   },
  //   100:{
  //     borderRightColor: '#4CAF50',
  //     borderRightColor: 5,
  //     borderStyle: 'solid',
  //     borderBottomColor: '#4CAF50',
  //     borderBottomColor: 5,
  //     borderStyle: 'solid',
  //     borderLeftColor: '#4CAF50',
  //     borderLeftColor: 5,
  //     borderStyle: 'solid',
  //     borderTopColor: '#4CAF50',
  //     borderTopColor: 5,
  //     borderStyle: 'solid',
  //     transform: [{rotate: '180deg'}]
  //   }
  // }).duration(1500);