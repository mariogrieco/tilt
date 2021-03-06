import React from 'react';
import {connect} from 'react-redux';
import {View, FlatList, ActivityIndicator, BackHandler} from 'react-native';
import isEqual from 'lodash/isEqual';
// import SegmentedControlTab from 'react-native-segmented-control-tab';
import StyleSheet from 'react-native-extended-stylesheet';
import CryptoItem from '../components/CryptoItem';
// import HeaderHome from '../components/HeaderHome';
import Separator from '../components/Separator';
// import Feeds from '../components/Feeds';
import {getSymbols} from '../actions/symbols';
import SearchBar from '../components/SearchBar';
import {modalActive} from '../actions/modal';
import {WATCHLIST_INTERVAL} from '../config/refreshIntervals';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import getAllChannels from '../selectors/getAllChannels';
import {selectedSymbol} from '../actions/symbols';
import {setActiveFocusChannel} from '../actions/AppNavigation';
import NavigationService from '../config/NavigationService';
import {getChannelByName} from '../actions/channels';
import {NavigationActions} from 'react-navigation';
import parser from '../utils/parse_display_name';
import GoBack from '../components/GoBack';

const ORIGIN = 'WATCHLIST';

const styles = StyleSheet.create({
  container: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  commonStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  activeStyle: {
    borderRadius: 8,
    elevation: 1,
    height: 30,
    padding: 2,
    margin: 2,
  },
  tabText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  activeTabText: {
    fontFamily: 'SFProDisplay-Semibold',
    textAlign: 'center',
  },
});

class Home extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      headerTitle: () => {
        return (
          <SearchBar
            inputStyle={[
              styles.input,
              {color: screenProps.theme.primaryTextColor},
            ]}
            placeholderText="Search for a crypto symbol"
            placeholderTextColor={screenProps.theme.placeholderTextColor}
            growPercentage={0.85}
            onChangeText={navigation.getParam('onSearch', () => {})}
            inputValue={navigation.getParam('searchValue', '')}
          />
        );
      },
      ...headerForScreenWithBottomLine({
        headerTintColor: screenProps.theme.headerTintColor,
        headerStyle: {
          backgroundColor: screenProps.theme.primaryBackgroundColor,
          borderBottomColor: screenProps.theme.borderBottomColor,
        },
      }),
      headerLeft: (
        <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
      ),
    };
  };

  state = {
    name: '',
    page: 1,
  };

  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    const {navigation, getSymbols: dispatchGetSymbols} = this.props;

    navigation.setParams({
      onSearch: this.searchSymbol,
    });

    this.didFocusListener = navigation.addListener('didFocus', () => {
      dispatchGetSymbols(ORIGIN); // initial fetch for check connection
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
        }
      });
    });

    this.didBlurListener = navigation.addListener('didBlur', () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    });
  }

  componentDidUpdate() {
    const {watchlist, getSymbols: dispatchGetSymbols} = this.props;

    // If SUCCESS start conitues fetching
    if (watchlist.hasData) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        dispatchGetSymbols(ORIGIN);
      }, WATCHLIST_INTERVAL);
    }

    // If was an error clear the previous interval and fetching for reconect
    if (watchlist.err) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        dispatchGetSymbols(ORIGIN);
      }, 3500);
    }
  }

  componentWillUnmount() {
    this.didFocusListener.remove();
    this.didBlurListener.remove();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // eslint-disable-next-line react/no-unused-state
  searchSymbol = name => {
    this.setState({name: name.toUpperCase()}, () => {
      this.props.navigation.setParams({
        searchValue: name,
      });
    });
  };

  navigateAction(channel, to) {
    this.props.setActiveFocusChannel(channel.id);
    NavigationService.navigate(to, {
      title: parser(channel.display_name),
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav ? true : false,
      isAdminCreator: true,
    });
  }

  handleOnCryptoPress = async symbol => {
    const {
      dispatchSelectedSymbol,
      // dispatchSetPopupSymbolValue,
      channels,
    } = this.props;

    dispatchSelectedSymbol({symbol});

    const notInbutFound = channels.find(channel => {
      return parser(channel.display_name) === parser(symbol);
    });

    if (notInbutFound) {
      this.navigateAction(notInbutFound, 'Room');
      return null;
    }

    try {
      const result = await this.props.getChannelByName(symbol.toLowerCase());
      if (result) {
        this.navigateAction(result, 'Room');
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`${err.message || err}`);
    }
    return null;
  };

  renderItem = ({item}) => (
    <CryptoItem
      {...item}
      // eslint-disable-next-line react/destructuring-assignment
      navigation={this.props.navigation}
      key={item.symbol}
      onPress={this.handleOnCryptoPress}
    />
  );

  handleEndReach = () =>
    this.setState(prevState => ({page: prevState.page + 0.25}));

  renderWatchList = () => {
    const {watchlist} = this.props;
    const {name, page} = this.state;

    let data;

    try {
      if (name !== '') {
        data = watchlist.ticker.filter(item => item.symbol.includes(name));
      } else {
        data = watchlist.ticker
          .slice(0, page * 20)
          .filter(item => item.symbol.includes(name));
      }
    } catch (err) {
      data = [];
    }

    if (watchlist.hasData) {
      return (
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => item.symbol}
          ItemSeparatorComponent={Separator}
          onEndReached={this.handleEndReach}
          onEndReachedThreshold={0.4}
          initialNumToRender={5}
          keyboardDismissMode="on-drag"
        />
      );
    }
    if (watchlist.err) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#17C491" />
          {/*<Text style={{ marginTop: 10 }}>Please check your internet connection</Text>*/}
        </View>
      );
    }
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#17C491" />
      </View>
    );
  };

  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        {this.renderWatchList()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  watchlist: state.watchlist,
  modal: state.modal,
  login: state.login,
  theme: state.themes[state.themes.current],
  channels: getAllChannels(state, channel => channel.content_type === 'C'),
});

export default connect(
  mapStateToProps,
  {
    getSymbols,
    modalActive,
    dispatchSelectedSymbol: selectedSymbol,
    getChannelByName,
    setActiveFocusChannel,
  },
)(Home);
