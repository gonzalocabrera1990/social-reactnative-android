import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { launchImageLibrary } from 'react-native-image-picker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
//import { Video } from 'expo-av';
import { connect } from 'react-redux';
import {
  postImageLike,
  postVideoLike,
  commentsPost,
} from '../redux/ActionCreators';
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  postImageLike: (imageid, usersData) =>
    dispatch(postImageLike(imageid, usersData)),
  postVideoLike: (videoid, usersData) =>
    dispatch(postVideoLike(videoid, usersData)),
  commentsPost: (dataComment) => dispatch(commentsPost(dataComment)),
});

const options = {
  title: 'Select Image',
  type: 'library',
  options: {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  },
};

const Userpage = (props) => {
  const [userpage, setUserpage] = useState([]);
  const [toogleTab, seToogleTab] = useState('photo');
  useEffect(() => {
    setUserpage([props.user]);
  }, [props.user]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        seToogleTab('photo');
      };
    }, [])
  );

  const openGalery = async () => {
    const images = await launchImageLibrary(options);
    console.log(images);
  };

  const handleLike = async (imgID, tag, cb) => {
    let img = await imgID;
    const asyncuser = await AsyncStorage.getItem('id');
    const userid = JSON.parse(asyncuser);
    var usersData = {
      id: userid,
      liked: img,
    };
    if (tag === 'imagen') {
      props.postImageLike(img, usersData).then((resp) => {
        cb(resp);
      });
    } else {
      props.postVideoLike(img, usersData).then((resp) => {
        cb(resp);
      });
    }
  };
  const toogleMedia = (value) => {
    if (toogleTab !== value) seToogleTab(value);
  };
  
  const usuario = !userpage
    ? null
    : userpage.map((u) => {
        const photosWall = u.imagesWall.map((img) => {
          return (
            <View key={img._id} style={styles.imgRow}>
              <TouchableHighlight
                onPress={() =>
                  props.navigation.navigate('ImageWall', {
                    itemId: img._id,
                    info: u,
                    mediaType: 'photo',
                    handleLike: handleLike,
                    commentsPost: commentsPost,
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
            <View key={img._id} style={styles.imgRow}>
              <TouchableHighlight
                onPress={() =>
                  props.navigation.navigate('ImageWall', {
                    itemId: img._id,
                    info: u,
                    mediaType: 'video',
                    handleLike: handleLike,
                    commentsPost: commentsPost,
                  })
                }>
                {/* <Video
                  style={styles.vidWall}
                  repeat={true}
                  resizeMode="contain"
                  source={{ uri: `${baseUrl}${img.filename}` }}
                /> */}
                <Text>Video</Text>
              </TouchableHighlight>
            </View>
          );
        });
        return (
          <View key={u._id}>
            <View style={styles.user}>
              <Image
                style={styles.imgProfile}
                source={{ uri: `${baseUrl}${u.image.filename}` }}
              />
              <View style={styles.userInfo}>
                <Text>
                  {u.firstname} {u.lastname}
                </Text>
                <Text>{u.phrase}</Text>
                <View style={styles.follows}>
                  <TouchableHighlight
                    onPress={() => props.navigation.navigate('Follows',{
                      type: 'followers',
                      userId: u._id 
                    })}>
                    <Text>Followers {u.followers.length}</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => props.navigation.navigate('Follows',{
                      type: 'following',
                      userId: u._id 
                    })}>
                    <Text>Following {u.following.length}</Text>
                  </TouchableHighlight>
                </View>
                <MaterialIcons
                  name="settings"
                  size={21}
                  color={'black'}
                  onPress={() => props.navigation.navigate('Settings')}
                />
              </View>
            </View>
            <View style={styles.buttonContent}>
              <TouchableHighlight
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#fff',
                  borderRadius: 50,
                }}
                onPress={openGalery}>
                <MaterialIcons
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: '#288818',
                    borderRadius: 50,
                  }}
                  name="add-a-photo"
                  size={24}
                  color="black"
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#fff',
                  borderRadius: 50,
                }}>
                <MaterialCommunityIcons
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: '#288818',
                    borderRadius: 50,
                  }}
                  name="video-vintage"
                  size={24}
                  color="black"
                />
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  backgroundColor: '#fff',
                  borderRadius: 50,
                }}>
                <MaterialCommunityIcons
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: '#288818',
                    borderRadius: 50,
                  }}
                  name="record-circle-outline"
                  size={24}
                  color="white"
                />
              </TouchableHighlight>
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
      });
  return (
    <ScrollView showsVerticalScrollIndicator={false}>{usuario}</ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  imgProfile: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  userInfo: {
    paddingTop: 30,
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
    follows: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
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
  },
  imgWall: {
    width: 105,
    height: 105,
  },
  vidWall: {
    width: 105,
    height: 105,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Userpage);
