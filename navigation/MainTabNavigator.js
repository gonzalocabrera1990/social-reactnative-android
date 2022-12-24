import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from '../components/renderItemsImgWall';
import RenderItemVid from '../components/renderItemsVidWall';
import Inbox from '../screens/inbox';
import HomeScreen from '../screens/login';
import Signup from '../screens/signup';
import ImageWall from '../screens/ImageWall';
import { Messages } from '../screens/messages';
import { Likes } from '../screens/likes';
import { MProfile } from '../screens/profileItemsmessages';
import { Search } from '../screens/search';
import Follows from '../screens/follows';
import Notifications from '../screens/notifications';
import StoriesPlay from '../screens/storiesPlay';
import Settings from '../screens/settings';
import { Start } from '../screens/start';
import Userpage from '../screens/userpage';
import Users from '../screens/users';
// import {
//   fetchUser,
//   logoutUser,
//   fetchStart,
//   fetchNotifications,
//   fetchFollowers,
//   fetchFollowing,
// } from '../redux/ActionCreators';

// import AuthLoadingScreen from '../components/AuthLoadingScreen';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user.user,
  };
};
// const mapDispatchToProps = dispatch => ({
// //   logoutUser: () => dispatch(logoutUser()),
// //   fetchStart: () => dispatch(fetchStart()),
// //   //fetchNotifications: () => dispatch(fetchNotifications()),
// //   fetchFollowers: () => dispatch(fetchFollowers()),
//    fetchUser: (id) => dispatch(fetchUser(id))
// })

const Stack = createBottomTabNavigator();
// const auth = this.props.auth.auth.isAuthenticated;
// console.log("navbar", auth);
const MainStack = (props) => {
  useEffect(() => {
    async function payload() {
      props.dispatch({
        type: 'RELOAD_AUTH',
        payload: {
          isAuthenticated: await AsyncStorage.getItem('token'),
          token: await AsyncStorage.getItem('token'),
          user: await AsyncStorage.getItem('creds'),
          id: await AsyncStorage.getItem('id'),
        },
      });
    }
    payload();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = !focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = !focused ? 'account' : 'account-outline';
          } else if (route.name === 'Inbox') {
            iconName = !focused ? 'message' : 'message-outline';
          } else if (route.name === 'Notifications') {
            iconName = !focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Search') {
            iconName = !focused ? 'magnify-plus' : 'magnify';
          }

          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={24} color={'black'} />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {props.auth.isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={Start} />

          <Stack.Screen name="Profile" component={Userpage} />
          <Stack.Screen
            options={{ tabBarBadge: 3 }}
            name="Inbox"
            component={Inbox}
          />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen
            name="ImageWall"
            component={ImageWall}
            options={{
              tabBarButton: () => null,
            }}
          />
          <Stack.Screen
            name="RenderItem"
            component={RenderItem}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="RenderItemVid"
            component={RenderItemVid}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="Messages"
            component={Messages}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="MsProfile"
            component={MProfile}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="Follows"
            component={Follows}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="Likes"
            component={Likes}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="Users"
            component={Users}
            options={{
              tabBarButton: () => null,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarButton: () => null,
            }}
          />
           <Stack.Screen
            name="StoriesPlay"
            component={StoriesPlay}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="LogIn"
            component={HomeScreen}
            options={{
              tabBarStyle: { display: 'none' },
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default connect(mapStateToProps, null)(MainStack);
