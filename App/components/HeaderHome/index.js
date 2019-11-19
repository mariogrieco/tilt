/* eslint-disable react/no-multi-comp */
import React from 'react';
import {TouchableOpacity, Image, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Search from '../WatchListSearch';
import styles from './styles';
import assets from '../../config/themeAssets/assets'; // const MENU_IMAGE = require('../../../assets/themes/light/menu/menu.png');

class HeaderHome extends React.Component {
  state = {
    isSearching: false,
  };

  handleSearch = () => {
    const {navigation} = this.props;
    this.setState(prevState => ({isSearching: !prevState.isSearching}));
    navigation.setParams({
      title: '',
    });
  };

  handleCancel = () => {
    const {navigation} = this.props;
    this.setState(prevState => ({isSearching: !prevState.isSearching}));
    navigation.setParams({
      title: 'All Cryptos',
    });
    navigation.getParam('onChangeText')('');
  };

  render() {
    const {isSearching} = this.state;
    const {navigation} = this.props;
    const {themeName, theme} = this.props;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isSearching ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Search navigation={navigation} />
            <TouchableOpacity
              style={styles.headerRight}
              onPress={this.handleCancel}>
              <Text
                style={{
                  color: theme.primaryTextColor,
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 16,
                  letterSpacing: 0.1,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerRight}
            onPress={this.handleSearch}>
            <Image source={assets[themeName].SEARCH} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({login, themes}) => ({
  login,
  themeName: themes.current,
  theme: themes[themes.current],
});

export default connect(mapStateToProps)(HeaderHome);
