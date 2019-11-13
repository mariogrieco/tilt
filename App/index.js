import React from 'react';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import ChannelJoinModalAlert from './components/ChannelJoinModalAlert';
import {PersistGate} from 'redux-persist/lib/integration/react';
import PostBottomActions from './components/PostBottomActions';
import PostMediaModal from './components/PostMediaModal';
import Navigator from './config/Navigator';
import NavigationService from './config/NavigationService';
import store, {persistor} from './config/store';
import styles from './config/styles';
import {init} from './api/Sockets';
import pushNotification from './push_notifications/firebase_client';
import translator from './push_notifications/translator';

styles();
init();

class App extends React.PureComponent {
  async componentDidMount() {
    SplashScreen.hide();
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
          <PostBottomActions />
          <PostMediaModal />
          <ChannelJoinModalAlert />
          {/* <DeepLinking /> */}
          <Navigator
            ref={navigatorRef => {
              if (navigatorRef) {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
