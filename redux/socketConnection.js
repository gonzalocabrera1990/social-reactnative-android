import * as ActionTypes from './ActionTypes';

export const SocketConnection = (state = {
    isLoading: true,
    errMess: null,
    socketConnection: null
}, action) => {
    switch (action.type) {
        case ActionTypes.SOCKETIO_LOADING:
            return { ...state, isLoading: true };

        case ActionTypes.SOCKETIO_SUCCESS:
            return { ...state, socketConnection: state.payload, isLoading: false, errMess: null };

        case ActionTypes.SOCKETIO_ERROR:
            return { ...state, isLoading: false, errMess: action.errMess, socketConnection: null };


        default:
            return state;
    }
}