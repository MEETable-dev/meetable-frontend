// import { createSlice } from '@reduxjs/toolkit'

const SET_TOKEN = "user/SET_TOKEN";
// const SET_USER = "user/SET_USER";
export const setToken = token => ({type : SET_TOKEN, token});

const initialState = {
  email:"",
  accessToken:"",
};

// const userSlice = createSlice({
//   name:'user',
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       state.accessToken = action.payload.accessToken;
//       state.email = action.payload.emial;
//     },
//     setToken(state, action) {
//       state.accessToken = action.payload.accessToken;
//     },
//   },
//   extraReducers: builder => {},
// });

// export default userSlice;

export default function user(state = initialState, action) {
  switch(action.type) {
    case SET_TOKEN:
      return {
        ...state,
        accessToken: action.token,
      };
    default:
      return state;
  }
}