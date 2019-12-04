import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import StyleSheet from 'react-native-extended-stylesheet';
import GoBack from '../components/GoBack';
import {changeTheme} from '../actions/themeManager';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const CHECKMARK = require('../../assets/images/checkmark/checkmark.png');

const styles = StyleSheet.create({
  row: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
  },
});

class Themes extends React.PureComponent {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Themes',
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

  render() {
    const {themeName, themeEntities, theme, themeDisplayNames} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: theme.secondaryBackgroundColor}}>
        {themeEntities.map((_theme, index) => (
          <TouchableOpacity
            onPress={() => this.props.changeTheme(_theme)}
            key={_theme}
            activeOpacity={1}
            style={[
              styles.row,
              styles.button,
              {
                backgroundColor: theme.primaryBackgroundColor,
                borderColor: theme.borderBottomColor,
                marginTop: index === 0 ? 35 : 0,
                borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}>
            <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
              {themeDisplayNames[index]}
            </Text>
            {themeName === _theme ? (
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Image source={CHECKMARK} />
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({
  themeName: themes.current,
  themeEntities: themes.entities,
  themeDisplayNames: themes.displayNames,
  theme: themes[themes.current],
});

const mapDispatchToProps = {
  changeTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
