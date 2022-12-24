import * as ActionTypes from './ActionTypes';

export const Start = (state = {
    isLoading: false,
    errMess: null,
    start: null
}, action) => {
    switch (action.type) {
        case ActionTypes.START_ADD:
            return { ...state, isLoading: false, errMess: null, start: action.payload };

        case ActionTypes.START_LOADING:
            return { ...state, isLoading: true, errMess: null, start: null };

        case ActionTypes.START_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, start: null };

        default:
            return state;
    }
}