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
import {setActiveFocusChannel} from '../../actions/AppNavigation';

import moment from 'moment';

import {connect} from 'react-redux';

import styles from './styles';

export class Watchlist extends React.Component {
  state = {
    collapsedCrypto: false,
    collapsedStock: false,
    refStockInterval: null,
  };

  componentDidMount() {
    this._fetchAll();
    this.refStockInterval = setInterval(this._fetchAll, 1000 * 15);
  }

  _fetchAll = async () => {
    const {stocks, cryptos} = this.props;
    for (const {display_name} of [...cryptos, ...stocks]) {
      try {
        const {changePercent, change} = await Client4.getSymbolTicket(
          display_name,
        );
        this.setState(prevState => {
          const nextState = {...prevState};
          nextState[display_name] = {
            changePercent,
            change,
          };
          return nextState;
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  handleStockPress = async symbol => {
    const {
      dispatchSelectedSymbol,
      dispatchSetPopupSymbolValue,
      stocks,
      cryptos,
    } = this.props;

    dispatchSelectedSymbol({symbol});
    dispatchSetPopupSymbolValue(`$${symbol}`, false);
    NavigationService.navigate('StockRoom', {
      title: symbol,
    });

    const notInbutFound = [...cryptos, ...stocks].find(
      channel => channel.display_name === symbol.toLowerCase(),
    );

    if (notInbutFound) {
      this.props.setActiveFocusChannel(notInbutFound.id);
      return null;
    }

    try {
      const result = await this.props.getChannelByName(symbol.toLowerCase());
      if (result) {
        this.props.setActiveFocusChannel(result.id);
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
    const {changePercent, change} = data;
    return (
      <SymbolSummary
        onPress={() => {
          this.handleStockPress(item.display_name);
        }}
        name={item.display_name}
        header={item.header}
        latest_price={change}
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
    return (
      <TouchableOpacity
        style={styles.separator}
        onPress={this.onTogglePress.bind(this, text)}>
        <Text style={styles.separatorText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  keyExtractor(channel) {
    return channel.symbol;
  }

  renderStocksFlatList = () => {
    const {stocks, theme} = this.props;
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
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  };

  renderCryptoItem = ({item}) => {
    const data = this.state[item.display_name] || {
      changePercent: 0,
      change: 0,
    };
    const {changePercent, change} = data;
    return (
      <CryptoItem
        symbol={item.display_name}
        // eslint-disable-next-line react/destructuring-assignment
        navigation={NavigationService}
        key={item.symbol}
        priceChangePercent={changePercent}
      />
    );
  };

  renderCryptoFlatlist = () => {
    const {cryptos, theme} = this.props;
    return (
      <FlatList
        extraData={cryptos}
        data={cryptos}
        renderItem={this.renderCryptoItem}
        // onEndReached={this.handleEndReach}
        keyExtractor={this.keyExtractor}
        initialNumToRender={15}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={Separator}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  };

  render() {
    const {collapsedStock, collapsedCrypto} = this.state;
    return (
      <View style={styles.section}>
        {this.renderSeparator('Stocks')}
        {!collapsedStock && (
          <View style={styles.article}>{this.renderStocksFlatList()}</View>
        )}
        {this.renderSeparator('Cryptos')}
        {!collapsedCrypto && (
          <View style={styles.article}>{this.renderCryptoFlatlist()}</View>
        )}
      </View>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Watchlist);
