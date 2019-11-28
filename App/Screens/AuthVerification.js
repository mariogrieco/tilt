import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

class AuthVerification extends React.Component {
  componentDidMount() {
    const {navigation, login} = this.props;

    navigation.navigate(login.user ? 'App' : 'Auth');
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#17C491" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

const mapStateToProps = ({login}) => ({login});

export default connect(mapStateToProps)(AuthVerification);
