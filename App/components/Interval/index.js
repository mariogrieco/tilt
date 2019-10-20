import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const Interval = ({tag, selected, onPress}) => (
  <TouchableOpacity
    style={[styles.button, selected ? {backgroundColor: '#17C491'} : {}]}
    onPress={onPress}>
    <Text style={[styles.text, selected ? {color: '#fff'} : {}]}>{tag}</Text>
  </TouchableOpacity>
);

Interval.defaultProps = {
  selected: false,
};

export default Interval;
