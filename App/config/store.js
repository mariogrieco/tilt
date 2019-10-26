import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-community/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
// import logger from 'redux-logger';
import Sync from './SyncApp';
import reducers from '../reducers';

let store = null;
// Middleware: Redux Persist Config
const persistConfig = {
  // Root?
  key: 'BC0X2',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  blacklist: [],
  // Blacklist (Don't Save Specific Reducers)
  whitelist: [
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
    'users',
    'displayUserProfile',
    'teams',
    'preferences',
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
      compose(
        applyMiddleware(
          // require('redux-immutable-state-invariant').default(),
          thunk,
          // logger,
        ),
      ),
    );
    Sync.init(store.dispatch);
  }
  return store;
})();

export const persistor = persistStore(store);
