import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
//import { Keyframe } from 'react-native-reanimated';
import { Video } from 'expo-av';
import Constants from 'expo-constants';

import { storiesView } from '../redux/ActionCreators';
import { StoryVideo } from '../components/storyVideo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseurl';
const dimensions = Dimensions.get('window');
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;
const mapStateToProps = (state) => {
  return {
    stories: state.stories.story,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  storiesView: (userID, image) => dispatch(storiesView(userID, image)),
});

const StoriesPlay = (props) => {
  const [userId, setUserId] = useState(null);
  const [allDisplayStory, setAllDisplayStory] = useState(null);
  const [currentDisplayStory, setCurrentDisplayStory] = useState(null);
  const [indexDisplayStory, setIndexDisplayStory] = useState('');
  const [nextIndex, setNextIndex] = useState(0);
  const [indexTime, setIndexTime] = useState(0);
  const [timeImage, setTimeImage] = useState(0);
  
  useEffect(() => {
    (async function () {
      let idA = await AsyncStorage.getItem('id');
      setUserId(idA);
    })();
  }, []);

  useEffect(() => {
    let getStories = !props.stories ? null : props.stories; //get story props
    let noSeenFilter = !props.stories.stories
      ? null
      : getStories.stories.noSeen; //filter stories with noSeen
    let seenFilter = !props.stories.stories ? null : getStories.stories.seen; //filter stories seen

    let allStories =
      !noSeenFilter || !seenFilter ? null : noSeenFilter.concat(seenFilter); //filter props stories and joint it
    setAllDisplayStory(allStories); //array of all stories

    let id = props.route.params.userId; //url user id
    //get stories based on user params id
    let fixCurrent = !allStories
      ? null
      : allStories.filter((h) => h[0].userData._id === id)[0];
      console.log('fixCurrent', fixCurrent);
    setCurrentDisplayStory(fixCurrent);
    //get user index
    let currentIndex = !allStories
      ? null
      : allStories.findIndex((h) => h[0].userData._id === id);
    setIndexDisplayStory(currentIndex);

    let getDuration = !fixCurrent ? null : fixCurrent[0].duration / 1000;
    setIndexTime(getDuration);
  }, []);
  let loadImage = (last, index, img) => {
    let gettime;
    clearTimeout(timeImage);
    setIndexTime(10);
    // if (!view)
    //   props
    //     .storiesView(userId, img)
    //     .then((resp) => console.log(resp))
    //     .catch((e) => console.log(e));
    let changeUserIndex = index === allDisplayStory.length - 1;
    if (last && changeUserIndex) {
      setTimeImage(
        setTimeout(() => {
          //props.navigation.goBack()
          props.navigation.navigate('Home');
        }, 10000)
      );
    } else if (last) {
      setTimeImage(
        setTimeout(() => {
          gettime =
            allDisplayStory[indexDisplayStory + 1][0].duration / 1000;
          setNextIndex(0);
          setIndexTime(gettime);
          setIndexDisplayStory(indexDisplayStory + 1);
        }, 10000)
      );
    } else {
      setTimeImage(
        setTimeout(() => {
          gettime =
            allDisplayStory[indexDisplayStory][nextIndex + 1].duration /
            1000;
          setIndexTime(gettime);
          setNextIndex(nextIndex + 1);
        }, 10000)
      );
    }
  };

  let videoEnd = (last, index, img) => {
    let gettime;
    // if (!view)
    //   props
    //     .storiesView(userId, img)
    //     .then((resp) => console.log(resp))
    //     .catch((e) => console.log(e));
    let changeUserIndex = index === allDisplayStory.length - 1;

    if (last && changeUserIndex) {
      props.navigation.navigate('Home');
    } else if (last) {
      setNextIndex(0);
      gettime = allDisplayStory[indexDisplayStory + 1][0].duration / 1000;
      setIndexTime(gettime);
      setIndexDisplayStory(indexDisplayStory + 1);
    } else {
      gettime =
        allDisplayStory[indexDisplayStory][nextIndex + 1].duration / 1000;
      setIndexTime(gettime);
      setNextIndex(nextIndex + 1);
    }
  };
  let forth = (last, index) => {
    let gettime;
    clearTimeout(timeImage);
    let changeUserIndex = index === allDisplayStory.length - 1;
    if (last && changeUserIndex) {
      props.navigation.navigate('Home');
    } else if (last) {
      gettime = allDisplayStory[indexDisplayStory + 1][0].duration / 1000;
      setNextIndex(0);
      setIndexTime(gettime);
      setIndexDisplayStory(indexDisplayStory + 1);
    } else {
      gettime =
        allDisplayStory[indexDisplayStory][nextIndex + 1].duration / 1000;
      setIndexTime(gettime);
      setNextIndex(nextIndex + 1);
    }
  };
  let back = (first, index) => {
    let gettime;
    clearTimeout(timeImage);
    let changeUserIndex = index === 0;
    if (first && changeUserIndex) {
      props.navigation.navigate('Home');
    } else if (first) {
      gettime = allDisplayStory[indexDisplayStory - 1][0].duration / 1000;
      setNextIndex(0);
      setIndexTime(gettime);
      setIndexDisplayStory(indexDisplayStory - 1);
    } else {
      gettime =
        allDisplayStory[indexDisplayStory][nextIndex - 1].duration / 1000;
      setIndexTime(gettime);
      setNextIndex(nextIndex - 1);
    }
  };
  if(currentDisplayStory) {
  let ext =currentDisplayStory ?
  currentDisplayStory[nextIndex].filename.split('.'):null
  return (
    <React.Fragment >
        <View style={styles.container}>
          <View style={styles.imageContent} >
            <View style={styles.setIndex} >
              {!currentDisplayStory
                ?
                <View>
                <ActivityIndicator size="large" color="#00ff00" />
              </View>
                : currentDisplayStory.map((i, it) => {
                    return (
                      <React.Fragment >
                        {it === nextIndex ? (
                          <View style={styles.setItems} key={i._id}>
                            <View
                              style={styles.timeFill}
                              //exiting={timefilling.duration(1000)}
                              ></View>
                          </View>
                        ) : it > nextIndex ? (
                          <View style={styles.setItemsNoseen} key={i._id}>
                            <View></View>
                          </View>
                        ) : (
                          <View style={styles.setItem} key={i._id}>
                            <View></View>
                          </View>
                        )}
                      </React.Fragment>
                    );
                  })}

            </View>
            <View style={styles.imageContent} >
                    {ext[ext.length - 1] === 'png' ||
                    ext[ext.length - 1] === 'jpg' ||
                    ext[ext.length - 1] === 'jpeg' ||
                    ext[ext.length - 1] === 'gif' ||
                    ext[ext.length - 1] === 'ico' ? (
                      <>
                      <Image
                        style={styles.img}
                        source={{ uri: `${baseUrl}${currentDisplayStory[nextIndex].filename}` }}
                        onLoad={() =>
                          loadImage(
                            nextIndex === currentDisplayStory.length - 1,
                            nextIndex,
                            currentDisplayStory[nextIndex]._id
                          )
                        }
                      />
                      </>
                    ) : (
                      <>
                      <StoryVideo
                      content={currentDisplayStory}
                      videoEnd={videoEnd}
                      nextIndex={nextIndex}
                      index={nextIndex}
                      />
                    </>
                    )}
                  </View>
                  <View style={styles.arrowCointainerLeft}>
                    <View style={styles.arrowLeft}>
                      <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color="black"
                        onPress={() => back(nextIndex === 0, index)}
                      />
                    </View>
                  </View>
                  <View style={styles.arrowCointainerRight}>
                    <View style={styles.arrowRight}>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={24}
                        color="black"
                        onPress={() => forth(nextIndex === currentDisplayStory.length - 1, index)}
                      />
                    </View>
                  </View>
            </View>
            </View>
        </React.Fragment>
      )
                    }
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
  videoStory:{
    width: Dimensions.get('window').width,
    aspectRatio:1,
    height: '100%'
  },
  iconPlay:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    color: 'grey'
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(StoriesPlay);
