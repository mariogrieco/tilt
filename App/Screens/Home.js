import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import isEqual from 'lodash/isEqual';
import { withNavigation } from 'react-navigation';
import CryptoItem from '../components/CryptoItem';
import HeaderHome from '../components/HeaderHome';
import Separator from '../components/Separator';
import { getSymbols } from '../actions/symbols';
import { modalActive } from '../actions/modal';
import { WATCHLIST_INTERVAL } from '../config/refreshIntervals';


const ORIGIN = 'WATCHLIST';

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    // headerLeft: <HeaderLeft navigation={navigation} />,
    title: navigation.getParam('title', ''),
    headerRight: <HeaderHome navigation={navigation} />
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
    const { navigation, getSymbols: dispatchGetSymbols } = this.props;

    navigation.setParams({
      onChangeText: this.searchSymbol,
      title: 'All Cryptos'
    });

    this.navigationListener = navigation.addListener('didFocus', () => {
      dispatchGetSymbols(ORIGIN); // initial fetch for check connection
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (navigation.isFocused()) BackHandler.exitApp();
      });
    });
  }

  componentDidUpdate() {
    const {
      navigation,
      watchlist,
      getSymbols: dispatchGetSymbols
    } = this.props;


    // If SUCCESS start conitues fetching
    if (watchlist.hasData) {
      if (this.intervalId) clearInterval(this.intervalId);

      this.intervalId = setInterval(() => {
        dispatchGetSymbols(ORIGIN);
      }, WATCHLIST_INTERVAL);
    }

    // If was an error clear the previous interval and fetching for reconect
    if (watchlist.err) {
      if (this.intervalId) clearInterval(this.intervalId);

      this.intervalId = setInterval(() => {
        dispatchGetSymbols(ORIGIN);
      }, 3500);
    }

    // Clear interval if watchlist is not on screen
    if (!navigation.isFocused()) {
      clearInterval(this.intervalId);
    }
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // eslint-disable-next-line react/no-unused-state
  searchSymbol = name => this.setState({ name: name.toUpperCase() });

  renderItem = ({ item }) => (
    <CryptoItem
      {...item}
      // eslint-disable-next-line react/destructuring-assignment
      navigation={this.props.navigation}
      key={item.symbol}
    />
  );

  handleEndReach = () => this.setState(prevState => ({ page: prevState.page + 0.25 }));

  renderWatchList = () => {
    const { watchlist } = this.props;
    const { name, page } = this.state;

    let data;

    try {
      if (name !== '') {
        data = watchlist.ticker.filter(item => item.symbol.includes(name));
      } else {
        data = watchlist.ticker.slice(0, page * 20).filter(item => item.symbol.includes(name));
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
    } if (watchlist.err) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#17C491" />
          {/*<Text style={{ marginTop: 10 }}>Please check your internet connection</Text>*/}
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#17C491" />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        { this.renderWatchList()}
      </View>
    );
  }
}

const mapStateToProps = ({ watchlist, modal, login }) => ({ watchlist, modal, login });

export default withNavigation(
  connect(
    mapStateToProps,
    {
      getSymbols,
      modalActive
    }
  )(Home)
);
