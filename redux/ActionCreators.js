import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseurl';


export const checkToken = () => async (dispatch) => {
  dispatch(tokenLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `users/checkJWTtoken`, {
    method: "GET",
    headers: {
      'Authorization': bearer
    },
  })
    .then(response => {

      if (response.ok) {
        return response;
      } else {
        dispatch(tokenCheck());
        dispatch(loginError(response.statusText));
        dispatch(logoutUser());
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      })
    .then(response => response.json())
    .then(result => {
      dispatch(tokenCheck());
    })
    .catch(error => {
      dispatch(tokenCheck());
    })
}
export const tokenLoading = () => ({
  type: ActionTypes.TOKEN_LOADING
});
export const tokenCheck = () => ({
  type: ActionTypes.TOKEN_CHECK
});
export const userCheck = () => ({
  type: ActionTypes.USER_CHECK
});


export const loginUser = (creds) => (dispatch) => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(userLoading());
  dispatch(requestLogin(creds));
  console.log("aaa");
  AsyncStorage.clear();
  return fetch(baseUrl + 'users/login', {
    method: 'POST',
    headers: {
      //"Content-Type": "application/json",
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then(async (response) => {
      if (response.success) {
        try {
          await AsyncStorage.setItem('token', JSON.stringify(response.token));
          await AsyncStorage.setItem(
            'creds',
            JSON.stringify({ username: creds.username })
          );
          await AsyncStorage.setItem(
            'id',
            JSON.stringify(response.userdata._id)
          );
        } catch (error) {
          dispatch(loginError(error));
        }
        // Dispatch the success action
        //dispatch(fetchFavorites());
        let id = await response.userdata.username;
        let name = response.userdata.firstname;
        let lastname = response.userdata.lastname;
        dispatch(receiveLogin(response));
        dispatch(fetchUser(id));
        dispatch(fetchStart());
        dispatch(fetchNotifications());
        dispatch(fetchFollowing());
        // dispatch(fetchFollowers());

        if(!name && !lastname){
          return new Promise((resolve,reject) =>{
            resolve(true);
          });
        }
      } else {
        var error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => dispatch(loginError(error.message)));
};
export const requestLogin = (creds) => {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    creds,
  };
};
//se agrego userdata: response.user
export const receiveLogin = (response) => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    token: response.token,
    userdata: response,
  };
};

export const loginError = (message) => {
  return {
    type: ActionTypes.LOGIN_FAILURE,
    errMess: message,
  };
};

export const requestLogout = () => {
  return {
    type: ActionTypes.LOGOUT_REQUEST,
  };
};

export const receiveLogout = () => {
  return {
    type: ActionTypes.LOGOUT_SUCCESS,
  };
};
//INBOX
export const inboxFetch = () => async (dispatch) => {
  dispatch(inboxLoading());
  const id = await AsyncStorage.getItem('id');
  const QUERY = JSON.parse(id);
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `inbox-message/getch/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Setting Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((inbox) => {
      const message = inbox.some((i) =>
        i.talk.some((t) => t.author !== QUERY && t.seen === false)
      );
      dispatch(inboxAdd(inbox, message));
    })
    .catch((error) => dispatch(inboxFailed(error.message)));
};
export const inboxLoading = () => ({
  type: ActionTypes.INBOX_LOADING,
});

export const inboxFailed = (errmess) => ({
  type: ActionTypes.INBOX_FAILED,
  payload: errmess,
});

export const inboxAdd = (inbox, read) => ({
  type: ActionTypes.INBOX_SUCCESS,
  payload: inbox,
  read,
});

// Logs the user out
export const logoutUser = () => async (dispatch) => {
  dispatch(requestLogout());
  try {
    await AsyncStorage.clear();
    dispatch(receiveLogout());
    return true;
  } catch (exception) {
    return false;
  }

  //  await AsyncStorage.setItem("token", null);

  //dispatch(favoritesFailed("Error 401: Unauthorized"));
};

export const fetchUser = (id) => async (dispatch) => {
  dispatch(userLoading());
  const aaa = await id;
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + 'users/get-home-user/' + aaa, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then((response) => response.json())
    .then(async (response) => {
      await AsyncStorage.setItem(
        'img',
        JSON.stringify(response.image.filename)
      );

      dispatch(receiveUser(response));
      return response
    })
    .catch((error) => dispatch(receiveUserError(error)));
};

export const userLoading = () => ({
  type: ActionTypes.USER_LOADING,
});

export const receiveUser = (response) => {
  return {
    type: ActionTypes.USER_SUCCESS,
    user: response,
  };
};
export const receiveUserError = (error) => {
  return {
    type: ActionTypes.USER_ERROR,
    errMess: error,
  };
};

//FETCH USERS COMPONENT
export const fetchDataUser = (url) => async (dispatch) => {
  dispatch(usersLoading());
  let host = url.host
  let user = url.user
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `users/native-users/${host}/${user}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      dispatch(receiveUsers(response));
    })
    .catch((error) => dispatch(receiveUsersError(error)));
};

