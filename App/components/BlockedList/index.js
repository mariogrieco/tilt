import React, {Component} from 'react';
import {View, Image, Text, ScrollView} from 'react-native';
// import GoBack from '../GoBack';
import {addOrRemoveOne} from '../../actions/blockedUsers';
// import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import isEqual from 'lodash/isEqual';
// const BACK = require('../../../assets/images/pin-left-black/pin-left.png');

import styles from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

class BlockedList extends Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  _addOrRemoveOne = user_id => {
    if (this.state.loading) {
      return false;
    }

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          this.props.addOrRemoveOne(user_id);
        } catch (er) {
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  renderItem({id, last_picture_update, username}) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.profileImage, {resizeMode: 'cover'}]}
            source={{
              uri: getUserProfilePicture(id, last_picture_update),
            }}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <TouchableOpacity onPress={this._addOrRemoveOne.bind(this, id)}>
          <Text style={styles.unlock}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        style={{
          width: '100%',
          paddingRight: 0,
          backgroundColor: '#F6F7F9',
        }}>
        {this.props.users.map(user => this.renderItem(user))}
      </ScrollView>
    );
  }
}

const mapStateToProps = {
  addOrRemoveOne,
};

const mapDispatchToProps = state => {
  return {
    users: Object.keys(state.blockedUsers)
      .map(key => state.users.data[key])
      .filter(i => i),
  };
};

export default connect(
  mapDispatchToProps,
  mapStateToProps,
)(BlockedList);
