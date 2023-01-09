import * as ActionTypes from './ActionTypes';

export const MessageUpdate = (state = {
    isLoading: true,
    messageUpdate: [],
    errmessage: null
}, action) => {
    switch (action.type) {
        case ActionTypes.MESSAGEUPDATE_LOADING:
            return {
                ...state,
                isLoading: true,
                messageUpdate: [],
                errmessage: null

            }
        case ActionTypes.MESSAGEUPDATE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                messageUpdate: action.payload,
                errmessage: null
            }
        case ActionTypes.MESSAGEUPDATE_ERROR:
            return {
                ...state,
                isLoading: false,
                messageUpdate: [],
                errmessage: action.ERR
            }
        default:
            return state
    }
}