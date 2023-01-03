import * as ActionTypes from "./ActionTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const Auth = (
  state = {
    isLoading: true,
    isAuthenticated: AsyncStorage.getItem("token") ? true : false,
    token: AsyncStorage.getItem("token"),
    user: AsyncStorage.getItem("creds")
      ? AsyncStorage.getItem("creds")
      : null,
    errMess: null,
    id: AsyncStorage.getItem("id")
  },
  action
) => {
  switch (action.type) {
        case ActionTypes.TOKEN_LOADING:
      return {
        ...state,
        isLoading: true
      };
      case ActionTypes.TOKEN_CHECK:
      return {
        ...state,
        isLoading: false
      };
    case ActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        user: action.creds
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        errMess: "",
        token: action.token,
        user: action.userdata.userdata
      };
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        errMess: action.errMess
      };
    case ActionTypes.LOGOUT_REQUEST:
      return { ...state, isLoading: true, isAuthenticated: true };
    case ActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        id: "",
        token: "",
        user: null
      };
      case ActionTypes.RELOAD_AUTH:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.isAuthenticated ? true : false, 
        id: action.payload.id,
        token: action.payload.token,
        user: action.payload.user
      };
    default:
      return state;
  }
};
