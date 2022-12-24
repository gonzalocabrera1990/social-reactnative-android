import * as ActionTypes from "./ActionTypes";

export const Users = (
  state = {
    isLoading: false,
    errMess: null,
    users: null
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.USERS_SUCCESS:
      //Se usa el {...state} para iterar sobre las propiedades
      //declaradas en el state. Luego se le asignan los valores del caso.
      return { ...state, isLoading: false, errMess: null, users: action.user };

    case ActionTypes.USERS_LOADING:
      return { ...state, isLoading: true, errMess: null, users: null };

    case ActionTypes.USERS_ERROR:
      return {
        ...state,
        isLoading: false,
        errMess: action.errMess,
        users: null
      };

    default:
      return state;
  }
};
