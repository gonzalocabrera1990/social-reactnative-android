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
export const StartVideo = ({
  image,
  myUserId,
  navigation,
  handleLike,
  handleSubmit,
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
  }, []);

  useEffect(() => {
    let imgId = image.videoId ? image.videoId._id : null;
    fetchLikes(imgId);
  }, []);
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
      fetchLikes(image.videoId._id);
    }
  };
  const liked = (img, start, tag) => {
    handleLike(img, start, tag, callbackLike);
  };
  // const map = async () => {
  //   let idA = await AsyncStorage.getItem('id');
  //   let likeFilter = likes.some((u) => u._id == JSON.parse(idA));
  // };
  return (
    <View style={styles.container}>
      <View style={styles.containerHead}>
        <TouchableOpacity
          style={styles.user}
          onPress={() =>
            navigation.navigate('Users', {
              localId: JSON.parse(ID),
              userId: image.userId._id,
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
            liked(image.videoId._id, image._id, 'video');
          }}
        />
      </View>
      <View style={styles.imageContent}>
        <Text>Video</Text>
        {/* <Video
          source={{ uri: `${baseUrl}${image.videoId.filename}` }}
          key={image._id}
          resizeMode="stretch"
          style={{
            aspectRatio: 1,
            width: '100%',
          }}
        /> */}
        {/* <VideoPlayer
    video={{ uri: `${baseUrl}${image.videoId.filename}` }}
    videoWidth={160}
    videoHeight={90}
    style={{
        aspectRatio: 1,
        width: '100%',
      }}
/> */}
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
          {/* <View>
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
                    <View
                    // to={`/profiles/${props.usuario}/${
                    //   comments[0][comments[0].length - 2].author
                    //     .usuario
                    // }`}
                    >
                      <TouchableOpacity
                        style={styles.user}
                        onPress={() =>
                          navigation.navigate('Users', {
                            localId: JSON.parse(ID),
                            userId:
                              comments[0][comments[0].length - 2].author._id,
                          })
                        }>
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
                    <Text
                    // to={`/profiles/${props.usuario}/${
                    //   comments[0][comments[0].length - 1].author
                    //     .usuario
                    // }`}
                    >
                      <TouchableOpacity
                        style={styles.commentsContent}
                        onPress={() =>
                          navigation.navigate('Users', {
                            localId: JSON.parse(ID),
                            userId:
                              comments[0][comments[0].length - 1].author._id,
                          })
                        }>
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
                  <Text
                  // to={`/profiles/${props.usuario}/${comments[0].author.usuario}`}
                  >
                    <TouchableOpacity
                      style={styles.commentsContent}
                      onPress={() =>
                        navigation.navigate('Users', {
                          localId: JSON.parse(ID),
                          userId: comments[0].author._id,
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
          </View> */}

          <View>
            <MaterialCommunityIcons
              name="comment-text-multiple"
              size={24}
              color={'green'}
              onPress={() =>
                navigation.navigate('Messages', {
                  comments: image.commento,
                  myUserId: JSON.parse(ID),
                  imgId: image.videoId._id,
                  startId: image._id,
                  handleSubmit: handleSubmit,
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
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
    margin: '0px',
    padding: 8,
  },
  author: {
    fontSize: '14px',
    marginRight: '10px',
    color: 'black',
  },
  comments: {
    color: 'rgb(136, 135, 135)',
    fontSize: '12px',
  },
  imgProfile: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  imageContent: {
    // position: 'initial',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    width: Dimensions.get('window').width,
    // minhHight: 980,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'space-between',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  padding: {
    padding: 8,
  },
});
