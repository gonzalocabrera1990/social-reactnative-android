import * as ActionTypes from './ActionTypes';

export const Imagen = (state = {
    isLoading: true,
    errMess: null,
    imagen: null
}, action) => {
    switch (action.type) {
        case ActionTypes.IMAGEN_SUCCESS:
            return { ...state, isLoading: false, errMess: null, imagen: action.payload };

        case ActionTypes.IMAGEN_LOADING:
            return { ...state, isLoading: true, errMess: null, imagen: null };

        case ActionTypes.IMAGEN_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, imagen: null };

        default:
            return state;
    }
}