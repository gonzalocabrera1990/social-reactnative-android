import * as ActionTypes from './ActionTypes';

export const Following = (state = {
    isLoading: true,
    following: [],
    errmessage: null
}, action) => {
    switch (action.type) {
        case ActionTypes.FOLLOWING_LOADING:
            return {
                ...state,
                isLoading: true,
                following: [],
                errmessage: null

            }
        case ActionTypes.FOLLOWING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                following: action.payload.follow,
                errmessage: null
            }
        case ActionTypes.FOLLOWING_ERROR:
            return {
                ...state,
                iisLoading: false,
                following: [],
                errmessage: action.ERR
            }
        default:
            return state
    }
}