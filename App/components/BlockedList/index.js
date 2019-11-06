import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import {addOrRemoveOne} from '../../actions/blockedUsers';
import {connect} from 'react-redux';

// import styles from './styles';

class BlockedList extends PureComponent {
  _addOrRemoveOne = () => {};

  render() {
    const {users} = this.props;
    console.log(users);
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const mapStateToProps = {
  addOrRemoveOne,
};

const mapDisptchToProps = state => {
  return {
    blockMapped: state.blockedUsers,
    users: Object.keys(state.blockedUsers).map(key => state.blockedUsers[key]),
  };
};

export default connect(
  mapStateToProps,
  mapDisptchToProps,
)(BlockedList);
