import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import Imagine from 'react-native-scalable-image';
import { MaterialIcons } from '@expo/vector-icons';
import { baseUrl } from '../shared/baseurl';

// const mapDispatchToProps = dispatch => ({
//   fetchUsersLikes: id => dispatch(fetchUsersLikes(id))
// })
export const WallImageItem = ({image}) => {
    return (
        <View >
            {/* <View style={styles.containerHead}>
                <View style={styles.user}>
                  <Image style={styles.imgProfile} source={{uri: `${baseUrl}${userStates.image.filename}`}}/>
                  <Text>
                    {`${userStates.firstname} ${userStates.lastname}`}
                  </Text>
                </View>
                <MaterialIcons name="favorite-outline" size={24} color={iLikeIt} />
            </View> */}
            <View style={styles.imageContent}>
                {/* <Image  style={styles.img}
                        source={{uri: `${baseUrl}${image.imageId.filename}`}}
                        /> */}
                        <Image
                            width={Dimensions.get('window').width} // height will be calculated automatically
                            source={{uri: `${baseUrl}${image.filename}`}}
                        />
            </View>
            <View>
              {
                // likes.length > 1 ?
                // <Text style={styles.padding} >A {likes.length} personas le gusta.</Text>
                // :
                // likes.length == 1 ?
                // <Text style={styles.padding} >A {likes.length} persona le gusta.</Text>
                // :
                <Text style={styles.padding} >Se el primero en marcar Me Gusta.</Text>
              }
            </View>
            <View>
              {/* { comments.length > 1 ?
              <>
                <Text style={styles.padding}>Ver los {comments.length} comentarios</Text>
                <Text style={styles.padding}>{comments[0].author.usuario} {comments[0].comment}</Text>
                <Text style={styles.padding}>{comments[1].author.usuario} {comments[1].comment}</Text>
              </>
              : comments.length == 1 ?
              <>
                <Text style={styles.padding}>Ver {comments.length} comentario</Text>
                <Text style={styles.padding}>{comments[0].author.usuario} {comments[0].comment}</Text>
              </>
              :
              <Text style={styles.padding}>Sin comentarios todavia. Se el primero en comentar</Text>
              } */}
                <Text style={styles.padding}>Sin comentarios todavia. Se el primero en comentar</Text>

            </View>
            <View style={styles.form}>
              <TextInput style={{flex: 5}} placeholder='message'/>
          
              <Button style={{flex: 1}} color='green' title="M" />
            </View>
        </View>
    )
}
//export default connect(null, mapDispatchToProps)(StartImage)
const styles = StyleSheet.create({
  padding:{
    padding: 8,
  },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginBottom: 30
    },
    containerHead: {
      display: 'flex',
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'space-between',
      padding: 5
    },
    user: {
      display: 'flex',
      flexDirection: 'row',
      alignItems:'center',
      margin: 3,
    },
    contentContainer: {
      paddingTop: 30,
      margin: 30
    },
    imgContent: {
      flex: 3,
      marginBottom: 25
    },
    imageContent:{
      flex: 1 
    },
    img: {
      height: 80
      // width: 360,
      // height: 210
    },
    imgProfile: {
      height: 50,
      width: 50,
      borderRadius: 50,
      marginRight: 15
    },
    form: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    tabBarInfoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      // ...Platform.select({
      //   ios: {
      //     shadowColor: 'black',
      //     shadowOffset: { height: -3 },
      //     shadowOpacity: 0.1,
      //     shadowRadius: 3,
      //   },
      //   android: {
      //     elevation: 20,
      //   },
      // }),
      alignItems: 'center',
      backgroundColor: '#fbfbfb',
      paddingVertical: 20,
    }
  });
