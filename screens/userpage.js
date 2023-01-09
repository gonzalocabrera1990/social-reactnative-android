import { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { connect } from 'react-redux';
import {
  imagenWall,
  storiesCreator,
  fetchUser
} from '../redux/ActionCreators';
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  imagenWall: (mediaId, filedata) =>
    dispatch(imagenWall(mediaId, filedata)),
  storiesCreator: (mediaId, filedata) =>
    dispatch(storiesCreator(mediaId, filedata)),
  fetchUser: (username) =>
    dispatch(fetchUser(username))
});

// const options = {
//   title: 'Select Image',
//   type: 'library',
//   options: {
//     selectionLimit: 1,
//     mediaType: 'photo',
//     includeBase64: false,
//   },
// };

const Userpage = (props) => {
  const [userpage, setUserpage] = useState(null);
  const [toogleTab, seToogleTab] = useState('photo');
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [duration, setDuration] = useState(0)
  const [loadWallType, setLoadWallType] = useState("")
  const [loadWall, setLoadWall] = useState(null)
  const [messageModal, setMessageModal] = useState('')
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false)
  const [permission, setPermission] = useState(null)
  var myVideos = [];
  useEffect(() => {
    setUserpage([props.user]);
    setIsLoading(props.isLoading)
  }, [props.user]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        seToogleTab('photo');
        setLoadWall(null)
        //setIsLoading(true)
      };
    }, [])
  );

  const openGaleryWall = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsEditing: true
    });
    myVideos.length = 0;
    setLoadWallType(type)
    if (type === "story") {
      let files = !result.assets[0] ? null : result.assets[0].type;
      if (files === "image") handleWallimg(result.assets[0])
      if (files === "video") Wallvid(result.assets[0])
    } else if (type === "video") {
      Wallvid(result.assets[0])
    } else if (type === "imagen") {
      handleWallimg(result.assets[0]);
    }
  }

  const handleWallimg = (img) => {
    let loadingType = img.type
    if (loadingType === "video") {
      setIsFormatModalOpen(true)
      setMessageModal('It is not a Image')
    } else {
      setLoadWall(img)
      setDuration(10000)
    }
  }

  function Wallvid(video) {
    let loadingType = video.type
    if (loadingType === "video") {
      myVideos.push(video);
      handleWallvid(video);
      // var video = document.createElement('video');
      // video.preload = 'metadata';
      // video.onloadedmetadata = function () {
      //   window.URL.revokeObjectURL(video.src);
      //   var duration = video.duration;
      //   myVideos[myVideos.length - 1].duration = duration;

      // }
      // video.src = URL.createObjectURL(files);
    } else {
      setIsFormatModalOpen(true)
      setMessageModal('It is not a Video')
    }
  }

  function handleWallvid(video) {
    var testing = video.duration;
    if (testing <= 60000) {
      setLoadWall(video)
      setDuration(testing)
    } else {

      setIsFormatModalOpen(true)
      setMessageModal('El video que intentaste publicar excede la duracion maxima de 1 minuto. Por favor, intente con otro video.')
    }
  }

  const handleWallSubmit = async () => {
    setIsSending(true)
    let ext = loadWall.uri.split('.');
    const fd = new FormData();
    fd.append('image', {
      name: loadWall.uri,
      uri: loadWall.uri,
      type: `${loadWall.type}/${ext[ext.length - 1]}`
    });
    fd.append('duration', duration);
    const tok = await AsyncStorage.getItem('id');
    let ID = JSON.parse(tok);
    const creds = await AsyncStorage.getItem('creds');
    const username = JSON.parse(creds);
    if (loadWallType === "video" || loadWallType === "imagen") {
      props.imagenWall(ID, fd)
        .then((f) => {
          props.fetchUser(username.username)
            .then((response) => {
              if (response) {
                setLoadWall(null)
                setIsSending(false)
              }
            });
        });
    }
    if (loadWallType === "story") {
      props.storiesCreator(ID, fd)
        .then((f) => {
          props.fetchUser(username.username)
            .then((response) => {
              if (response) {
                setLoadWall(null)
                setIsSending(false)
              }
            });
        });
    }
  }

  const toogleMedia = (value) => {
    if (toogleTab !== value) seToogleTab(value);
  };

  const usuario = !userpage || !userpage[0]
    ? null
    : userpage.map((u) => {
      const photosWall = u.imagesWall.map((img) => {
        return (
          <View key={img._id} style={styles.imgWall}>
            <TouchableHighlight
              onPress={() =>
                props.navigation.navigate('ImageWall', {
                  itemId: img._id,
                  info: u,
                  mediaType: 'photo'
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
                props.navigation.navigate('ImageWall', {
                  itemId: img._id,
                  info: u,
                  mediaType: 'video'
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

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isFormatModalOpen}
              onRequestClose={() => {
                setIsFormatModalOpen(!isFormatModalOpen);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{messageModal}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setIsFormatModalOpen(!isFormatModalOpen)
                      setMessageModal('')
                    }}
                  >
                    <Text style={styles.textStyle}>Hide Modal</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.user}>
            <TouchableHighlight onPress={() => props.navigation.navigate('ImageProfile', {
              image: u.image.filename,
              username: u.username
            })}>
              <Image
                style={styles.imgProfile}
                source={{ uri: `${baseUrl}${u.image.filename}` }}
              />
            </TouchableHighlight>
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
              <MaterialIcons
                name="settings"
                size={21}
                color={'black'}
                onPress={() => props.navigation.navigate('Settings')}
              />
            </View>
          </View>
          <View style={styles.buttonContent}>
            {!loadWall && !isSending
              ?
              <>
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
                  onPress={() => openGaleryWall('imagen')}>
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
                  }}
                  onPress={() => openGaleryWall('video')}>
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
                  }}
                  onPress={() => openGaleryWall('story')}>
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
              </>
              :
              isSending
                ?
                <View>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
                :
                <TouchableHighlight
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 50,
                    zIndex: 10,
                  }}
                  onPress={() => handleWallSubmit()}

                >
                  <MaterialCommunityIcons
                    style={styles.formItems}
                    name="email-mark-as-unread"
                    size={24}
                    color="black"
                  />
                </TouchableHighlight>
            }
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

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  } else {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>{usuario}</ScrollView>
    );
  }
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
  formItems: {
    backgroundColor: '#fff',
    color: '#aaa',
    height: 50,
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

  //MODAL
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    zIndex: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Userpage);
