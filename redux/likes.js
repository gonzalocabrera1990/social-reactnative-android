import * as ActionTypes from './ActionTypes';

export const Likes = (state = {
    isLoading: true,
    errMess: null,
    likes: null
}, action) => {
    switch (action.type) {
        case ActionTypes.LIKES_ADD:
            return { ...state, isLoading: false, errMess: null, likes: action.payload };

        case ActionTypes.LIKES_LOADING:
            return { ...state, isLoading: true, errMess: null, likes: null };

        case ActionTypes.LIKES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, likes: null };

        default:
            return state;
    }
}