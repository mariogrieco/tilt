import wsClient from 'mattermost-redux/client/websocket_client';
import store from '../config/store';
import Sync from '../config/SyncApp';
import EventTranslator from '../actions/EventTranslator';
import {
  setCloseState,
  setConnectedState,
  setConnectingState,
  setErrorState,
  setReconnectState,
} from '../actions/socketStatus';

import {socketURL} from './MattermostClient';

wsClient.setConnectingCallback(msg => {
  console.log('setConnectingCallback');
  store.dispatch(setConnectingState(msg));
});

wsClient.setReconnectCallback(msg => {
  store.dispatch(setReconnectState(msg));
  Sync.init(store.dispatch);
  console.log('setReconnectCallback');
});

wsClient.setErrorCallback(msg => {
  store.dispatch(setErrorState(msg));
  console.log('setErrorCallback');
});

wsClient.setCloseCallback(msg => {
  store.dispatch(setCloseState(msg));
  console.log('setCloseCallback');
});

wsClient.setEventCallback(event => {
  console.log(event);
  EventTranslator(event);
});

wsClient.setFirstConnectCallback(msg => {
  store.dispatch(setConnectedState(msg));
  console.log('setFirstConnectCallback!! ');
});

const init = () => {
  try {
    wsClient.close(true);
    wsClient.initialize('', {
      connectionUrl: socketURL,
      forceConnection: true,
    });
  } catch (ex) {
    store.dispatch(setErrorState(ex.message));
    console.log(ex);
  }
};

export default init;
export {init};
