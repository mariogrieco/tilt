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

const NewMessageSeparator = ({theme}) => (
  <View style={[styles.line, {backgroundColor: theme.tiltRed}]} />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(NewMessageSeparator);
