import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

const TopBlockSpaceSmall = ({theme}) => (
  <View
    style={[
      styles.block,
      {
        borderBottomColor: theme.borderBottomColor,
        backgroundColor: theme.secondaryBackgroundColor,
      },
    ]}
  />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(TopBlockSpaceSmall);
