import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {WebView} from 'react-native-webview';
import {ActivityIndicator} from 'react-native';
import GoBack from '../components/GoBack';
import {NavigationActions} from 'react-navigation';

class ViewWeb extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', ''),
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
  });

  render() {
    const {navigation} = this.props;
    return (
      <WebView
        renderLoading={() => <ActivityIndicator />}
        scrollEnabled
        source={{uri: navigation.getParam('uri')}}
      />
    );
  }
}

const mapStateToProps = state => ({
  uri: state.webView,
});

export default connect(
  mapStateToProps,
  null,
)(ViewWeb);
