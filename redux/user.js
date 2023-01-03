import * as ActionTypes from "./ActionTypes";

export const User = (
  state = {
    isLoading: true,
    errMess: null,
    user: null
  },
  action
) => {
  switch (action.type) {
      case ActionTypes.USER_CHECK:
      return { ...state, isLoading: false, errMess: null, user: null };
    case ActionTypes.USER_SUCCESS:
      //Se usa el {...state} para iterar sobre las propiedades
      //declaradas en el state. Luego se le asignan los valores del caso.
      return { ...state, isLoading: false, errMess: null, user: action.user };

    case ActionTypes.USER_LOADING:
      return { ...state, isLoading: true, errMess: null, user: null };

    case ActionTypes.USER_ERROR:
      return {
        ...state,
        isLoading: false,
        errMess: action.errMess,
        user: null
      };

    default:
      return state;
  }
};
