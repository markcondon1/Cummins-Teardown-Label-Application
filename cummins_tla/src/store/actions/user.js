import { SET_USER, RESET_USER, AUTHENTICATE_USER } from '../actionTypes/user';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const resetUser = () => ({
    type: RESET_USER,
});

export const userAuth = (user) => ({
    type: AUTHENTICATE_USER,
    payload: user,
})
