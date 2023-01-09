import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseurl';

import {
  commentsPost,
  fetchComments
} from '../redux/ActionCreators';

const mapStateToProps = (state) => {
  return {
    messageUpdate: state.messageUpdate
  };
};
const mapDispatchToProps = (dispatch) => ({
  commentsPost: (dataComment) => dispatch(commentsPost(dataComment)),
  fetchComments: (idComments) => dispatch(fetchComments(idComments))
});

const Messages = ({ navigation, route, messageUpdate, commentsPost, fetchComments }) => {
  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const [messagesLoading, setMessagesLoading] = useState(true);
  const [error, setError] = useState('');
  const [ID, setId] = useState('');

  useEffect(() => {
    setMessagesLoading(true)
    fetchComments(route.params.imgId)
  }, []);
  useEffect(() => {
    setMessagesLoading(true)
    setMessages(messageUpdate.messageUpdate);
    if (messages) setMessagesLoading(false)
  }, [messageUpdate.messageUpdate]);

  useFocusEffect(
    useCallback(() => {
      fetchComments(route.params.imgId)
      if (messages) setMessagesLoading(false)
      return () => {
        // source.cancel('Api Canceled');
        setMessages(null);
      };
    }, [route])
  );

  const handleChangeMesssage = (text) => {
    setMessageInput(text);
  };
  // const fetchComments = () => {
  //   return fetch(baseUrl + `comments/get-comments-image/${route.params.imgId}`)
  //     .then((data) => data.json())
  //     .then((json) => {
  //       setMessages(json);
  //     })
  //     .catch((err) => {
  //       setError(err);
  //     });
  // };
  // const handleMesssage = () => {
  //   route.params.handleSubmit(
  //     messageInput,
  //     route.params.imgId,
  //     route.params.startId,
  //     fetchComments
  //   );
  // };
  const handleSubmit = () => {
    setMessagesLoading(true)
    let commenta = {
      comment: messageInput,
      author: route.params.myUserId,
      image: route.params.imgId
    };
    commentsPost(commenta)
    // .then((sol) => {
    //   let test = content.map((item) => {
    //     if (item._id === startId) {
    //       if (item.commento.length === 0) {
    //         item.commento[0] = sol;
    //       } else if (item.commento[0].length > 1) {
    //         item.commento[0] = item.commento[0].concat(sol);
    //       } else {
    //         item.commento[0] = [item.commento[0], sol];
    //       }
    //       return item;
    //     } else {
    //       return item;
    //     }
    //   });
    //   let valor = test.filter((item) => item._id === startId)[0];
    //   let addComment =
    //     valor.commento.length === 0
    //       ? []
    //       : valor.commento[0].length > 1
    //       ? valor.commento[0]
    //       : valor.commento;
    //   setContent(test);
    //   fetchComments();
    //   setComments(addComment);
    //   setActive('');
    // });
  }

  let mapComments = messages === null || messagesLoading ?
    <View style={styles.activityIndicator}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
    : 
    messages[0] === undefined ?
      <>
        <Text style={styles.padding}>Sin comentarios todavia.</Text>
        <Text style={styles.padding}>Se el primero en comentar</Text>
      </>
    :
    (
      messages.map((message) => {
          return (
            <View style={styles.commentsContent} key={message._id}>
              <TouchableOpacity
                style={styles.commentsContent}
                onPress={() =>
                  navigation.navigate('Users', {
                    localId: route.params.myUserId,
                    userId: message.author._id,
                  })
                }>
                <Image
                  style={styles.imgProfile}
                  source={{ uri: `${baseUrl}${message.author.image.filename}` }}
                />
                <Text>
                  <Text style={styles.author}>{message.author.usuario}</Text>
                </Text>
              </TouchableOpacity>
              <Text style={styles.comments}>{message.comment}</Text>
            </View>
          )
      })
    );
  return (
    <View style={styles.container}>

      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.arrowBack}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={35}
          color={'green'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <SafeAreaView style={styles.saveAreaViewContainer}>
        <View style={styles.viewContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.messagesView}>{mapComments}</View>
          </ScrollView>
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.messageInput}>
                <TextInput
                  style={styles.formItems}
                  type="email"
                  placeholder="Message"
                  onChangeText={(text) => handleChangeMesssage(text)}
                />
              </View>
              <View style={styles.sendButton}>
                <MaterialCommunityIcons.Button
                  style={styles.formItems}
                  name="email-mark-as-unread"
                  size={24}
                  color="black"
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
  },
  activityIndicator: {
    marginTop: 15,
  },
  arrowBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  imgProfile: {
    height: 30,
    width: 30,
    borderRadius: 50,
    marginRight: 15,
  },
  commentsContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    padding: 8,
  },
  messagesView: {
    width,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 35,
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
  formContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
    position: 'absolute',
    bottom: 25,
    width
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  padding: {
    padding: 8,
  },
  messageInput: {
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  sendButton: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  formItems: {
    backgroundColor: '#fff',
    color: '#aaa',
    height: 50,
  },
  saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
  viewContainer: {
    width,
    height,
    backgroundColor: '#AAA',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '0%',
    paddingBottom: '20%',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Messages)
