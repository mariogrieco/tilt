import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

const BottomBlockSpaceSmall = ({theme}) => (
  <View
    style={[
      styles.block,
      {
        borderTopColor: theme.borderBottomColor,
        backgroundColor: theme.secondaryBackgroundColor,
      },
    ]}
  />
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(BottomBlockSpaceSmall);
