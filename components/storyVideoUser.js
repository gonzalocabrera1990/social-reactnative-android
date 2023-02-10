import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
//import { Keyframe } from 'react-native-reanimated';
import { Video } from 'expo-av';
import Constants from 'expo-constants';

import { storiesView } from '../redux/ActionCreators';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { baseUrl } from '../shared/baseurl';
const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;


export const StoryVideoUser = ({
    content,
    videoEnd,
    nextIndex,
    indexTime,
    index}) => {

    const [status, setStatus] = useState({});
    let playContainer = React.createRef();
    return (
        <View style={styles.imageContent} >
            <TouchableOpacity style={styles.iconPlay} onPress={() =>
                status.isPlaying ? playContainer.current.pauseAsync() : playContainer.current.playAsync()
            }>
                <MaterialCommunityIcons name="play" size={50} color="white" />
            </TouchableOpacity>
            <Video
                ref={playContainer}
                source={{ uri: `${baseUrl}${content.filename}` }}
                style={{
                    aspectRatio: 1,
                    width: '100%',
                    backgroundColor:'red'
                  }}
                  resizeMode="contain"
                  onPlaybackStatusUpdate={setStatus}
                  onLoad={()=> setTimeout(() => {
                    videoEnd(nextIndex === content.length - 1, index, content._id)
                  }, indexTime)}
                  shouldPlay={true}

            />
        </View>
    );
};
// const timefilling = new Keyframe({
//   0: {
//     width: '0%',
//   },
//   100: {
//     width: '100%',
//   },
// });
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#111',
        height: Dimensions.get('window').height,

        width: Dimensions.get('window').width,
        textAlign: 'center',
    },

    imageContent: {
        paddingBottom: 0,
        marginBottom: 0,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    videoStory: {
        width: Dimensions.get('window').width,
        aspectRatio: 1,
        height: '100%'
    },
    iconPlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1
    },
    arrowCointainerLeft: {
        position: 'absolute',
        left: 0,
        top: 190,
    },
    arrowCointainerRight: {
        position: 'absolute',
        right: 0,
        top: 190,
    },
    arrowLeft: {
        width: 26,
        height: 26,
        borderRadius: 50,
        backgroundColor: 'white',
        textAlign: 'center',
        color: 'grey',
        fontSize: 30,
        position: 'relative',
        left: 5,
        top: 30,
        zIndex: 100,
    },
    arrowRight: {
        width: 26,
        height: 26,
        borderRadius: 50,
        backgroundColor: 'white',
        textAlign: 'center',
        color: 'grey',
        fontSize: 30,
        position: 'relative',
        right: 5,
        top: 30,
        zIndex: 100,
    },
    setIndex: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: Dimensions.get('window').width,
        height: 100,
        top: 10,
        zIndex: 1,
        boxOrient: 'horizontal',
        boxDirection: 'normal',
        boxPack: 'justify',
        flexPack: 'justify',
    },
    setItem: {
        backgroundColor: 'red',
        flexGrow: 1,
        height: 5,
        marginRight: 2,
        marginLeft: 2,
        position: 'relative',
        borderRadius: 5,
    },
    setItemsNoseen: {
        backgroundColor: 'black',
        opacity: 0.5,
        flexGrow: 1,
        height: 5,
        marginRight: 2,
        marginLeft: 2,
        position: 'relative',
        borderRadius: 5,
    },
    setItems: {
        backgroundColor: 'yellow',
        opacity: 0.5,
        flexGrow: 1,
        height: 5,
        marginRight: 2,
        marginLeft: 2,
        position: 'relative',
        borderRadius: 5,
    },
    timeFill: {
        height: '100%',
        width: '0%',
        backgroundColor: 'black',
        // animation-iteration-count: 1,
        // animation-timing-function: linear,
        // animation-fill-mode: forwards,
    },
    // arrow: {
    //   textAlign: 'center',
    //   color: 'grey',
    //   fontSize: 30,
    //   top: -1,
    //   left: 4,
    //   position: 'absolute',
    // },
    // paragraph: {
    //   margin: 24,
    //   fontSize: 18,
    //   fontWeight: 'bold',
    //   textAlign: 'center',
    // },
});