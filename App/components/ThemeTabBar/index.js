import React from 'react';
import {BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';
import styles from './styles';

const ThemeTabBar = props => (
  <BottomTabBar
    {...props}
    style={[
      styles.container,
      {
        backgroundColor: props.theme.primaryBackgroundColor,
        borderTopColor: props.theme.borderBottomColor,
      },
    ]}
  />
);

const mapStateToProps = ({themes}) => ({
  theme: themes[themes.current],
  themeName: themes.current,
});
export default connect(mapStateToProps)(ThemeTabBar);
