import {combineReducers} from 'redux';
// import userSlice from '../slices/user';
import user from '../slices/user';

const rootReducer = combineReducers({user});

export default rootReducer;