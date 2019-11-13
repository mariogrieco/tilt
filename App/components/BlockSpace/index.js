import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

const BlockSpace = ({theme}) => (
  <View
    style={[
      styles.block,
      {
        backgroundColor: theme.secondaryBackgroundColor,
        borderTopColor: theme.borderBottomColor,
        borderBottomColor: theme.borderBottomColor,
      },
    ]}
  />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(BlockSpace);
