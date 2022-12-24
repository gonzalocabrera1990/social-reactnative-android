import * as ActionTypes from './ActionTypes';

export const InboxFollows = (state = {
    isLoading: true,
    follows: [],
    errmessage: null
}, action) => {
    switch (action.type) {
        case ActionTypes.INBOXFOLLOWS_LOADING:
            return {
                ...state,
                isLoading: true,
                follows: [],
                errmessage: null

            }
        case ActionTypes.INBOXFOLLOWS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                follows: action.payload,
                errmessage: null
            }
        case ActionTypes.INBOXFOLLOWS_ERROR:
            return {
                ...state,
                iisLoading: false,
                follows: [],
                errmessage: action.ERR
            }
        default:
            return state
    }
}