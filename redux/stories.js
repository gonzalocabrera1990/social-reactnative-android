import * as ActionTypes from './ActionTypes';

export const Stories = (state = {
    isLoading: false,
    story: [],
    errmessage: null
}, action) => {
    switch (action.type) {
        case ActionTypes.STORY_LOADING:
            return {
                ...state,
                isLoading: true,
                story: [],
                errmessage: null

            }
        case ActionTypes.STORY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                story: action.story,
                errmessage: null
            }
        case ActionTypes.STORY_FAILED:
            return {
                ...state,
                isLoading: false,
                story: [],
                errmessage: action.errMess
            }
        default:
            return state
    }
}