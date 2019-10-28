import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getPostCount} from '../../actions/postCount';

import styles from './styles';

export class PostsSummary extends PureComponent {
  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('didFocus', () => {
      this._getPostCount();
    });
  }

  async _getPostCount() {
    try {
      const {getUserPostCount, userId} = this.props;
      await getUserPostCount(userId);
    } catch (er) {
      console.log(er);
    }
  }

  render() {
    const {countForUser, current} = this.props;
    console.log('countForUser:', current);
    return (
      <View>
        <Text style={styles.posts}>
          <Text style={styles.bold}>{countForUser} </Text>
          Posts
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userId: props.userId,
    countForUser: state.postCount[props.userId],
    current: state.postCount,
  };
};

const mapDispatchToProps = {
  getUserPostCount: getPostCount,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PostsSummary),
);
