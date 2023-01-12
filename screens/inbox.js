import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketContext } from '../components/contextSocketIO';
import {
  getInboxFollows
} from '../redux/ActionCreators';

import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window');
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';

import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    inboxFollows: state.inboxFollows.follows,
    inbox: state.inbox.inbox
  };
};
const mapDispatchToProps = (dispatch) => ({
  getInboxFollows: () => dispatch(getInboxFollows())
});
const Inbox = ({ inboxFollows, getInboxFollows, inbox }) => {
  const [talk, setTalk] = useState(null);
  const [usersInbox, setUsersInbox] = useState(null);
  const [inboxTalks, setInboxTalks] = useState(null);
  const [ID, setId] = useState('');
  const [room, setRoom] = useState("");
  const [chatTitle, setChatTitle] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    (async function () {
      let idA = await AsyncStorage.getItem('id');
      let idParse = JSON.parse(idA)
      setId(idParse);
    })()
    getInboxFollows();
  }, [])

  useEffect(() => {
    setUsersInbox(inboxFollows)
    setInboxTalks(inbox)
  }, [inboxFollows])
  useEffect(() => {
    socket.on("sendChat", data => {
      setTalk([data])
      let filterInbox = !inbox ? [] : inbox
      // let getinbox = filterInbox.some( i => i._id === data._id) ? null : handleInboxFetch()

      //setUserState(data);
      setIsLoading(false)
    })
  }, [socket])

  useFocusEffect(
    useCallback(() => {
      return () => {
        setRoom('');
        socket.emit("removeuser", ID);
      };
    }, [])
  );

  const handleChangeMesssage = (text) => {
    setMessageInput(text);
  };

  //   const setUserState = (data) => {
  //     const localid = JSON.parse(ID)
  //     const userOne = data.members.userOne
  //     const userTwo = data.members.userTwo
  //     const getChatTitle = {
  //         id: {
  //             _id: userOne._id === localid ? userTwo._id : userOne._id,
  //             image: userOne._id === localid ? userTwo.image : userOne.image,
  //             firstname: userOne._id === localid ? userTwo.firstname : userOne.firstname,
  //             lastname: userOne._id === localid ? userTwo.lastname : userOne.lastname,
  //             username: userOne._id === localid ? userTwo.username : userOne.username
  //         }
  //     }
  //     setRoom(data.room)
  //     setTalk([data])
  //     setChatTitle(getChatTitle)
  // }

  const handleSubmitInbox = () => {
    const talkId = talk[0] ? talk[0]._id : ''
    const RECEPTOR = chatTitle._id
    const roomSocket = room
    const datad = {
      contenido: {
        members: {
          userOne: ID,
          userTwo: RECEPTOR
        },
        talk: {
          author: ID,
          content: messageInput
        }
      },
      talkId,
      roomSocket
    }
    socket.emit('sendMessage', datad)
    setMessageInput('')
    inputRef.current.clear()
  }

  const setReceptor = (data) => {
    let localUser = ID
    let findTalk = data.members.userOne._id === localUser ? data.members.userTwo : data.members.userOne
    // inboxTalks === null ? [] :
    //   inboxTalks.filter(t => {//return complete chat with these conditions
    //     return t.members.userOne._id === localUser && t.members.userTwo._id === frienid ?
    //       t.members.userOne._id === localUser && t.members.userTwo._id === frienid :
    //       t.members.userTwo._id === localUser && t.members.userOne._id === frienid
    //   })
    setChatTitle(findTalk)
  }

  const existChat = frienid => {
    let localUser = ID
    let findTalk = inboxTalks === null ? [] :
      inboxTalks.filter(t => {//return complete chat with these conditions
        return t.members.userOne._id === localUser && t.members.userTwo._id === frienid ?
          t.members.userOne._id === localUser && t.members.userTwo._id === frienid :
          t.members.userTwo._id === localUser && t.members.userOne._id === frienid
      })
    return findTalk;
  }

  let MESSAGES = !talk ? null : talk[0].talk.map(l => {
    let styling = l.author === ID
    return (

      <View key={l._id} style={(styling ? styles.chatOwnStyleMargin : styles.chatTheyStyleMargin)} >
        <View style={(styling ? styles.chatOwnStyle : styles.chatTheyStyle)} >
          <Text>{l.content}</Text>
        </View>
      </View>

    )
  })

  return (
    <SafeAreaView style={styles.saveAreaViewContainer}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.viewContainer}>
        {
          !usersInbox ? null :
            <SelectDropdown
              data={usersInbox}
              onSelect={(selectedItem, index) => {
                setIsLoading(true)
                var ids = selectedItem.id._id
                let charla = existChat(ids)
                let result = charla[0] ? true : false
                //if exist a chat with these users fetch it
                if (result) {
                  setRoom(charla[0].room)
                  setReceptor(charla[0])
                  let room = charla[0].room
                  let query = charla[0]._id
                  let data = {
                    query, ID, room
                  }
                  socket.emit("fetchChat", data);
                }
              }}
              defaultButtonText={'Select User'}
              buttonTextAfterSelection={(selectedItem, index) => {
                return `${selectedItem.id.firstname} ${selectedItem.id.lastname}`;
              }}
              rowTextForSelection={(item, index) => {
                return `${item.id.firstname} ${item.id.lastname}`;
              }}
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown2BtnTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <MaterialCommunityIcons
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#FFF'}
                    size={18}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown2DropdownStyle}
              rowStyle={styles.dropdown2RowStyle}
              rowTextStyle={styles.dropdown2RowTxtStyle}
            />
        }
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
        >
          {!talk ? (
            <Text>Pick a user to init a conversation</Text>
          ) : isLoading ? (
            <View >
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          )
            :
            (
              MESSAGES
            )}

        </ScrollView>
        <View style={styles.formPosition}>
          {!talk ? null : (
            <View style={styles.form}>
              <View
                style={styles.inputMessage}>
                <TextInput
                  ref={inputRef}
                  type="email"
                  placeholder="Message"
                  onChangeText={(text) => handleChangeMesssage(text)}
                />
              </View>
              <View style={styles.likeButton}>
                <MaterialCommunityIcons.Button
                  style={styles.like}
                  name="email-mark-as-unread"
                  size={24}
                  color="black"
                  onPress={handleSubmitInbox}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formPosition: {
    position: 'absolute',
    bottom: 0,
    width
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  inputMessage: {
    padding: 8,
    backgroundColor: 'white',
    width: '80%',
    height: '100%',

  },
  likeButton: {
    width: '20%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  like: {
    backgroundColor: '#fff',
    color: '#fff',
  },
  //   inboxes: {
  //     display: 'block',
  //     overflow-y: 'scroll',
  //     scroll-behavior: 'smooth',
  //     background: '#b3b3b3',
  //     overflow: 'hidden',
  // },
  messageDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    width, height
  },
  chatOwnStyleMargin: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 7,
    marginBottom: 7,
    marginRight: 5,
    marginLeft: 5,
  },
  chatTheyStyleMargin: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: 7,
    marginBottom: 7,
    marginRight: 5,
    marginLeft: 5,
  },
  chatOwnStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'green',
    borderRadius: 18,
    width: 'auto',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    maxWidth: '64%',
    color: 'white',
  },
  chatTheyStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    width: 'auto',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    maxWidth: '64%',
    color: 'green',
  },
  // shadow: {
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 6},
  //   shadowOpacity: 0.1,
  //   shadowRadius: 10,
  //   elevation: 10,
  // },
  // header: {
  //   flexDirection: 'row',
  //   width,
  //   height: 50,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#F6F6F6',
  // },
  // headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: { flex: 1, width, backgroundColor: '#FFF' },
  viewContainer: { flex: 1, width, backgroundColor: '#AAA' },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    display: 'flex',
    paddingBottom: 50,
    width
  },

  // dropdown1BtnStyle: {
  //   width: '80%',
  //   height: 50,
  //   backgroundColor: '#FFF',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#444',
  // },
  // dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  // dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  // dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  // dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: { backgroundColor: '#444', borderBottomColor: '#C5C5C5' },
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // dropdown3BtnStyle: {
  //   width: '80%',
  //   height: 50,
  //   backgroundColor: '#FFF',
  //   paddingHorizontal: 0,
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   borderColor: '#444',
  // },
  // dropdown3BtnChildStyle: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingHorizontal: 18,
  // },
  // dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  // dropdown3BtnTxt: {
  //   color: '#444',
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  //   fontSize: 24,
  //   marginHorizontal: 12,
  // },
  // dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  // dropdown3RowStyle: {
  //   backgroundColor: 'slategray',
  //   borderBottomColor: '#444',
  //   height: 50,
  // },
  // dropdown3RowChildStyle: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   paddingHorizontal: 18,
  // },
  // dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
  // dropdown3RowTxt: {
  //   color: '#F1F1F1',
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  //   fontSize: 24,
  //   marginHorizontal: 12,
  // },

  // dropdown4BtnStyle: {
  //   width: '50%',
  //   height: 50,
  //   backgroundColor: '#FFF',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#444',
  // },
  // dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  // dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  // dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  // dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
});
export default connect(mapStateToProps, mapDispatchToProps)(Inbox);

