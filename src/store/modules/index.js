import {combineReducers} from 'redux';
import user from './user';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

const reducer = combineReducers({
  user,
});

const persisConfig = {
  key:'root',
  storage,
  whitelist: ['user']
};

const rootReducer = persistReducer(persisConfig, reducer)

export default rootReducer;