import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchFollowing } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseurl';
const { width } = Dimensions.get('window');

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchFollowing: () => dispatch(fetchFollowing()),
});

const Stories = (props) => {
  const [userStory, setUserStory] = useState([]);

  useEffect(() => {
    props.fetchFollowing();
  }, []);

  useEffect(() => {
    let nss = !props.stories.story ? null : props.stories.story;
    setUserStory(nss);
  }, [props.stories]);
  return (
    <>
      <StoryMap userStory={userStory} {...props} />
    </>
  );
};

export const StoryMap = ({ userStory, navigation }) => {
  // const renderItemNoSeen = ({ item }) => (
  //   <View style={styles.story}>
  //     <TouchableOpacity
  //       style={styles.commentsContent}
  //       onPress={() => navigation.navigate('StoriesPlay',{
  //         userId: item.id._id,
  //         storyId: item.id.stories[0]._id
  //       })}>
  //       <Image
  //         style={styles.tinyLogoNoSeen}
  //         source={{ uri: `${baseUrl}${item.id.image.filename}` }}
  //       />
  //     </TouchableOpacity>
  //     <Text style={styles.name}>{item.id.firstname}</Text>
  //     <Text style={styles.name}>{item.id.lastname}</Text>
  //   </View>
  // );
  // const renderItemSeen = ({ item }) => (
  //   <View style={styles.story}>
  //     <TouchableOpacity
  //       style={styles.commentsContent}
  //       onPress={() => navigation.navigate('StoriesPlay',{
  //         userId: item.id._id,
  //         storyId: item.id.stories[0]._id
  //       })}>
  //       <Image
  //         style={styles.tinyLogoSeen}
  //         source={{ uri: `${baseUrl}${item.id.image.filename}` }}
  //       />
  //     </TouchableOpacity>
  //     <Text style={styles.name}>{item.id.firstname}</Text>
  //     <Text style={styles.name}>{item.id.lastname}</Text>
  //   </View>
  // );
  const NoSeen = !userStory.users ? null : userStory.users.noSeen.map(item=>{
    return(
    <React.Fragment key={item._id}>
       <View style={styles.story} key={item._id}>
      <TouchableOpacity
        style={styles.commentsContent}
        onPress={() => navigation.navigate('StoriesPlay', {
          userId: item.id._id,
          storyId: item.id.stories[0]._id
        })}>
        <Image
          style={styles.tinyLogoNoSeen}
          source={{ uri: `${baseUrl}${item.id.image.filename}` }}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{item.id.firstname}</Text>
      <Text style={styles.name}>{item.id.lastname}</Text>
    </View>
    </React.Fragment>
    )}
  );
  const Seen = !userStory.users ? null : userStory.users.seen.map(item=>{
    return(
    <React.Fragment key={item._id}>
       <View style={styles.story} >
      <TouchableOpacity
        style={styles.commentsContent}
        onPress={() => navigation.navigate('StoriesPlay', {
          userId: item.id._id,
          storyId: item.id.stories[0]._id
        })}>
        <Image
          style={styles.tinyLogoSeen}
          source={{ uri: `${baseUrl}${item.id.image.filename}` }}
        />
      </TouchableOpacity>
      <Text style={styles.name}>{item.id.firstname}</Text>
      <Text style={styles.name}>{item.id.lastname}</Text>
    </View>
    </React.Fragment>
    )}
  );
  // const NoSeen = !userStory.users ? null : (
  //   <>
  //     <FlatList
  //       data={userStory.users.noSeen}
  //       renderItem={renderItemNoSeen}
  //       keyExtractor={(item) => item._id}
  //       horizontal={true}
  //     />
  //   </>
  // );
  // const Seen = !userStory.users ? null : (
  //   <>
  //     <FlatList
  //       data={userStory.users.seen}
  //       renderItem={renderItemSeen}
  //       keyExtractor={(item) => item._id}
  //       horizontal={true}
  //     />
  //   </>
  // );

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {NoSeen}
      {Seen}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width
    //alignItems: 'center',
  },
  tinyLogoNoSeen: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: '#4CAF50',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  tinyLogoSeen: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  story: {
    width: 65,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
  },
  name: {
    fontSize: 12,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Stories);
