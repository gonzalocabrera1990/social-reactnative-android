import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, StyleSheet, Dimensions, Button, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseurl';
import {
    imagenUser,
    fetchUser
} from '../redux/ActionCreators';

const mapDispatchToProps = (dispatch) => ({
    imagenUser: (ID, filedata) =>
        dispatch(imagenUser(ID, filedata)),
        fetchUser: (username) =>
        dispatch(fetchUser(username))
});

export const ImageProfile = ({ route, imagenUser, fetchUser, navigation }) => {
    const [image, setImage] = useState(null)
    const [permission, setPermission] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (!permission) {
                const galleryStatus = new ImagePicker.requestMediaLibraryPermissionsAsync();
                setPermission(galleryStatus.status === 'granted')
            }
        })()
    }, [])
    useFocusEffect(
        useCallback(() => {
            return () => {
                setImage(null);
                setIsLoading(false)
            };
        }, [])
    );
    const openGalery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4, 3],
            allowsEditing: true
        });
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
        // const images = await launchImageLibrary(options);
        // console.log(images);
    };
    const handleSubmit = () => {
        setIsLoading(true)
        let ext = image.uri.split('.');
        const filedata = new FormData();
        filedata.append('image', {
            name: image.uri,
            uri: image.uri,
            type: `${image.type}/${ext[ext.length - 1]}`
        });
        let ID = route.params.username;
        imagenUser(ID, filedata)
          .then(() => {
            (async () => {
                const tok = await AsyncStorage.getItem('creds');
                const id = JSON.parse(tok);
                if(id.username) fetchUser(id.username).then(navigation.navigate('Profile'))
              })()
            // fetchUser(ID)
            // .then((response) => {
            //   navigation.navigate('Profile')
            // });
          });
    }
    return (
        <View style={styles.imageContent}>
            <Image
                style={styles.imagina}
                resizeMode={'contain'} // height will be calculated automatically
                source={{ uri: !image ? `${baseUrl}${route.params.image}` : image.uri }}
            />
            {
                isLoading ?
                <View>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
                :
                !image ?
                    <Button title='Change Image' onPress={() => openGalery()} />
                    :
                    <Button title='SEND' onPress={handleSubmit} />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    imagina: {
        flex: 1
    },
    imageContent: {
        flex: 1,
        width: Dimensions.get('screen').width,
    },

});
export default connect(null, mapDispatchToProps)(ImageProfile);
