import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
//import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
//import { fetchUsersLikes } from "../redux/ActionCreators";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { baseUrl } from '../shared/baseurl';

// const mapDispatchToProps = dispatch => ({
//   fetchUsersLikes: id => dispatch(fetchUsersLikes(id))
// })
const {width, height} = Dimensions.get('window');
const ratio = width/541; //541 is actual image width

export const StartImage = ({
  image,
  myUserId,
  navigation,
  handleLike,
}) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [iLikeIt, setILikeIt] = useState('black');
  const [error, setError] = useState(null);
  const [ID, setId] = useState('');

  useEffect(() => {
    (async function () {
      let id = await AsyncStorage.getItem('id');
      setId(id);
    })();

    setComments(image.commento);
  }, [image.commento]);


  useEffect(() => {
    let imgId = image.imageId ? image.imageId._id : image.videoId._id;
    fetchLikes(imgId);
  }, [image]);

  async function fetchLikes(id) {
    const bearer = 'Bearer ' + (await AsyncStorage.getItem('token'));
    return fetch(baseUrl + `likes/native-get-i-like-it/${id}`, {
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
      fetchLikes(image.imageId._id);
    }
  };

  const liked = (img, start, tag) => {
    handleLike(img, start, tag, callbackLike);
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerHead}>
        <TouchableOpacity
          style={styles.user}
          onPress={() =>
            navigation.navigate('Users', {
              screen: 'Usuario',
              params: {
                localId: JSON.parse(ID),
                userId: image.userId._id,
              } 
            })
          }>
          <Image
            style={styles.imgProfile}
            source={{ uri: `${baseUrl}${image.userId.image.filename}` }}
          />
          <Text>{`${image.userId.firstname} ${image.userId.lastname}`}</Text>
        </TouchableOpacity>
        <MaterialIcons
          name="favorite-outline"
          size={24}
          color={iLikeIt}
          onPress={() => {
            liked(image.imageId._id, image._id, 'imagen');
          }}
        />
      </View>
      <View style={styles.imageContent}>
        <Image
          style={styles.imagina}
          resizeMode={'contain'} // height will be calculated automatically
          source={{ uri: `${baseUrl}${image.imageId.filename}` }}
        />

      </View>
      <View style={styles.info}>
        <View>
          {likes.length > 1 ? (
            <TouchableOpacity
              style={styles.user}
              onPress={() =>
                navigation.navigate('Likes', {
                  localId: JSON.parse(ID),
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
                  localId: JSON.parse(ID),
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
              ) : comments[0].length > 1 ? (
                <>
                  <Text style={styles.padding}>
                    Hay {comments[0].length} comentarios
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
                comments[0][1] !== undefined ? (
                <View>
                  <View style={styles.commentsContent}>
                    <View>
                      <TouchableOpacity
                        style={styles.user}
                        onPress={() =>
                        navigation.navigate('Users', {
                          screen: 'Usuario',
                          params: {
                            localId: JSON.parse(ID),
                            userId:
                              comments[0][comments[0].length - 2].author._id,
                          } 
                        })
                      }
                        >
                        <Text style={styles.author}>
                          {comments[0][comments[0].length - 2].author.usuario}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.comments}>
                      {comments[0][comments[0].length - 2].comment}
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
                            localId: JSON.parse(ID),
                            userId:
                              comments[0][comments[0].length - 1].author._id,
                          } 
                        })
                      }
                        >
                        <Text style={styles.author}>
                          {comments[0][comments[0].length - 1].author.usuario}
                        </Text>
                      </TouchableOpacity>
                    </Text>
                    <Text style={styles.comments}>
                      {comments[0][comments[0].length - 1].comment}
                    </Text>
                  </View>
                </View>
              ) : comments[0] !== undefined ? (
                <View style={styles.commentsContent}>
                  <Text>
                    <TouchableOpacity
                      style={styles.user}
                      onPress={() =>
                      navigation.navigate('Users', {
                        screen: 'Usuario',
                        params: {
                          localId: JSON.parse(ID),
                          userId: comments[0].author._id,
                        } 
                      })
                    }
                      >
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
            <MaterialCommunityIcons
              name="comment-text-multiple"
              size={24}
              color={'green'}
              onPress={() =>
                navigation.navigate('Messages', {
                  myUserId: JSON.parse(ID),
                  imgId: image.imageId._id,
                  startId: image._id
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};
//export default connect(null, mapDispatchToProps)(StartImage)
const styles = StyleSheet.create({
  padding: {
    padding: 8,
  },
  imagina: {
    flex: 1,
    alignSelf: 'stretch',
    width: width,
    aspectRatio: 1
},
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#52006A',
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
  imageContent: {
    flex: 1,
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
});

