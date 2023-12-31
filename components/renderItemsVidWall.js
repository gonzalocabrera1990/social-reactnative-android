import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  fetchVideoNativeLikes,
  imagenFetchComments,
} from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseurl';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchVideoNativeLikes: (id) => dispatch(fetchVideoNativeLikes(id)),
  imagenFetchComments: (id) => dispatch(imagenFetchComments(id)),
});

const RenderItemVid = ({
  navigation,
  item,
  idUser,
  fetchVideoNativeLikes,
  handleCommentSubmit,
  imagenFetchComments,
  user,
  userpage,
  handleLike,
}) => {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [iLikeIt, setILikeIt] = useState('black');
  const [ID, setId] = useState('');
  const [status, setStatus] = useState({});
  const [error, setError] = useState(null);

  let playVideo = React.createRef();
  useEffect(() => {
    (async function () {
      let id = await AsyncStorage.getItem('id');
      setId(id);
    })();

    let imgId = item._id;
    fetchLikes(imgId);

    imagenFetchComments(imgId)
      .then((comm) => {
        setComments(comm);
      })
      .catch((error) => setError(error.message));

  }, [user]);
  async function fetchLikes(id) {
    const tok = await AsyncStorage.getItem('token');
    const token = JSON.parse(tok);
    const bearer = `Bearer ${token}`;
    return fetch(baseUrl + `likes/native-get-i-like-it-video/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
      },
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then(async (liked) => {
        setLikes(liked);
        let idA = await AsyncStorage.getItem('id');
        let likeFilter = liked.some((u) => u._id == JSON.parse(idA));
        setILikeIt(likeFilter ? 'red' : 'black');
      })
      .catch((error) => setError(error.message));
  }

  const callbackLike = (l) => {
    if (l.user) {
      fetchLikes(item._id);
    }
  };

  const liked = (img, tag) => {
    handleLike(img, tag, callbackLike);
  };
  return (
    <View style={styles.containerElement}>
      <View style={styles.containerHead}>
        <TouchableOpacity
          style={styles.user}
          onPress={() =>
            navigation.navigate('Users', {
              screen: 'Usuario',
              params: {
                localId: JSON.parse(idUser),
                userId: userpage._id,
              }
            })
          }>
          <Image
            style={styles.imgProfile}
            source={{ uri: `${baseUrl}${userpage.image.filename}` }}
          />
          <Text>{`${userpage.firstname} ${userpage.lastname}`}</Text>
        </TouchableOpacity>
        <MaterialIcons
          name="favorite-outline"
          size={24}
          color={iLikeIt}
          onPress={() => {
            liked(item._id, 'video');
          }}
        />
      </View>
      <View style={styles.imageContent}>
        <TouchableOpacity style={status.isPlaying ? styles.iconPause : styles.iconPlay} onPress={() =>
          status.isPlaying ? playVideo.current.pauseAsync() : playVideo.current.playAsync()
        }>
          <MaterialCommunityIcons name="play" size={50} color={status.isPlaying ? 'transparent' : 'green'} />
        </TouchableOpacity>
        <Video
          ref={playVideo}
          source={{ uri: `${baseUrl}${item.filename}` }}
          key={item._id}
          resizeMode="contain"
          style={{
            aspectRatio: 1,
            width: '100%',
          }}
          onPlaybackStatusUpdate={setStatus}
        />
      </View>
      <View style={styles.info}>
        <View>
          {
            !likes.length ?
              null
              :
              likes.length > 1 ? (
                <TouchableOpacity
                  style={styles.user}
                  onPress={() =>
                    navigation.navigate('Likes', {
                      localId: JSON.parse(idUser),
                      likes: likes,
                    })
                  }>
                  <Text style={styles.padding}>
                    A {likes.length} personas le gusta.
                  </Text>
                </TouchableOpacity>
              ) : likes.length == 1 ? (
                <TouchableOpacity
                  style={styles.user}
                  onPress={() =>
                    navigation.navigate('Likes', {
                      localId: JSON.parse(idUser),
                      likes: likes,
                    })
                  }>
                  <Text style={styles.padding}>
                    A {likes.length} persona le gusta.
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.padding}>
                  Se el primero en marcar Me Gusta.
                </Text>
              )}
        </View>
        <View style={styles.form}>
          <View>
            <View>
              {comments.length == 0 ? (
                <>
                  <Text style={styles.padding}>Sin comentarios todavia.</Text>
                  <Text style={styles.padding}>Se el primero en comentar</Text>
                </>
              ) : comments.length > 1 ? (
                <>
                  <Text style={styles.padding}>
                    Hay {comments.length} comentarios
                  </Text>
                </>
              ) : comments.length == 1 ? (
                <Text style={styles.padding}>
                  Hay {comments.length} comentario
                </Text>
              ) : null}
            </View>
            <View>
              {comments[0] === undefined ? null : comments[0] !== undefined &&
                comments[1] !== undefined ? (
                <View>
                  <View style={styles.commentsContent}>
                    <View>
                      <TouchableOpacity
                        style={styles.user}
                        onPress={() =>
                          navigation.navigate('Users', {
                            screen: 'Usuario',
                            params: {
                              localId: JSON.parse(idUser),
                              userId: comments[comments.length - 2].author._id,
                            }
                          })
                        }>
                        <Text style={styles.author}>
                          {comments[comments.length - 2].author.usuario}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.comments}>
                      {comments[comments.length - 2].comment}
                    </Text>
                  </View>
                  <View style={styles.commentsContent}>
                    <Text>
                      <TouchableOpacity
                        style={styles.user}
                        onPress={() =>
                          navigation.navigate('Users', {
                            screen: 'Usuario',
                            params: {
                              localId: JSON.parse(idUser),
                              userId: comments[comments.length - 1].author._id,
                            }
                          })
                        }>
                        <Text style={styles.author}>
                          {comments[comments.length - 1].author.usuario}
                        </Text>
                      </TouchableOpacity>
                    </Text>
                    <Text style={styles.comments}>
                      {comments[comments.length - 1].comment}
                    </Text>
                  </View>
                </View>
              ) : comments[0] !== undefined && comments[1] == undefined ? (
                <View style={styles.commentsContent}>
                  <Text>
                    <TouchableOpacity
                      style={styles.user}
                      onPress={() =>
                        navigation.navigate('Users', {
                          screen: 'Usuario',
                          params: {
                            localId: JSON.parse(idUser),
                            userId: comments[0].author._id,
                          }
                        })
                      }>
                      <Text style={styles.author}>
                        {comments[0].author.usuario}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                  <Text style={styles.comments}>{comments[0].comment}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.user}
              onPress={() =>
                navigation.navigate('MsProfile', {
                  imgId: item._id,
                  myUserId: userpage._id,
                  localId: user._id
                })
              }>
              <MaterialCommunityIcons
                name="comment-text-multiple"
                size={24}
                color={'green'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerElement: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  padding: {
    padding: 8,
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
  imageContent: {
    flex: 1,
  },
  iconPause: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 10
  },
  iconPlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    color: 'transparent'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  imgProfile: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  form: {
    width: Dimensions.get('window').width,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    padding: 8,
  },
  author: {
    fontSize: 14,
    marginRight: 10,
    color: 'black',
  },
  comments: {
    color: 'rgb(136, 135, 135)',
    fontSize: 12,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemVid);
