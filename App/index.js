import React from 'react';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {PersistGate} from 'redux-persist/lib/integration/react';
import ThemeWrapper from './components/ThemeWrapper';
import store, {persistor} from './config/store';
import {init} from './api/Sockets';

init();

class App extends React.PureComponent {
  componentDidMount() {
    SplashScreen.hide();
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
