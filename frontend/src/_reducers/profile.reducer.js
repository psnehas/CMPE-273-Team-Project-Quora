import { userConstants } from '../_constant';

const initialState = {
    user_info: {
        avatar: "",
        first_name: "",
        last_name: "",
        profileCredential: "",
        about: "",
        email: "",
        city: "",
        state: "",
        zipCode: "",
        educations: [],
        careers: []
    },
    created_answers: [],
    bookmarked_answers: [],
    created_questions: [],
    followed_people: [],
    following_people: []
}

const profile_update = (state = initialState, action) => {
    switch (action.type) {
        case userConstants.PROFILE_UPDATE:
            let user_info = {
                ...state.user_info,
                ...action.data
            };
            let new_state = {
                ...state,
                user_info: user_info
            }
            return new_state
            break;
        default:
            return state;
            break;
    }
}

export { profile_update as profile };