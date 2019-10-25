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

styles();
init();

class App extends React.PureComponent {
  componentDidMount() {
    SplashScreen.hide();
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
