import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import {getPostCount} from '../../actions/postCount';
import num_format from '../../utils/numberFormat';
import isEqual from 'lodash/isEqual';

import styles from './styles';

export class PostsSummary extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

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
    const {countForUser, theme} = this.props;
    return (
      <View>
        <Text style={[styles.posts, {color: theme.secondaryTextColor}]}>
          <Text style={[styles.bold, {color: theme.primaryTextColor}]}>
            {countForUser ? num_format(countForUser) : ' '}
          </Text>{' '}
          Posts & Reactions
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
    theme: state.themes[state.themes.current],
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
