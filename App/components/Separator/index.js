import React from 'react';
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

const styles = {
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DCDCDC',
    width: '100%',
  },
};

const Separator = ({customStyles}) => (
  <View style={[styles.line, customStyles]} />
);

export default React.memo(Separator);
