import wsClient from 'mattermost-redux/client/websocket_client';
// import Client4 from './MattermostClient';

import EventTranslator from '../actions/EventTranslator';

wsClient.setConnectingCallback((message) => {
  // alert('connection socket');
  console.log(message);
});

wsClient.setReconnectCallback((message) => {
  // alert('connection socket');
  console.log(message);
});

wsClient.setErrorCallback((err) => {
  // alert('err socket');
  console.log(err);
})

wsClient.setCloseCallback((message) => {
  // alert('close socket');
  console.log(message);
});

wsClient.setEventCallback((event) => {
  console.log('event!! ', event);
  EventTranslator(event);
});

wsClient.setFirstConnectCallback((event) => {
  console.log('setFirstConnectCallback!! ', event);
});

const init = () => {
  try {
    wsClient.close(true);
    wsClient.initialize('', {
      connectionUrl: 'wss://community.tiltchat.com/api/v4/websocket',
      forceConnection: true
    });
  } catch (ex) {
    console.log(ex);
  }
}

export default init;
export {
  init
}
