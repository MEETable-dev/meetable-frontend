import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './modules';
import { persistStore } from 'redux-persist';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    // if (__DEV__) {
    //   const createDebugger = require('redux-flipper').default;
    //   return getDefaultMiddleware().concat(createDebugger());
    // }
    return getDefaultMiddleware();
  },
});

export const persistor = persistStore(store);

export default store;
export const useAppDispatch = () => useDispatch();