export const usersLoading = () => ({
  type: ActionTypes.USERS_LOADING,
});

export const receiveUsers = (response) => {
  return {
    type: ActionTypes.USERS_SUCCESS,
    user: response,
  };
};
export const receiveUsersError = (error) => {
  return {
    type: ActionTypes.USERS_ERROR,
    errMess: error,
  };
};

//VIEW AFTER LOGIN
export const fetchStart = () => async (dispatch) => {
  dispatch(startLoading());
  const id = JSON.parse(await AsyncStorage.getItem('id'));
  const tok = await AsyncStorage.getItem('token');
  const bearer = `Bearer ${JSON.parse(tok)}`;
  return (
    fetch(baseUrl + `start/publications/${id}`, {
      method: 'GET',
      headers: {
        Authorization: bearer,
      },
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              'Error ' + response.status + ': ' + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          var errmess = new Error(error.message);
          throw errmess;
        }
      )
      .then((response) => response.json())
      .then((start) => {
        dispatch(addStart(start));
        dispatch(fetchNotifications());
      })
      .then(start => dispatch(inboxFetch()))
      .catch((error) => dispatch(startFailed(error.message)))
  );
};
export const startLoading = () => ({
  type: ActionTypes.START_LOADING,
});

export const startFailed = (errmess) => ({
  type: ActionTypes.START_FAILED,
  payload: errmess,
});

export const addStart = (start) => ({
  type: ActionTypes.START_ADD,
  payload: start,
});
//GET Users followers
export const fetchFollowers = () => async (dispatch) => {
  dispatch(followersLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  const QUERY = JSON.parse(AsyncStorage.getItem('id'));
  return fetch(baseUrl + `users/followers-notifications-return/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          'Error ' + response.status + ': ' + response.statusText
        );
        error.response = response;
        throw error;
      }
    })
    .then((response) => response.json())
    .then((response) => {
      dispatch(followersSuccess(response));
    })
    .catch((error) => dispatch(followersError(error.message)));
};
export const followersLoading = () => {
  return {
    type: ActionTypes.FOLLOWERS_LOADING,
  };
};

export const followersSuccess = (followers) => {
  return {
    type: ActionTypes.FOLLOWERS_SUCCESS,
    payload: followers,
  };
};

export const followersError = (message) => {
  return {
    type: ActionTypes.FOLLOWERS_ERROR,
    ERR: message,
  };
};
//GET Users followings
export const fetchFollowing = () => async (dispatch) => {
  dispatch(followingLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  const id = await AsyncStorage.getItem('id');
  const QUERY = JSON.parse(id);
  return fetch(baseUrl + `users/following/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          'Error ' + response.status + ': ' + response.statusText
        );
        error.response = response;
        throw error;
      }
    })
    .then((response) => response.json())
    .then((response) => {
      dispatch(followingSuccess(response));
      return response.follow;
    })
    .then((response) => {
      dispatch(storyLoading());
      //let QUERY = JSON.parse(localStorage.getItem('id'));
      let nss = response.filter(
        (us) =>
          us.id.stories[0] &&
          us.id.stories.find(
            (h) =>
              measure(h.timestamp) <= 13240 &&
              !h.views.some((v) => v === QUERY)
          )
      );
      let ss = response.filter(
        (us) =>
          us.id.stories[0] &&
          us.id.stories.every(
            (h) =>
              measure(h.timestamp) <= 13240 &&
              h.views.some((v) => v === QUERY)
          )
      );

      let measureNoSeenStory = !nss
        ? null
        : nss.map((u) =>
          u.id.stories.filter((s) => measure(s.timestamp) <= 13240)
        );
      let filterMeasureNoSeenStory = measureNoSeenStory.filter(
        (n) => n.length > 0
      );
      let measureSeenStory = !ss
        ? null
        : ss.map((u) =>
          u.id.stories.filter((s) => measure(s.timestamp) <= 13240)
        );
      let filterMeasureSeenStory = measureSeenStory.filter((n) => n.length > 0);
      const storyStore = {
        users: {
          noSeen: nss,
          seen: ss,
        },
        stories: {
          noSeen: filterMeasureNoSeenStory,
          seen: filterMeasureSeenStory,
        },
      };
      return storyStore;
    })
    .then((list) => {
      dispatch(receiveStory(list));
    })
    .catch((error) => dispatch(followingError(error.message)));
};
export const followingLoading = () => {
  return {
    type: ActionTypes.FOLLOWING_LOADING,
  };
};

