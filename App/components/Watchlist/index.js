import React from 'react';
import {View, Text, FlatList, Platform, TouchableOpacity} from 'react-native';
import isEqual from 'lodash/isEqual';
import Separator from '../Separator';
import Client4 from '../../api/MattermostClient';
import SymbolSummary from '../SymbolSummary';
import CryptoItem from '../CryptoItem';
import getAllChannels from '../../selectors/getAllChannels';
import NavigationService from '../../config/NavigationService';
import {setPopupSymbolValue} from '../../actions/chartPopup';
import {selectedSymbol} from '../../actions/symbols';
import {getChannelByName} from '../../actions/channels';
import {withNavigation} from 'react-navigation';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import parser from '../../utils/parse_display_name';
import {connect} from 'react-redux';

import styles from './styles';
import {ScrollView} from 'react-native-gesture-handler';

export class Watchlist extends React.Component {
  state = {
    collapsedCrypto: false,
    collapsedStock: false,
  };

  refInterval = null;

  componentDidMount() {
    this.refInterval = setInterval(this._fetchAll, 1000 * 15);
    this._fetchAll();
    const {navigation} = this.props;
    this.navigationListenerDidBlur = navigation.addListener('didBlur', () => {
      clearInterval(this.refInterval);
      this.refInterval = null;
    });
    this.navigationListenerDidFocus = navigation.addListener('didFocus', () => {
      if (this.refInterval === null) {
        this.refInterval = setInterval(this._fetchAll, 1000 * 15);
      }
      this._fetchAll();
    });
  }

  componentWillUnmount() {
    if (this.navigationListenerDidBlur) {
      this.navigationListenerDidBlur.remove();
    }
    if (this.navigationListenerDidFocus) {
      this.navigationListenerDidFocus.remove();
    }
    clearInterval(this.refInterval);
    this.refInterval = null;
  }

  _fetchAll = async () => {
    const {stocks, cryptos} = this.props;
    const results = [];
    const mapKeys = [];

    for (let values of [...cryptos, ...stocks]) {
      mapKeys.push(values.display_name);
      results.push(Client4.getSymbolTicket(values.display_name.toLowerCase()));
    }
    try {
      const data = await Promise.all(results);
      const nextState = {...this.state};
      data.forEach((item, index) => {
        const {changePercent, change, price} = item;
        nextState[mapKeys[index]] = {
          changePercent,
          change,
          price,
        };
      });
      this.setState(nextState);
    } catch (ex) {
      console.log('ex: ', ex);
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

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

  handleCryptoPress = async symbol => {
    const {
      dispatchSelectedSymbol,
      // dispatchSetPopupSymbolValue,
      // stocks,
      cryptos,
    } = this.props;

    dispatchSelectedSymbol({symbol});
    // dispatchSetPopupSymbolValue(`$${symbol}`, false);

    const notInbutFound = cryptos.find(channel => {
      return channel.display_name.toLowerCase() === symbol.toLowerCase();
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

  handleStockPress = async symbol => {
    const {
      dispatchSelectedSymbol,
      // dispatchSetPopupSymbolValue,
      stocks,
    } = this.props;

    dispatchSelectedSymbol({symbol});
    // dispatchSetPopupSymbolValue(`$${symbol}`, false);

    const notInbutFound = stocks.find(channel => {
      return channel.display_name.toLowerCase() === symbol.toLowerCase();
    });

    if (notInbutFound) {
      this.navigateAction(notInbutFound, 'StockRoom');
      return null;
    }

    try {
      const result = await this.props.getChannelByName(symbol.toLowerCase());
      if (result) {
        this.navigateAction(result, 'StockRoom');
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`${err.message || err}`);
    }
    return null;
  };

  renderStockItem = ({item}) => {
    const data = this.state[item.display_name] || {
      changePercent: 0,
      change: 0,
    };
    const {changePercent, price} = data;
    return (
      <SymbolSummary
        onPress={() => {
          this.handleStockPress(item.display_name);
        }}
        name={item.display_name}
        header={item.header}
        latest_price={price}
        change_percent={changePercent}
      />
    );
  };

  onTogglePress = (text = '') => {
    if (text.match('Stocks')) {
      this.setState(prevState => ({
        collapsedStock: !prevState.collapsedStock,
      }));
    } else {
      this.setState(prevState => ({
        collapsedCrypto: !prevState.collapsedCrypto,
      }));
    }
  };

  renderSeparator(text) {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.separator,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}
        onPress={this.onTogglePress.bind(this, text)}>
        <Text style={[styles.separatorText, {color: theme.secondaryTextColor}]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  keyExtractor(channel) {
    return channel.symbol;
  }

  renderStocksFlatList = () => {
    const {stocks, theme} = this.props;
    if (!stocks || stocks.length === 0) return null;
    return (
      <FlatList
        extraData={stocks}
        data={stocks}
        renderItem={this.renderStockItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={15}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={Separator}
        updateCellsBatchingPeriod={150}
        scrollEnabled={false}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  };

  renderCryptoItem = ({item}) => {
    const data = this.state[item.display_name] || {changePercent: 0};
    const {changePercent} = data;
    return (
      <CryptoItem
        symbol={item.display_name}
        // eslint-disable-next-line react/destructuring-assignment
        navigation={NavigationService}
        key={item.symbol}
        priceChangePercent={changePercent}
        onPress={this.handleCryptoPress}
      />
    );
  };

  renderCryptoFlatlist = () => {
    const {cryptos, theme} = this.props;
    if (!cryptos || cryptos.length === 0) return null;
    return (
      <FlatList
        extraData={cryptos}
        data={cryptos}
        renderItem={this.renderCryptoItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={15}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={Separator}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEnabled={false}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  };

  render() {
    const {collapsedStock, collapsedCrypto} = this.state;
    const {theme} = this.props;
    return (
      <ScrollView
        // contentContainerStyle={styles.section}
        keyboardDismissMode="on-drag"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1, backgroundColor: theme.secondaryBackgroundColor}}>
        {this.renderSeparator('Stocks')}
        {!collapsedStock && (
          <View style={styles.article}>{this.renderStocksFlatList()}</View>
        )}
        {this.renderSeparator('Cryptos')}
        {!collapsedCrypto && (
          <View style={styles.article}>{this.renderCryptoFlatlist()}</View>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  stocks: getAllChannels(state, channel => channel.content_type === 'S').filter(
    c => !c.join,
  ),
  cryptos: getAllChannels(
    state,
    channel => channel.content_type === 'C',
  ).filter(c => !c.join),
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  dispatchSelectedSymbol: selectedSymbol,
  dispatchSetPopupSymbolValue: setPopupSymbolValue,
  getChannelByName,
  setActiveFocusChannel,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Watchlist),
);
