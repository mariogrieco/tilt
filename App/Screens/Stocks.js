import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import NavigationService from '../config/NavigationService';
import {selectedSymbol} from '../actions/symbols';
import {setPopupSymbolValue} from '../actions/chartPopup';
import SearchBar from '../components/SearchBar';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import StyleSheet from 'react-native-extended-stylesheet';
import {setActiveFocusChannel} from '../actions/AppNavigation';
import {getChannelByName} from '../actions/channels';

import StockLosers from '../components/StockLosers';
import StockGainers from '../components/StockGainers';
import StockActive from '../components/StockActive';

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
    fontSize: 14,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  indicator: {
    backgroundColor: '#17C491',
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

const {width} = Dimensions.get('window');

export class Stocks extends Component {
  state = {
    index: 0,
    routes: [
      {key: 'gainers', title: 'GAINERS'},
      {key: 'losers', title: 'LOSERS'},
      {key: 'active', title: 'ACTIVE'},
    ],
    searchValue: '',
  };

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
        placeholderText="Search companies..."
        placeholderTextColor={screenProps.theme.placeholderTextColor}
        growPercentage={0.78}
        onChangeText={navigation.getParam('onSearch', () => {})}
        inputValue={navigation.getParam('searchValue', '')}
      />
    ),
    // headerRight: navigation.getParam('isSearching', false) ? (
    //   <TouchableOpacity
    //     style={{paddingHorizontal: 15, paddingBottom: 8}}
    //     onPress={() => {
    //       navigation.setParams({
    //         isSearching: false,
    //       });
    //       navigation.getParam('onSearch', () => {})('');
    //     }}>
    //     <Text
    //       style={[styles.cancel, {color: screenProps.theme.primaryTextColor}]}>
    //       Cancel
    //     </Text>
    //   </TouchableOpacity>
    // ) : (
    //   <TouchableOpacity
    //     style={{paddingHorizontal: 15, paddingBottom: 6}}
    //     onPress={() => navigation.navigate('CreateChannel')}>
    //     <Image source={assets[screenProps.themeName].CREATE_CHANNEL} />
    //   </TouchableOpacity>
    // ),
  });

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  async componentDidMount() {
    const {navigation} = this.props;

    navigation.setParams({
      onSearch: this.handleSearch,
    });
  }

  handleSearch = text => {
    this.setState(() => {
      const {navigation} = this.props;
      navigation.setParams({
        isSearching: text !== '',
        searchValue: text,
      });
      return {
        searchValue: text,
      };
    });
  };

  keyExtractor(channel) {
    return channel.id;
  }

  handleOnSymbolPress = async symbol => {
    const {
      dispatchSelectedSymbol,
      dispatchSetPopupSymbolValue,
      channels,
      myChannels,
    } = this.props;
    dispatchSelectedSymbol({symbol});
    dispatchSetPopupSymbolValue(`$${symbol}`, false);
    NavigationService.navigate('StockRoom', {
      title: symbol,
    });

    const notInbutFound = channels.find(
      channel => channel.name === symbol.toLowerCase(),
    );

    const foundOnMy = myChannels.find(
      channel => channel.name === symbol.toLowerCase(),
    );

    if (foundOnMy) {
      this.props.setActiveFocusChannel(foundOnMy.id);
      return null;
    }

    if (notInbutFound) {
      this.props.setActiveFocusChannel(notInbutFound.id);
      return null;
    }

    try {
      const result = await getChannelByName(symbol);
      if (result) {
        this.props.setActiveFocusChannel(result.id);
      }
    } catch (err) {
      alert(`${err.message || err}`);
    }
    return null;
  };

  render() {
    const {theme} = this.props;
    const {searchValue} = this.state;
    return (
      <React.Fragment>
        <TabView
          navigationState={{...this.state}}
          renderScene={SceneMap({
            gainers: () => (
              <StockGainers
                searchValue={searchValue}
                onPress={this.handleOnSymbolPress}
              />
            ),
            losers: () => (
              <StockLosers
                searchValue={searchValue}
                onPress={this.handleOnSymbolPress}
              />
            ),
            active: () => (
              <StockActive
                searchValue={searchValue}
                onPress={this.handleOnSymbolPress}
              />
            ),
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
  }
}

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
  selectedSymbol: state.watchlist.selectedSymbol,
  channels: state.mapChannels.valueSeq().toJS(),
  myChannels: state.myChannelsMap
    .map(id => state.mapChannels.get(id))
    .filter(channel => channel)
    .valueSeq()
    .toJS(),
});

const mapDispatchToProps = {
  dispatchSelectedSymbol: selectedSymbol,
  dispatchSetPopupSymbolValue: setPopupSymbolValue,
  setActiveFocusChannel,
  getChannelByName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stocks);
