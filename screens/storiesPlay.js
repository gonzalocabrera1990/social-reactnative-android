import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
//import { Keyframe } from 'react-native-reanimated';
//import { Video } from 'expo-av';
import Constants from 'expo-constants';

import { storiesView } from '../redux/ActionCreators';
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
  const [allDisplayStory, setAllDisplayStory] = useState([]);
  const [currentDisplayStory, setCurrentDisplayStory] = useState([]);
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
    setCurrentDisplayStory(fixCurrent);
    //get user index
    let currentIndex = !allStories
      ? null
      : allStories.findIndex((h) => h[0].userData._id === id);
    setIndexDisplayStory(currentIndex);

    let getDuration = !fixCurrent ? null : fixCurrent[0].duration / 1000;
    setIndexTime(getDuration);
    // console.log('getStories');
    // console.log(getStories);
    // console.log('noSeenFilter');
    // console.log(noSeenFilter);
    // console.log('seenFilter');
    // console.log(seenFilter);
    // console.log('allStories');
    // console.log(allStories);
    // console.log('id');
    // console.log(id);
    // console.log('fixCurrent');
    // console.log(fixCurrent);
    // console.log('currentIndex');
    // console.log(currentIndex);
    // console.log('getDuration');
    // console.log(getDuration);
  }, []);

  const windowst = !allDisplayStory
    ? null
    : allDisplayStory.map((w, index) => {
        //"let view" activar cuando este todo listo. es para saber si esta vista
        //la story y asi activar la peticion para marcar como vista
        // let view = allDisplayStory[indexDisplayStory][nextIndex].views.some(
        //   (v) => v === userId
        //);
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

        let ext =
          allDisplayStory[indexDisplayStory][nextIndex].filename.split('.');
        //const currentDisplayStory = [0,1,2,3,4];

        return (
          <>
            {index == indexDisplayStory ? (
              <View style={styles.container} key={index}>
                <View style={styles.imageContent}>
                  <View style={styles.setIndex}>
                    {!w
                      ? null
                      : w.map((i, it) => {
                          return (
                            <React.Fragment >
                              {it === nextIndex ? (
                                <View style={styles.setItems} key={it}>
                                  <View
                                    style={styles.timeFill}
                                    //exiting={timefilling.duration(1000)}
                                    ></View>
                                </View>
                              ) : it > nextIndex ? (
                                <View style={styles.setItemsNoseen} key={it}>
                                  <View></View>
                                </View>
                              ) : (
                                <View style={styles.setItem} key={it}>
                                  <View></View>
                                </View>
                              )}
                            </React.Fragment>
                          );
                        })}
                  </View>

                  <View style={styles.imageContent}>
                    {ext[ext.length - 1] === 'png' ||
                    ext[ext.length - 1] === 'jpg' ||
                    ext[ext.length - 1] === 'jpeg' ||
                    ext[ext.length - 1] === 'gif' ||
                    ext[ext.length - 1] === 'ico' ? (
                      <Image
                        style={styles.img}
                        source={{ uri: `${baseUrl}${w[nextIndex].filename}` }}
                        onLoad={() =>
                          loadImage(
                            nextIndex === w.length - 1,
                            index,
                            w[nextIndex]._id
                          )
                        }
                      />
                    ) : (
                      // <Video
                      //   source={{ uri: `${baseUrl}${w[nextIndex].filename}` }}
                      //   key={w[nextIndex]._id}
                      //   resizeMode="stretch"
                      //   style={{
                      //     aspectRatio: 1,
                      //     width: '100%',
                      //   }}
                      //   onEnded={() =>
                      //     videoEnd(
                      //       nextIndex === w.length - 1,
                      //       index,
                      //       w[nextIndex]._id
                      //     )
                      //   }
                      //   shouldPlay={true}
                      // />
                      <Text>Video</Text>
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
                        onPress={() => forth(nextIndex === w.length - 1, index)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </>
        );
      });
  return <View style={styles.container}>{windowst}</View>;
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
    height: Dimensions.get('window').height - 10,
    width: Dimensions.get('window').width - 10,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    flex: 1,
    height: Dimensions.get('window').height - 300,
    width: Dimensions.get('window').width - 10,
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
export default connect(mapStateToProps, mapDispatchToProps)(StoriesPlay);
