import React from 'react';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {PersistGate} from 'redux-persist/lib/integration/react';
import ThemeWrapper from './components/ThemeWrapper';
import store, {persistor} from './config/store';
import {init} from './api/Sockets';
import pushNotification from './push_notifications/firebase_client';
import translator from './push_notifications/translator';

init();

class App extends React.PureComponent {
  state = {
    shouldRender: true,
  };

  async componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);

    await pushNotification.requirePermission(async () => {
      await pushNotification.requestPermissions();
    });

    await pushNotification.setMessageListener(msg => {
      console.log(msg);
      translator(msg._data, msg._messageId);
    });
  }

  componentWillUnmount() {
    pushNotification.removeMessageListener();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeWrapper />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
