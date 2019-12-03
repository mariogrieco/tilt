import React from 'react';
import {View, Text, FlatList, Platform, TouchableOpacity} from 'react-native';
import isEqual from 'lodash/isEqual';
import Separator from '../Separator';
import SymbolSummary from '../SymbolSummary';
import CryptoItem from '../CryptoItem';
import getAllChannels from '../../selectors/getAllChannels';
import Collapsible  from 'react-native-collapsible';
import {connect} from 'react-redux';

import styles from './styles';

export class Watchlist extends React.Component {
  state = {
    collapsedCrypto: false,
    collapsedStock: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  renderStockItem = ({item}) => {
    return (
      <SymbolSummary
        onPress={() => {
          // this.props.onPress(item.symbol);
        }}
        name={item.display_name}
        header={item.header}
        // latest_price={0}
        // change_percent={0}
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
    return (
      <CryptoItem
        symbol={item.display_name}
        // eslint-disable-next-line react/destructuring-assignment
        navigation={this.props.navigation}
        key={item.symbol}
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
  stocks: getAllChannels(state, channel => channel.content_type === 'S'),
  cryptos: getAllChannels(state, channel => channel.content_type === 'C'),
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Watchlist);
