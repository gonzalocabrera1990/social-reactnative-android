import * as ActionTypes from './ActionTypes';

export const Followers = (state = {
    isLoading: null,
    followers: [],
    notif: [],
    errmessage: null
}, action) => {
    switch (action.type) {
        case ActionTypes.FOLLOWERS_LOADING:
            return {
                ...state,
                isLoading: true,
                followers: [],
                notif: [],
                errmessage: null

            }
        case ActionTypes.FOLLOWERS_SUCCESS:
            return {
                ...state,
                isLoading: null,
                followers: action.payload.follow,
                notif: action.payload.notif,
                errmessage: null
            }
        case ActionTypes.FOLLOWERS_ERROR:
            return {
                ...state,
                iisLoading: null,
                followers: [],
                notif: [],
                errmessage: action.ERR
            }
        default:
            return state
    }
}