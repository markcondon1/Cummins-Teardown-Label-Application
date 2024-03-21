import {GET_USER,SET_USER,RESET_USER, AUTHENTICATE_USER} from "../actionTypes/user";

const initialHistory ={
    firstname: '',
    lastname: '',
    userid: '',
    userAuth: false,

}

const userReducer = (state = initialHistory, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                userid: action.payload.userid
            };
        case RESET_USER:
            return initialHistory;
        case AUTHENTICATE_USER:
            return {
                ...state,
                userAuth: action.payload.userAuth,
            };
        default:
            return state;
    }
};

export default userReducer;