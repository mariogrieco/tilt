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

  renderInputBox = () => {
    const {theme, navigation} = this.props;
    return (
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
    );
  };

  renderActionTouch = () => {
    const {allowSearch, themeName} = this.props;

    if (allowSearch) {
      return (
        <TouchableOpacity
          style={styles.headerRight}
          onPress={this.handleSearch}>
          <Image source={assets[themeName].SEARCH} />
        </TouchableOpacity>
      );
    }

    return <View style={styles.headerRight} />;
  };

  render() {
    const {isSearching} = this.state;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isSearching ? this.renderInputBox() : this.renderActionTouch()}
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
