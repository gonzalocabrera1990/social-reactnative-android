import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from '../components/renderItemsImgWall';
import RenderItemVid from '../components/renderItemsVidWall';
import Inbox from '../screens/inbox';
import HomeScreen from '../screens/login';
import Signup from '../screens/signup';
import ImageWall from '../screens/ImageWall';
import Messages from '../screens/messages';
import { Likes } from '../screens/likes';
import MProfile from '../screens/profileItemsmessages';
import { Search } from '../screens/search';
import Follows from '../screens/follows';
import Notifications from '../screens/notifications';
import StoriesPlay from '../screens/storiesPlay';
import StoriesPlayUser from '../screens/storiesPlayUser';
import Settings from '../screens/settings';
import Start from '../screens/start';
import { Poster } from '../screens/poster';
import Userpage from '../screens/userpage';
import Users from '../screens/users';
import ImageProfile from '../screens/profileImage';
import {
  checkToken
} from '../redux/ActionCreators';
import * as ActionTypes from '../redux/ActionTypes';
import { SocketContext } from '../components/contextSocketIO';
// import AuthLoadingScreen from '../components/AuthLoadingScreen';
import { connect, useDispatch } from 'react-redux';
import { baseUrl } from '../shared/baseurl';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.user,
    notifications: state.notifications,
    inbox: state.inbox
  };
};

const mapDispatchToProps = dispatch => ({
  checkToken: () => dispatch(checkToken())
})
const Tab = createBottomTabNavigator();
// const auth = this.props.auth.auth.isAuthenticated;
// console.log("navbar", auth);

const ProfileStack = createNativeStackNavigator();
function ProfileStackScreen({ navigation, route }) {

  // useEffect(() => {
  //   if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
  //     navigation.setOptions({ tabBarVisible: false });
  //   } else {
  //     navigation.setOptions({ tabBarVisible: true });
  //   }
  // }, [navigation, route]);

  return (
    <ProfileStack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: false
      }}
      initialRouteName="Userpage"
    >
      <ProfileStack.Screen
        name="Userpage"
        component={Userpage} />
      <ProfileStack.Screen
        name="Settings"
        component={Settings}
      />
      <ProfileStack.Screen
        name="RenderItem"
        component={RenderItem}
      />
      <ProfileStack.Screen
        name="RenderItemVid"
        component={RenderItemVid}

      />
      <ProfileStack.Screen
        name="MsProfile"
        component={MProfile}
      />
      <ProfileStack.Screen
        name="Follows"
        component={Follows}
      />
      <ProfileStack.Screen
        name="Likes"
        component={Likes}
      />
      <ProfileStack.Screen
        name="ImageProfile"
        component={ImageProfile}
      />
    </ProfileStack.Navigator>
  );
}

const UsersStack = createNativeStackNavigator();
function UsersStackScreen({ navigation, route }) {

  // useEffect(() => {
  //   if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
  //     navigation.setOptions({ tabBarVisible: false });
  //   } else {
  //     navigation.setOptions({ tabBarVisible: true });
  //   }
  // }, [navigation, route]);

  return (
    <UsersStack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: false
      }}
      initialRouteName="Usuario"
    >
      <UsersStack.Screen
       name="Usuario"
       component={Users}
       />
      <UsersStack.Screen
        name="RenderItem"
        component={RenderItem}
      />
      <UsersStack.Screen
        name="RenderItemVid"
        component={RenderItemVid}

      />
      <UsersStack.Screen
        name="MsProfile"
        component={MProfile}
      />
      <UsersStack.Screen
        name="Follows"
        component={Follows}
      />
      <UsersStack.Screen
        name="Likes"
        component={Likes}
      />
      <UsersStack.Screen
        name="StoriesPlayUser"
        component={StoriesPlayUser}
      />
    </UsersStack.Navigator>
  );
}