export const followingSuccess = (following) => {
  return {
    type: ActionTypes.FOLLOWING_SUCCESS,
    payload: following,
  };
};

export const followingError = (message) => {
  return {
    type: ActionTypes.FOLLOWING_ERROR,
    ERR: message,
  };
};

//DELETE IMAGE AND VIDEO WALL
export const removePhotograph = (imgId) => async dispatch => {
  dispatch(userLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `imagen/removeimage`, {
    method: "POST",
    body: JSON.stringify(imgId),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error("Setting Error " + response.status + ": " + response.statusText);
      error.response = response;
      throw error;
    }
  }, error => {
    var errmess = new Error(error.message);
    throw errmess;
  }
  )
    .then(data => data.json())
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

export const removeVideo = (imgId) => async dispatch => {
  dispatch(userLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `imagen/removevideo`, {
    method: "POST",
    body: JSON.stringify(imgId),
    headers: {
      "Content-Type": "application/json",
      'Authorization': bearer
    }
  })
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      var error = new Error("Setting Error " + response.status + ": " + response.statusText);
      error.response = response;
      throw error;
    }
  }, error => {
    var errmess = new Error(error.message);
    throw errmess;
  }
  )
    .then(data => data.json())
    .then(json => {
      dispatch(receiveUser(json));
    })
    .catch(error => dispatch(receiveUserError(error)));
}

//REGISTER POST DATA
export const signupUser = (User) => (dispatch) => {
  const newUser = {
    username: User.username,
    password: User.password,
    date: User.date,
    sex: User.sex,
    country: User.country,
  };

  return fetch(baseUrl + 'users/signup', {
    method: 'POST',
    body: JSON.stringify(newUser),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      const Resp = response.status;
      dispatch(responseSignup(Resp));
    })
    .catch((error) => {
      const Err = error.status;
      dispatch(errorSignup(Err));
    });
};
export const responseSignup = (creds) => {
  return {
    type: ActionTypes.SIGNUP_SUCCESS,
    payload: creds,
  };
};
export const errorSignup = (creds) => {
  return {
    type: ActionTypes.SIGNUP_FAILURE,
    payload: creds,
  };
};

//Settings fetch

export const settingsUser = (userID, Settings) => async (dispatch) => {
  const settingsUser = {
    firstname: Settings.firstname,
    lastname: Settings.lastname,
    phrase: Settings.phrase,
    status: Settings.status,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + 'users/settings/' + userID, {
    method: 'PUT',
    body: JSON.stringify(settingsUser),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Setting Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      const Resp = response.status;
      dispatch(responseSettings(Resp));

      dispatch(receiveUser(response.user));
      //await dispatch(fetchUser(userID));
    })
    .catch((error) => {
      const Err = error.status;
      dispatch(errorSettings(Err));
    });
};

