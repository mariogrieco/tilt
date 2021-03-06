import React from 'react';
import {View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';

const styles = {
  line: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
};

const Separator = ({theme}) => (
  <View style={[styles.line, {backgroundColor: theme.borderBottomColor}]} />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Separator);
