import React, { useEffect, useState } from 'react';
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
} from 'react-native';

//import io from 'socket.io-client';
import {
  getInboxFollows
} from '../redux/ActionCreators';

import { connect } from 'react-redux';
const { width } = Dimensions.get('window');
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';

import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    inboxFollows: state.inboxFollows.follows
  };
};
const mapDispatchToProps = (dispatch) => ({
  getInboxFollows: () => dispatch(getInboxFollows())
});
//const socket = io(baseUrl);
const Inbox = ({ inboxFollows, getInboxFollows}) => {
  const [talk, setTalk] = useState(null);
  const [usersInbox, setUsersInbox] = useState(null);

  const countries = [
    'Egypt',
    'Canada',
    'Australia',
    'Ireland',
    'Brazil',
    'England',
    'Dubai',
    'Argentina',
    'Germany',
    'Saudi Arabia',
    'France',
    'India',
  ];
useEffect(() => {
  getInboxFollows();
}, [])

useEffect(() => {
  setUsersInbox(inboxFollows)
}, [inboxFollows])
  return (
    <SafeAreaView style={styles.saveAreaViewContainer}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      <View style={styles.viewContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {
            !usersInbox ? null :
          <SelectDropdown
            data={usersInbox}
            onSelect={(selectedItem, index) => {
              setTalk(selectedItem);
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
        </ScrollView>
        <View>
          {!talk ? (
            <Text>Pick a user to init a conversation</Text>
          ) : (
            <Text>Beging a conversation with {talk.id.firstname} {talk.id.lastname}</Text>
          )}
        </View>
        <View style={styles.form}>
          {!talk ? null : (
            <View style={styles.form}>
              <View>
                <TextInput
                  style={styles.padding}
                  type="email"
                  placeholder="Message"
                />
              </View>
              <View style={styles.likeButton}>
                <MaterialCommunityIcons.Button
                  style={styles.like}
                  name="email-mark-as-unread"
                  size={24}
                  color="black"
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
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  padding: {
    padding: 8,
  },
  likeButton: {
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  like: {
    backgroundColor: '#fff',
    color: '#fff',
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
  saveAreaViewContainer: { flex: 1, backgroundColor: '#FFF' },
  viewContainer: { flex: 1, width, backgroundColor: '#AAA' },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '0%',
    paddingBottom: '20%',
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

