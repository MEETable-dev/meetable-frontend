// import { createSlice } from '@reduxjs/toolkit'

const SET_TOKEN = "user/SET_TOKEN";
// const SET_USER = "user/SET_USER";
export const setToken = accessToken => ({type : SET_TOKEN, accessToken});

const initialState = {
  email:"",
  accessToken:"",
};

export default function user(state = initialState, action) {
  switch(action.type) {
    case SET_TOKEN:
      return {
        // ...state,
        accessToken: action.accessToken,
      };
    default:
      return state;
  }
}