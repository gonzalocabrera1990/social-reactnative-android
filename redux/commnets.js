import * as ActionTypes from './ActionTypes';

export const Comments = (state = {
    errMess: null,
    comments: []
}, action) => {
    switch (action.type) {
        case ActionTypes.COMMENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.ADD_COMMENT:
            var comment = action.payload;
            return { ...state, comments: state.comments.concat(comment) };

        default:
            return state;
    }
}