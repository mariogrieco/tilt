import React from 'react';
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

const styles = {
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DCDCDC',
    width: 285,
    alignSelf: 'center',
  },
};

const InputSeparator = ({customStyles}) => (
  <View style={[styles.line, customStyles]} />
);

export default InputSeparator;