export const responseSettings = (creds) => {
  return {
    type: ActionTypes.SETTINGS_SUCCESS,
    payload: creds,
  };
};
export const errorSettings = (creds) => {
  return {
    type: ActionTypes.SETTINGS_FAILURE,
    payload: creds,
  };
};

//IMAGEN FETCH

export const imagenUser = (userID, image) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + 'imagen/profile-image-post/change/' + userID, {
    method: 'POST',
    body: image,
    headers: {
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Image Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      console.log('response');
      //dispatch(fetchUser(userID));
    })
    .catch((error) => {
      console.log('SETTINGS ERROR');
    });
};

//IMAGEN WALL FETCH

export const imagenWall = (userID, image) => async (dispatch) => {

  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + "imagen/imageswall/" + userID, {
    method: "POST",
    body: image,
    headers: {
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      return response
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};

//STORIES
export const storiesCreator = (userID, image) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + "imagen/story-post/" + userID, {
    method: "POST",
    body: image,
    headers: {
      'Authorization': bearer
    },
    credentials: "same-origin"
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error("Image Error " + response.status + ": " + response.statusText);
        error.response = response;
        throw error;
      }
    },
      error => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then(response => {
      return response
    })
    .catch(error => {
      console.log("SETTINGS ERROR");
    });
};