const MainTab = (props) => {
  const [notificationsBadge, setNotificationsBadge] = useState(null)
  const [inboxBadge, setInboxBadge] = useState(null)
  const { socket } = useContext(SocketContext)

  const dispatch = useDispatch();

  useEffect(() => {

    // async function payload() {
    //    const tokP = await AsyncStorage.getItem('token');
    //    const userP = await AsyncStorage.getItem('creds');
    //    const idP = await AsyncStorage.getItem('id');
    //    const tok = !tokP ? null : JSON.parse(tokP);
    //    const user = !userP ? null : JSON.parse(userP);
    //    const id = !idP ? null : JSON.parse(idP);
    //    if(tok && user && id){
    //     props.dispatch({
    //       type: ActionTypes.RELOAD_AUTH,
    //       payload: {
    //         isAuthenticated: tok,
    //         token: tok,
    //         user: user,
    //         id: id,
    //         isLoading: false
    //       }
    //     });
    //    }

    //  }
    //  payload();
    //  props.checkToken()
    async function payload() {
      const tokP = await AsyncStorage.getItem('token');
      const userP = await AsyncStorage.getItem('creds');
      const idP = await AsyncStorage.getItem('id');
      const tok = !tokP ? null : JSON.parse(tokP);
      const user = !userP ? null : JSON.parse(userP);
      const id = !idP ? null : JSON.parse(idP);
      return {
        type: ActionTypes.RELOAD_AUTH,
        payload: {
          isAuthenticated: tok ? true : false,
          token: tok,
          user: user,
          id: id,
          isLoading: false
        }
      }
    }
    payload()
      .then(res => {
        dispatch(res);
      })
      .catch(error => console.error(error))

  }, []);

  useEffect(() => {
    const notiResults = props.notifications.results;
    let notiCount = 0;
    for (let i = 0; i < notiResults.length; i++) {
      if (notiResults[i].readstatus === false) {
        notiCount++
      }
    }
    if (notiCount > 0) setNotificationsBadge(notiCount)

  }, [props.notifications.results])
  useEffect(() => {
    async function inboxes() {
      let id = await AsyncStorage.getItem('id');
      if (id) {
        const QUERY = JSON.parse(id);
        const inboxResults = !props.inbox.inbox ? [] : props.inbox.inbox;
        let inboxCount = 0;
        for (let i = 0; i < inboxResults.length; i++) {
          const message = inboxResults[i].talk.some(t => t.author !== QUERY && t.seen === false)
          console.log("message", message);
          //const message = inboxResults.some(i => i.talk.some(t => t.author !== QUERY && t.seen === false))
          if (message) {
            inboxCount++
          }
        }
        return inboxCount
      }
    }
    inboxes()
      .then((count) => {
        if (count > 0) setInboxBadge(count)
      })
  }, [props.inbox.inbox])

  useEffect(() => {
    const name = !props.user.user ? null : props.user.user.username
    const id = !props.user.user ? null : props.user.user._id
    socket.on("chatNotification", data => {
      setInboxBadge(inboxBadge + 1)
    })
    if (name && id) socket.emit("username", { id, name })
  }, [socket, props.user.user])
  return (

    <NavigationContainer>
      <Tab.Navigator
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
        {
          props.auth.isLoading &&
            props.user.isLoading ? (
            <Tab.Screen
              name="Poster"
              component={Poster}
              options={{
                tabBarButton: () => null,
                tabBarStyle: { display: 'none' },
              }}
            />
          )
            :
            !props.auth.isAuthenticated ?

              (
                <>
                  <Tab.Screen
                    name="LogIn"
                    component={HomeScreen}
                    options={{
                      tabBarStyle: { display: 'none' },
                    }}
                  />
                  <Tab.Screen
                    name="Signup"
                    component={Signup}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  />
                </>
              )

              :
              props.auth.isAuthenticated ?
                (
                  <>
                    <Tab.Screen name="Home" component={Start} />
                    {/* <Tab.Screen name="Profile" component={Userpage} /> */}
                    <Tab.Screen name="Profile" component={ProfileStackScreen} />

                    <Tab.Screen
                      options={inboxBadge ? { tabBarBadge: inboxBadge } : null}
                      //or
                      //options={{ tabBarBadge: inboxBadge }}
                      name="Inbox"
                      component={Inbox}
                    />
                    <Tab.Screen
                      options={notificationsBadge ? { tabBarBadge: notificationsBadge } : null}
                      //or
                      //options={{ tabBarBadge: notificationsBadge }}
                      name="Notifications"
                      component={Notifications} />
                    <Tab.Screen name="Search" component={Search} />
                   {/* <Tab.Screen
                      name="ImageWall"
                      component={ImageWall}
                      options={{
                        tabBarButton: () => null,
                      }}
                    />
                    <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                      tabBarButton: () => null,
                    }}
                  />
                     <Tab.Screen
                    name="RenderItem"
                    component={RenderItem}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  />
                  <Tab.Screen
                    name="RenderItemVid"
                    component={RenderItemVid}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  /> */}
                  {/* <Tab.Screen
                    name="MsProfile"
                    component={MProfile}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  /> */}
                    <Tab.Screen
                      name="Messages"
                      component={Messages}
                      options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' },
                      }}
                    />
                    {/* <Tab.Screen
                    name="Follows"
                    component={Follows}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  /> */}
                  <Tab.Screen
                    name="Likes"
                    component={Likes}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  />
                  {/* <Tab.Screen
                    name="ImageProfile"
                    component={ImageProfile}
                    options={{
                      tabBarButton: () => null,
                      tabBarStyle: { display: 'none' },
                    }}
                  /> */}
                    <Tab.Screen
                      name="Users"
                      component={UsersStackScreen}
                      options={{
                        tabBarButton: () => null,
                      }}
                    />
                    <Tab.Screen
                      name="StoriesPlay"
                      component={StoriesPlay}
                      options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' },
                      }}
                    />
                    {/* <Tab.Screen
                      name="StoriesPlayUser"
                      component={StoriesPlayUser}
                      options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' },
                      }}
                    /> */}
                  </>
                )
                : null
        }
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(MainTab);


// const StartStack = createNativeStackNavigator();
// function StartStackScreen({ navigation, route }) {
//   return (
//     <StartStack.Navigator
//       headerMode="none"
//       screenOptions={{
//         gestureEnabled: true,
//         gestureDirection: "horizontal",
//         headerShown: false
//       }}
//       initialRouteName="Start"
//     >
//       <StartStack.Screen
//         name="Start" component={Start}
//       />
//       <StartStack.Screen
//         name="Messages"
//         component={Messages}
//       />
//       <StartStack.Screen
//         name="Likes"
//         component={Likes}
//       />
//       <StartStack.Screen
//         name="StoriesPlay"
//         component={StoriesPlay}
//       />
//     </StartStack.Navigator>
//   );
// }