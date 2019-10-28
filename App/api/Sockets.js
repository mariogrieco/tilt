import wsClient from 'mattermost-redux/client/websocket_client';
import store from '../config/store';
import Sync from '../config/SyncApp';
import EventTranslator from '../actions/EventTranslator';
import {socketURL} from './MattermostClient';

wsClient.setConnectingCallback(() => {
  console.log('setConnectingCallback');
});

wsClient.setReconnectCallback(() => {
  Sync.init(store.dispatch);
  console.log('setReconnectCallback');
});

wsClient.setErrorCallback(() => {
  console.log('setErrorCallback');
});

wsClient.setCloseCallback(() => {
  console.log('setCloseCallback');
});

wsClient.setEventCallback(event => {
  EventTranslator(event);
});

wsClient.setFirstConnectCallback(() => {
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
    console.log(ex);
  }
};

export default init;
export {init};
