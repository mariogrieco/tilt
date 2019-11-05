import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';

import styles from './styles';

const PLUS_BOX = require('../../../assets/themes/light/plus-box/plus-box.png');

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
    return (
      <TouchableOpacity
        style={styles.filterPopulateItem}
        onPress={this.handlePress}>
        <View style={styles.headerContainer}>
          <Image source={PLUS_BOX} />
          <Text style={styles.labelHeader}>{this.getHeaderLabel()}</Text>
        </View>
        <Text style={styles.labelBody}>{this.getBodyLabel()}</Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterPopulateItem);
