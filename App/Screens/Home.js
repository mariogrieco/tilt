import React from 'react';
import {connect} from 'react-redux';
import {View, FlatList, ActivityIndicator, BackHandler} from 'react-native';
import isEqual from 'lodash/isEqual';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import StyleSheet from 'react-native-extended-stylesheet';
import CryptoItem from '../components/CryptoItem';
import HeaderHome from '../components/HeaderHome';
import Separator from '../components/Separator';
import Feeds from '../components/Feeds';
import {getSymbols} from '../actions/symbols';
import {modalActive} from '../actions/modal';
import {WATCHLIST_INTERVAL} from '../config/refreshIntervals';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
const ORIGIN = 'WATCHLIST';

const styles = StyleSheet.create({
  container: {
    height: 32,
    borderColor: 'rgba(118, 118, 128, 0.12)',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    borderRadius: 8.9,
    overflow: 'hidden',
  },
  commonStyle: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0, 0, 0, 0.04)',
    height: 28,
    borderRadius: 6.9,
    margin: 2,
    borderWidth: 0.5,
  },
  activeStyle: {
    backgroundColor: '#fff',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 1,
  },
  tabText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: -0.08,
  },
  activeTabText: {
    fontFamily: 'SFProDisplay-Semibold',
  },
});

class Home extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: () => (
      <SegmentedControlTab
        values={['Feed', 'Cryptos']}
        selectedIndex={navigation.getParam('segment', 0)}
        onTabPress={navigation.getParam('handleSegmentedTabPress', () => {})}
        tabsContainerStyle={styles.container}
        tabStyle={styles.commonStyle}
        activeTabStyle={{...styles.commonStyle, ...styles.activeStyle}}
        tabTextStyle={styles.tabText}
        activeTabTextStyle={{...styles.tabText, ...styles.activeTabText}}
      />
    ),
    headerRight: <HeaderHome navigation={navigation} />,
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

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
      onChangeText: this.searchSymbol,
      segment: 0,
      handleSegmentedTabPress: this.handleSegmentedTabPress,
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
  searchSymbol = name => this.setState({name: name.toUpperCase()});

  renderItem = ({item}) => (
    <CryptoItem
      {...item}
      // eslint-disable-next-line react/destructuring-assignment
      navigation={this.props.navigation}
      key={item.symbol}
    />
  );

  handleEndReach = () =>
    this.setState(prevState => ({page: prevState.page + 0.25}));

  handleSegmentedTabPress = index => {
    console.log('new index', index);
    const {navigation} = this.props;
    navigation.setParams({
      segment: index,
    });
  };

  renderSegment = () => {
    const {navigation} = this.props;
    const segment = navigation.getParam('segment');
    switch (segment) {
      case 0:
        return <Feeds />;
      case 1:
        return this.renderWatchList();
      default:
        <Feeds />;
    }
  };

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
        {this.renderSegment()}
      </View>
    );
  }
}

const mapStateToProps = ({watchlist, modal, login, themes}) => ({
  watchlist,
  modal,
  login,
  theme: themes[themes.current],
});

export default connect(mapStateToProps, {
  getSymbols,
  modalActive,
})(Home);
