import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

const TopBlockSpace = ({theme}) => (
  <View
    style={[
      styles.block,
      {
        backgroundColor: theme.secondaryBackgroundColor,
        borderBottomColor: theme.borderBottomColor,
      },
    ]}
  />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(TopBlockSpace);
