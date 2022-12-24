import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { baseUrl } from '../shared/baseurl';

export const MProfile = ({ navigation, route }) => {
  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchComments(route.params.imgId);
      return () => {
        // source.cancel('Api Canceled');
        setMessages(null);
      };
    }, [route])
  );

  const handleChangeMesssage = (text) => {
    setMessageInput(text);
  };
  const fetchComments = (image) => {
    return fetch(baseUrl + `comments/get-comments-image/${image}`)
      .then((data) => data.json())
      .then((json) => {
        setMessages(json);
      })
      .catch((err) => {
        setError(err);
      });
  };
  const handleMesssage = () => {
    route.params.handleCommentSubmit(
      messageInput,
      route.params.imgId,
      fetchComments
    );
  };

  let mapComments = !messages ? null : !messages[0] ? (
    <>
      <Text style={styles.padding}>Sin comentarios todavia.</Text>
      <Text style={styles.padding}>Se el primero en comentar</Text>
    </>
  ) : (
    messages.map((message) => {
      return (
        <View style={styles.commentsContent}>
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
      );
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.arrowBack}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={35}
          color={'green'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <SafeAreaView style={styles.saveAreaViewContainer}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
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
                  onPress={() => handleMesssage()}
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
