import React from 'react';
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
const { height, width } = Dimensions.get('window');
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { baseUrl } from '../shared/baseurl';

export const Likes = ({ navigation, route }) => {
  let mapComments = !route.params.likes ? (
    <>
      <Text style={styles.padding}> Se el primero en marcar Me Gusta.</Text>
    </>
  ) : (
    route.params.likes.map((user) => {
      return (
        <View style={styles.commentsContent} key={user._id} >
          <TouchableOpacity
            style={styles.commentsContent}
            onPress={() =>
              navigation.navigate('Users', {
                screen: 'Usuario',
                params: {
                  localId: route.params.localId,
                  userId: user._id,
                }
              })
            }>
            <Image
              style={styles.imgProfile}
              source={{ uri: `${baseUrl}${user.image.filename}` }}
            />
            <Text>
              <Text style={styles.author}>{user.firstname}</Text>
            </Text>
            <Text>
              <Text style={styles.author}>{user.lastname}</Text>
            </Text>
          </TouchableOpacity>
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