//FETCH IMAGEN AND COMMENTS TO ImagenComponent
export const imagenFetch = (image) => async (dispatch) => {
  dispatch(imagenLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `imagen/view/imagenwall/${image}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Image Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((img) => {
      dispatch(imagenFetchComments(image, img));
    })
    .catch((error) => {
      dispatch(imagenError(error));
    });
};

export const imagenFetchComments = (imageId) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  // const DATA = {
  //   imagen: imgObj,
  //   comments: null
  // }
  return fetch(baseUrl + `comments/get-comments-image/${imageId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Image Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((comments) => {
      return comments;
    })
    .catch((error) => {
      console.error(error);
    });
};
export const imagenLoading = () => {
  return {
    type: ActionTypes.IMAGEN_LOADING,
  };
};

export const imagenSuccess = (users) => {
  return {
    type: ActionTypes.IMAGEN_SUCCESS,
    payload: users,
  };
};

export const imagenError = (message) => {
  return {
    type: ActionTypes.IMAGEN_FAILED,
    payload: message,
  };
};

//GET Users notifications
export const fetchNotifications = () => async (dispatch) => {
  dispatch(notifLoading());
  const creds = JSON.parse(await AsyncStorage.getItem('creds'));
  const username = creds.username;
  const tok = await AsyncStorage.getItem('token');
  const bearer = `Bearer ${JSON.parse(tok)}`;
  const QUERY = username;
  return fetch(baseUrl + `notification/user-notifications/get/${QUERY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          'Error ' + response.status + ': ' + response.statusText
        );
        error.response = response;
        throw error;
      }
    })
    .then((response) => response.json())
    .then((response) => {
      dispatch(nofifSuccess(response));
    })
    .catch((error) => dispatch(notifError(error.message)));
};
export const notifLoading = () => {
  return {
    type: ActionTypes.NOTIFICATION_LOADING,
  };
};

export const nofifSuccess = (users) => {
  return {
    type: ActionTypes.NOTIFICATION_SUCCESS,
    payload: users,
  };
};

export const notifError = (message) => {
  return {
    type: ActionTypes.NOTIFICATION_ERROR,
    ERR: message,
  };
};

//FOLLOWER

export const followFetch = (followingId, followerId) => async (dispatch) => {
  const data = {
    followingId: followingId,
    message: 'Friend Request',
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `notification/following-user/send/${followerId}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Setting Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));
};

//FOLLOWER ACEPTAR/RECHAZAR SOLICITUD

export const friendRequestResponse = (dataNotification) => async (dispatch) => {
  const idUser = await AsyncStorage.getItem('id');
  const ID = JSON.parse(idUser);
  const data = {
    action: dataNotification.action,
    followingId: ID,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;

  return fetch(
    baseUrl +
    `notification/following-request/${dataNotification.followerId}/${dataNotification.notiId}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
      },
      credentials: 'same-origin',
    }
  )
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Setting Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));
};

//CHANGE THE NOTIFICATION STATUS OF REDUX STORE

export const readStatusHandle = () => {
  return {
    type: ActionTypes.NOTIFICATION_STATUS,
  };
};
export const handleNotificationStatus = () => (dispatch) => {
  dispatch(readStatusHandle());
};

//COMMENTS POST

export const commentsPost = (dataComment) => async (dispatch) => {
  dispatch(messageUpdateLoading())
  const newComment = {
    comment: dataComment.comment,
    author: dataComment.author,
    image: dataComment.image,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return (
    fetch(baseUrl + 'comments/post-comment', {
      method: 'POST',
      body: JSON.stringify(newComment),
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
      },
      credentials: 'same-origin',
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              'Error ' + response.status + ': ' + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          var errmess = new Error(error.message);
          throw errmess;
        }
      )
      .then((response) => response.json())
      .then(comments => {
        dispatch(messageUpdateSuccess(comments))
      })
      .catch((error) => dispatch(messageUpdateError(error.message)))
  );
};
export const messageUpdateLoading = () => {
  return {
    type: ActionTypes.MESSAGEUPDATE_LOADING,
  };
};

export const messageUpdateSuccess = (messageUpdate) => {
  return {
    type: ActionTypes.MESSAGEUPDATE_SUCCESS,
    payload: messageUpdate,
  };
};

export const messageUpdateError = (messageUpdate) => {
  return {
    type: ActionTypes.MESSAGEUPDATE_ERROR,
    ERR: messageUpdate,
  };
};

export const fetchComments = (imgId) => async (dispatch) => {
  dispatch(messageUpdateLoading())
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `comments/get-comments-image/${imgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then(comments => {
      dispatch(messageUpdateSuccess(comments))
    })
    .catch((error) => dispatch(messageUpdateError(error.message)))
};

// LIKE FETCH
export const fetchUsersLikes = async (imgId) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `likes/get-i-like-it/${imgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then((likes) => likes)
    .catch((error) => console.error(error.message));
};

export const fetchPhotoNativeLikes = (id) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `likes/native-get-i-like-it/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then((response) => response.json())
    .then((s) => {
      //dispatch(addlikes(s))
      return s;
    })
    .catch((error) => console.error(error.message));
};
export const fetchVideoNativeLikes = (imgId) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `likes/native-get-i-like-it-video/${imgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((likes) => dispatch(addlikes(likes)))
    .catch((error) => dispatch(likesFailed(error.message)));
};
// LIKE POST
export const postLike = (imageid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;

  return fetch(baseUrl + 'likes/post-i-like-it/' + (await imageid), {
    method: 'POST',
    body: JSON.stringify(DATA),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((like) => {
      console.log('Favorite Added');
    }) //dispatch(addFavorites(favorites)); })
    .catch((error) => console.log(error.message)); //dispatch(favoritesFailed(error.message)));
};

export const fetchLikes = (userId, imgId) => async (dispatch) => {
  //dispatch(likesLoading());
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `likes/get-i-like-it/${userId}/${imgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((likes) => dispatch(addlikes(likes)))
    .catch((error) => dispatch(likesFailed(error.message)));
};
export const likesLoading = () => ({
  type: ActionTypes.LIKES_LOADING,
});

export const likesFailed = (errmess) => ({
  type: ActionTypes.LIKES_FAILED,
  payload: errmess,
});

export const addlikes = (likes) => ({
  type: ActionTypes.LIKES_ADD,
  payload: likes,
});
export const postImageLike = (imageid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;

  return fetch(baseUrl + 'likes/native-post-i-like-it/', {
    method: 'POST',
    body: JSON.stringify(DATA),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((like) => {
      //console.log('Favorite Added', like)
      return like;
    }) //dispatch(addFavorites(favorites)); })
    .catch((error) => console.log(error.message)); //dispatch(favoritesFailed(error.message)));
};
export const postVideoLike = (videoid, usersData) => async (dispatch) => {
  var DATA = {
    id: await usersData.id,
    liked: await usersData.liked,
  };
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + 'likes/native-post-i-like-it-video/', {
    method: 'POST',
    body: JSON.stringify(DATA),
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((like) => {
      console.log('Favorite Added', like);
      return like;
    }) //dispatch(addFavorites(favorites)); })
    .catch((error) => console.log(error.message)); //dispatch(favoritesFailed(error.message)));
};

const measure = (timestamp) => {
  let inicio = new Date(timestamp).getTime();
  let now = Date.now();
  let res = now - inicio;
  const hours = Math.floor(res / 1000) / 3600;
  return hours;
};

export const storyLoading = () => ({
  type: ActionTypes.STORY_LOADING,
});

export const receiveStory = (response) => {
  return {
    type: ActionTypes.STORY_SUCCESS,
    story: response,
  };
};
export const receiveStoryError = (error) => {
  return {
    type: ActionTypes.STORY_FAILED,
    errMess: error,
  };
};

export const storiesView = (userID, image) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;

  return fetch(baseUrl + `imagen/story-view/${userID}/${image}`, {
    method: 'POST',
    headers: {
      Authorization: bearer,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Image Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      console.log('response', response);
    })
    .catch((error) => {
      console.log('SETTINGS ERROR');
    });
};
//STORIES

export const getFollows = (type, userId) => async (dispatch) => {
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `users/fetch-${type}/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((follow) => {
      return follow;
    }) //dispatch(addFavorites(favorites)); })
    .catch((error) => console.log(error.message)); //dispatch(favoritesFailed(error.message)));
};
export const getInboxFollows = () => async (dispatch) => {
  dispatch(inboxFollowsLoading());
  const idAsync = await AsyncStorage.getItem('id');
  const userId = JSON.parse(idAsync);
  const tok = await AsyncStorage.getItem('token');
  const token = JSON.parse(tok);
  const bearer = `Bearer ${token}`;
  return fetch(baseUrl + `users/fetch-inbox-follows/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
    credentials: 'same-origin',
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((inboxFollows) => {
      // const message = inbox.some((i) =>
      //   i.talk.some((t) => t.author !== QUERY && t.seen === false)
      // );
      dispatch(inboxFollowsSuccess(inboxFollows));
    })
    .catch((error) => dispatch(inboxFollowsError(error.message)));
};
export const inboxFollowsLoading = () => {
  return {
    type: ActionTypes.INBOXFOLLOWS_LOADING,
  };
};

export const inboxFollowsSuccess = (follows) => {
  return {
    type: ActionTypes.INBOXFOLLOWS_SUCCESS,
    payload: follows
  };
};

export const inboxFollowsError = (message) => {
  return {
    type: ActionTypes.INBOXFOLLOWS_ERROR,
    ERR: message
  };
};

// export const socketConnection = (io) => async (dispatch) => {
//   dispatch(socketIOLoading());
  
//   const socket = await io(baseUrl);
//   dispatch(socketIOSuccess(socket));
//     // .then((response) => response.json())
//     // .then((inboxFollows) => {
//     //   // const message = inbox.some((i) =>
//     //   //   i.talk.some((t) => t.author !== QUERY && t.seen === false)
//     //   // );
//     //   dispatch(socketIOSuccess(inboxFollows));
//     // })
//     // .catch((error) => dispatch(socketIOError(error.message)));
// };
// export const socketIOLoading = () => {
//   return {
//     type: ActionTypes.SOCKETIO_LOADING,
//   };
// };

// export const socketIOSuccess = (socket) => {
//   return {
//     type: ActionTypes.SOCKETIO_SUCCESS,
//     payload: socket
//   };
// };

// export const socketIOError = (error) => {
//   return {
//     type: ActionTypes.SOCKETIO_ERROR,
//     errMess: error
//   };
// };