import React, {Component} from 'react';
import {View, Text} from 'react-native';
import RoundedCheckbox from '../IconStore/RoundedCheckbox';
import Clock from '../IconStore/Clock';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';

import styles from './styles';

export class CurrentUserStatus extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const userStatus = this.props.userStatus;
    return (
      <View style={styles.bubble}>
        {userStatus === 'offline' && <Text>O</Text>}
        {userStatus === 'away' && <Clock />}
        {userStatus === 'online' && <RoundedCheckbox />}
      </View>
    );
  }
}

const mapStateToProps = (state, props) => ({
  userStatus: state.statuses.data[props.userId]
    ? state.statuses.data[props.userId].status
    : 'no-status',
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentUserStatus);
