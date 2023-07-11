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
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const MProfile = ({ navigation, route, messageUpdate, commentsPost, fetchComments }) => {
  const [messages, setMessages] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const [idMessageDelete, setIdMessageDelete] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesLength, setMessagesLength] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        setMessageInput('');
        setMessagesLength(true);
      };
    }, [route])
  );

  const handleChangeMesssage = (text) => {
    setMessageInput(text);
    if(text.length > 0 || text.length < 140) setMessagesLength(false)
    if(text.length === 0 || text.length > 140) setMessagesLength(true)
  };

  const handleSubmit = () => {
    setMessageInput('');
    setMessagesLength(true)
    let commenta = {
      comment: messageInput,
      author: route.params.myUserId,
      image: route.params.imgId
    };
    commentsPost(commenta)
  }
  const deleteComments = async () => {
    setMessagesLoading(true)
    setIsModalOpen(!isModalOpen);
    let messageId = idMessageDelete
    const tok = await AsyncStorage.getItem('token');
    const token = JSON.parse(tok);
    const bearer = `Bearer ${token}`;
    return fetch(baseUrl + `comments/get-comments-image/${messageId}`, {
      method: "DELETE",
      headers: {
        'Authorization': bearer,
        "Content-Type": "application/json"
      }
    })
      .then(data => data.json())
      .then(json => {
        setMessages(messages.filter(item => item._id !== json._id))
      })
      .catch(err => {
        console.error(err)
      })
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
              <View style={styles.commentsItems} >
                <TouchableOpacity
                  style={styles.commentsItems}
                  onPress={() =>
                    navigation.navigate('Users', {
                      screen: 'Usuario',
                      params: {
                        localId: route.params.myUserId,
                        userId: message.author._id,
                      }
                    })
                  }>
                  <Image
                    style={styles.imgProfile}
                    source={{ uri: `${baseUrl}${message.author.image.filename}` }}
                  />
                    <Text style={styles.author}>{message.author.usuario}</Text>
                </TouchableOpacity>
                <Text style={styles.comments}>{message.comment}</Text>
              </View>
{
  message.author._id === route.params.localId ?
              <TouchableOpacity
              onPress={() =>{
                setIsModalOpen(true)
                setIdMessageDelete(message._id)
                }}
              >
                <MaterialCommunityIcons
                  name="delete-forever"
                  size={15}
                  color={'red'}
                />
              </TouchableOpacity>
              : null
      }
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
                  value={messageInput}
                />
              </View>
              <View style={styles.sendButton}>
                <MaterialCommunityIcons.Button
                disabled={messagesLength}
                  style={styles.formItems}
                  name="email-mark-as-unread"
                  size={24}
                  color={messagesLength ? "gray" : "black"}
                  onPress={() => handleSubmit()}
                  
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(!isModalOpen);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you sure that you want to delete this message?
              </Text>
              <View style={styles.pairOfButtons}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  deleteComments();
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setIsModalOpen(!isModalOpen);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
            </View>
          </View>
        </Modal>
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
    width,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 8,
    paddingLeft: 8,
  },
  commentsItems: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginLeft: 15,
  },
  formContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
    position: 'absolute',
    bottom: 73,
    zIndex:10,
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
        elevation: 2,
        marginLeft: 10,
        marginRight: 10
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
      },
      pairOfButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
      }
});
export default connect(mapStateToProps, mapDispatchToProps)(MProfile)
