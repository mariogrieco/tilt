import React, {Component} from 'react';
import {View, Image, Text, ScrollView} from 'react-native';
import {withNavigation} from 'react-navigation';
import {
  addOrRemoveOne,
  getBlockUserListForUserId,
} from '../../actions/blockedUsers';
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
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: theme.primaryBackgroundColor,
            borderColor: theme.borderBottomColor,
          },
        ]}>
        <View style={styles.imageContainer}>
          <Image
            style={[styles.profileImage, {resizeMode: 'cover'}]}
            source={{
              uri: getUserProfilePicture(id, last_picture_update),
            }}
          />
          <Text style={[styles.username, {color: theme.primaryTextColor}]}>
            {username}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._addOrRemoveOne.bind(this, id)}>
          <Text style={styles.unlock}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  }

  fetchList() {
    if (this.state.loadingList) {
      return true;
    }

    const {whoIam} = this.props;
    this.setState(
      {
        loadingList: true,
      },
      () => {
        try {
          this.props.getBlockUserListForUserId(whoIam);
        } catch (er) {
        } finally {
          this.setState({
            loadingList: false,
          });
        }
      },
    );
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('didFocus', () => {
      this.fetchList();
    });
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  render() {
    const {theme} = this.props;
    return (
      <ScrollView
        style={{
          width: '100%',
          paddingRight: 0,
          backgroundColor: theme.secondaryBackgroundColor,
        }}>
        {this.props.users.map(user => this.renderItem(user))}
      </ScrollView>
    );
  }
}

const mapStateToProps = {
  addOrRemoveOne,
  getBlockUserListForUserId,
};

const mapDispatchToProps = state => {
  return {
    users: Object.keys(state.blockedUsers)
      .map(key => state.users.data[key])
      .filter(i => i),
    whoIam: state.login.user ? state.login.user.id : null,
    theme: state.themes[state.themes.current],
  };
};

export default withNavigation(
  connect(
    mapDispatchToProps,
    mapStateToProps,
  )(BlockedList),
);
