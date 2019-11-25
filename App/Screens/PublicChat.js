import React from 'react';
import {TouchableOpacity, Image, Dimensions, Text} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import StyleSheet from 'react-native-extended-stylesheet';
import {searchChannels} from '../actions/search';
import Channels from '../components/Channels';
import Discover from '../components/Discover';
import SearchBar from '../components/SearchBar';
import PublicSearch from '../components/PublicSearch';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';
import TabButtonLayout from '../components/TabButtonLayout';

import assets from '../config/themeAssets/assets';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    // color: '#0E141E',
    fontSize: 14,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  indicator: {
    backgroundColor: '#17C491',
    // backgroundColor: 'rgba(16, 115, 240, 0.75)',
    height: 3,
  },
  searchContainer: {
    marginLeft: 0,
  },
  cancel: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
});

class PublicChat extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: '',
    ...headerForScreenWithTabs({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
    headerLeft: (
      <SearchBar
        inputStyle={[styles.input, {color: screenProps.theme.primaryTextColor}]}
        placeholderText="Search for a channel or username"
        placeholderTextColor={screenProps.theme.placeholderTextColor}
        growPercentage={0.78}
        onChangeText={navigation.getParam('onSearch', () => {})}
        inputValue={navigation.getParam('searchValue', '')}
      />
    ),
    headerRight: navigation.getParam('isSearching', false) ? (
      <TouchableOpacity
        style={{paddingHorizontal: 15, paddingBottom: 8}}
        onPress={() => {
          navigation.setParams({
            isSearching: false,
          });
          navigation.getParam('onSearch', () => {})('');
        }}>
        <Text
          style={[styles.cancel, {color: screenProps.theme.primaryTextColor}]}>
          Cancel
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{paddingHorizontal: 15, paddingBottom: 6}}
        onPress={() => navigation.navigate('CreateChannel')}>
        <Image source={assets[screenProps.themeName].CREATE_CHANNEL} />
      </TouchableOpacity>
    ),
  });

  state = {
    index: 0,
    routes: [
      {key: 'channels', title: 'CHANNELS'},
      {key: 'discover', title: 'DISCOVER'},
    ],
    searchValue: '',
    currentToggleSelected: 'left',
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setParams({
      onSearch: this.handleSearch,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(this.state, nextState);
  }

  handleSearch = text => {
    const {navigation} = this.props;
    this.setState(
      () => {
        navigation.setParams({
          isSearching: text !== '',
          searchValue: text,
        });
        return {searchValue: text};
      },
      () => {
        this.searchFor(text);
      },
    );
  };

  async searchFor(queryStr) {
    // if (this.state.searchValue !== queryStr) return null;
    try {
      await this.props.searchChannels('k1df69t1ibryue11z5wd4n48nr', queryStr);
    } catch (ex) {
      alert(ex.message || ex);
    }
  }

  renderChannels = () => {
    const {theme} = this.props;
    return (
      <React.Fragment>
        <TabButtonLayout />
        <TabView
          navigationState={{...this.state}}
          renderScene={SceneMap({
            channels: Discover,
            discover: Channels,
          })}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={[
                styles.tabBar,
                {
                  backgroundColor: theme.primaryBackgroundColor,
                  borderBottomColor: theme.borderBottomColor,
                },
              ]}
              labelStyle={styles.label}
              indicatorStyle={styles.indicator}
              activeColor="#17C491"
              inactiveColor="#585C63"
            />
          )}
          //swipeEnabled={false}
        />
      </React.Fragment>
    );
  };

  render() {
    const {searchValue} = this.state;
    return (
      <React.Fragment>
        {searchValue !== '' ? (
          <PublicSearch searchValue={searchValue} />
        ) : (
          this.renderChannels()
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({themes}) => ({
  theme: themes[themes.current],
  themeName: themes.current,
});

const mapDispatchToProps = {
  searchChannels,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PublicChat),
);
