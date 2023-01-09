import {
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import {
  fetchStart,
  postImageLike,
  postVideoLike,
  commentsPost,
} from '../redux/ActionCreators';
import { StartImage } from '../components/StartImage';
import { StartVideo } from '../components/StartVideo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const mapStateToProps = (state) => {
  return {
    start: state.start.start,
    auth: state.auth,
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchStart: () => dispatch(fetchStart()),
  postImageLike: (imageid, usersData) =>
    dispatch(postImageLike(imageid, usersData)),
  postVideoLike: (videoid, usersData) =>
    dispatch(postVideoLike(videoid, usersData)),
  commentsPost: (dataComment) => dispatch(commentsPost(dataComment)),
});

async function map(item) {
  let prom = await AsyncStorage.getItem('token');
  let s =
    typeof prom === 'string'
      ? 'string'
      : typeof prom === 'object'
        ? 'object'
        : null;
  return s;
}

const StartContent = (props) => {
  const [content, setContent] = useState(null);
  const [ID, setId] = useState('');

  useEffect(() => {
    props.fetchStart();
  }, []);
  useEffect(() => {
    async function saveId() {
      let idA = await AsyncStorage.getItem('id');
      setId(idA);
    }
    setContent(props.start);
    saveId();
  }, [props.start]);

  const handleLike = async (imgID, startID, tag, cb) => {
    let img = await imgID;
    const asyncuser = await AsyncStorage.getItem('id');
    const userid = JSON.parse(asyncuser);
    var usersData = {
      id: userid,
      liked: img,
    };
    if (tag === 'imagen') {
      props.postImageLike(img, usersData).then((resp) => {
        let test = content.map((item) => {
          if (item._id === startID) {
            let change = item.imageId.likes.some((i) => i === usersData.id);
            if (change) {
              let likeposition = item.imageId.likes.findIndex(
                (item) => item === usersData.id
              );
              item.imageId.likes.splice(likeposition, 1);
            } else {
              item.imageId.likes = item.imageId.likes.concat(usersData.id);
            }

            return item;
          } else {
            return item;
          }
        });
        setContent(test);
        cb(resp);
      });
    } else {
      props.postVideoLike(img, usersData).then((resp) => {
        let test = content.map((item) => {
          if (item._id === startID) {
            let change = item.videoId.likes.some((i) => i === usersData.id);
            if (change) {
              let likeposition = item.videoId.likes.findIndex(
                (item) => item === usersData.id
              );
              item.videoId.likes.splice(likeposition, 1);
            } else {
              item.videoId.likes = item.videoId.likes.concat(usersData.id);
            }

            return item;
          } else {
            return item;
          }
        });

        setContent(test);
        cb(resp);
      });
    }
  };

  const handleSubmit = (value, imageCommentId, startId, cb) => {
    //let imageCommentId;

    // if (media === 'imagen') {
    //   imageCommentId = img.imageId._id;
    // } else {
    //   imageCommentId = img.videoId._id;
    // }

    let commenta = {
      comment: value,
      author: ID,
      image: imageCommentId,
    };
    props.commentsPost(commenta).then((sol) => {
      let test = content.map((item) => {
        if (item._id === startId) {
          if (item.commento.length === 0) {
            item.commento[0] = sol;
          } else if (item.commento[0].length > 1) {
            item.commento[0] = item.commento[0].concat(sol);
          } else {
            item.commento[0] = [item.commento[0], sol];
          }
          return item;
        } else {
          return item;
        }
      });
      //let valor = test.filter((item) => item._id === startId)[0];
      // let addComment =
      //   valor.commento.length === 0
      //     ? []
      //     : valor.commento[0].length > 1
      //     ? valor.commento[0]
      //     : valor.commento;
      setContent(test);
      cb();
      // setComments(addComment);
      // setActive('');
    });
  };

  if (content) {
    let imgs = content
      ? content.map((i) => {
        let imgOrVideo = i.imageId;
        if (imgOrVideo) {
          return (
            <View key={i._id}>
              <StartImage
                image={i}
                myUserId={props.user}
                navigation={props.navigation}
                handleLike={handleLike}
                handleSubmit={handleSubmit}
              />
            </View>
          );
        } else {
          return (
            <View key={i._id}>
              <StartVideo
                image={i}
                myUserId={props.user}
                navigation={props.navigation}
                handleLike={handleLike}
                handleSubmit={handleSubmit}
              />
            </View>
          );
        }
      })
      : null;
    return <ScrollView>{imgs}</ScrollView>;
  } else {
    return (
      <View>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(StartContent);
