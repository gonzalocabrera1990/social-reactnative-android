import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { friendRequestResponse } from '../redux/ActionCreators';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { baseUrl } from '../shared/baseurl';

const mapDispatchToProps = (dispatch) => ({
  friendRequestResponse: (dataNotification) =>
    dispatch(friendRequestResponse(dataNotification)),
});

const ItemNotifications = ({
  item,
  friendRequestResponse,
  navigation,
  localHost
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestResponse, setRequestResponse] = useState(null);
  const [requestColor, setRequestColor] = useState(null);

  const handleRequestFriendship = (action, followerId, notiId) => {
    setIsLoading(true);
    setRequestResponse(null);
    setRequestColor(null);
    if (action) setRequestColor('green');
    if (!action) setRequestColor('red');
    const dataNotification = {
      action: action,
      followerId: followerId,
      notiId: notiId,
    };
    friendRequestResponse(dataNotification).then((resp) => {
      setRequestResponse(resp.status);
      setIsLoading(false);
      // props.history.push('/');
      // window.location.reload();
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.containerHead}>
        <View style={styles.user}>
          <TouchableOpacity
            style={styles.user}
            onPress={() =>
              navigation.navigate('Users', {
                screen: 'Usuario',
                params: {
                  localId: localHost,
                  userId: item.followingId._id,
                }
              })
            }>
            <Image
              style={styles.imgProfile}
              source={{ uri: `${baseUrl}${item.followingId.image.filename}` }}
            />
          </TouchableOpacity>
          <Text>
            {item.followingId.firstname} {item.followingId.lastname}{' '}
            {item.message}
          </Text>
        </View>
        <View style={styles.likeButton}>
          {isLoading && !requestResponse ? (
            <View>
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          ) : !requestResponse && !isLoading ? (
            <>
              <TouchableOpacity
                style={styles.like}
                onPress={() =>
                  handleRequestFriendship(true, item.followingId._id, item._id)
                }>
                <MaterialIcons name="done-outline" size={24} color={'green'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.like}
                onPress={() =>
                  handleRequestFriendship(false, item.followingId._id, item._id)
                }>
                <MaterialIcons name="delete-outline" size={24} color={'red'} />
              </TouchableOpacity>
            </>
          ) : (
            // <Text style={{ color: requestColor }}>{requestResponse}</Text>
            <MaterialIcons name="done-outline" size={24} color={requestColor} />          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 15,
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  imgProfile: {
    height: 39,
    width: 39,
    borderRadius: 50,
    marginRight: 15,
  },
  likeButton: {
    width: 40,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  like: {
    backgroundColor: '#fff',
    color: '#fff',
    padding: 0,
    fontSize: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default connect(null, mapDispatchToProps)(ItemNotifications);
