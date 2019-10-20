import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage'; 
import { persistStore, persistReducer } from 'redux-persist';
import Client4 from '../api/MattermostClient';
// import logger from 'redux-logger';
import {
  loginSuccess,
  loginFailed
} from './../actions/login';
import {
  setNewSponsored,
  GET_SPONSORED_ERROR
} from '../actions/sponsored';

import reducers from '../reducers';

import moment from 'moment';

let store = null;
// Middleware: Redux Persist Config
const persistConfig = {
  // Root?
  key: 'BC3',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  blacklist: [
  ],
  // Blacklist (Don't Save Specific Reducers)
  whitelist: [
    'flagged',
    'watchlist',
    'channelStatsGroup',
    'history',
    'book',
    'miniChart',
    'candle',
    'depth',
    'login',
    'signUp',
    'modal',
    'channels',
    'myChannels',
    'posts',
    'users',
    'preferences',
    'displayUserProfile',
    'teams'
  ],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Middleware: Redux Persist Persister

export default (() => {
  if (!store) {
    store = createStore(
      persistedReducer,
      {},
      compose(applyMiddleware(
        // require('redux-immutable-state-invariant').default(),
        thunk,
        // logger,
      ))
    );
    Client4.getSponsored().then((str) => {
      if (!!str) {
        if (str.trim().length > 0) {
          store.dispatch(setNewSponsored(str));
        }
      }
    }).catch((ex) => {
      store.dispatch({
        type: GET_SPONSORED_ERROR,
        payload: ex
      });
    })

    Client4.getMe().then(user => {
      user.last_picture_update = moment().unix();
      store.dispatch(loginSuccess(user));
    }).catch(err => {
      store.dispatch(loginFailed(err));
    });
  }
  return store;
})();
export const persistor = persistStore(store);
