import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';

import styles from './styles';
import assets from '../../config/themeAssets/assets';

export class FilterPopulateItem extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['channel', 'user']).isRequired,
    onPress: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  getBodyLabel() {
    const {type} = this.props;
    switch (type) {
      case 'channel': {
        return 'to find posts in specific channels';
      }
      case 'user': {
        return 'to find posts from specific users';
      }
      default: {
        return 'undefined type';
      }
    }
  }

  getHeaderLabel() {
    const {type} = this.props;
    switch (type) {
      case 'user': {
        return 'from: username';
      }
      case 'channel': {
        return 'in: channel-name';
      }
      default: {
        return 'undefined type';
      }
    }
  }

  handlePress = () => {
    this.props.onPress();
  };

  render() {
    const {theme, themeName} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.filterPopulateItem,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}
        onPress={this.handlePress}>
        <View
          style={[
            styles.headerContainer,
            {backgroundColor: theme.primaryBackgroundColor},
          ]}>
          <Image source={assets[themeName].PLUS_BOX} />
          <Text style={[styles.labelHeader, {color: theme.primaryTextColor}]}>
            {this.getHeaderLabel()}
          </Text>
        </View>
        <Text style={[styles.labelBody, {color: theme.secondaryTextColor}]}>
          {this.getBodyLabel()}
        </Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
  themeName: state.themes.current,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterPopulateItem);
