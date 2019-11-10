import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';

const Interval = ({tag, selected, onPress, theme}) => (
  <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor: selected
          ? theme.intervalSelectedBackgroundColor
          : theme.intervalUnselectedBackgroundColor,
      },
    ]}
    onPress={onPress}>
    <Text
      style={[
        styles.text,
        {
          color: selected
            ? theme.intervalSelectedTextColor
            : theme.intervalUnselectedTextColor,
        },
      ]}>
      {tag}
    </Text>
  </TouchableOpacity>
);

Interval.defaultProps = {
  selected: false,
};

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Interval);
