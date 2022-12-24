import * as ActionTypes from "./ActionTypes";

export const Signup = (
  state = {
    errMess: null,
    successMess: null
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SIGNUP_SUCCESS:
      return { ...state, errMess: null, successMess: action.payload };
    case ActionTypes.SIGNUP_FAILURE:
      return { ...state, errMess: action.payload, successMess: null };

    default:
      return state;
  }
};
