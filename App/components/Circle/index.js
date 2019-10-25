import React from 'react';
import {View} from 'react-native';
import styles from './styles';

const Circle = props => {
  const {styles: customStyles} = props;
  return <View style={[styles.container, customStyles]} />;
};

export default Circle;
