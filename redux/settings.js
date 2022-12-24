import * as ActionTypes from "./ActionTypes";

export const Settings = (
  state = {
    errMess: null,
    successMess: null
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SETTINGS_SUCCESS:
      return { ...state, errMess: null, successMess: action.payload };
    case ActionTypes.SETTINGS_FAILURE:
      return { ...state, errMess: action.payload, successMess: null };

    default:
      return state;
  }
};
