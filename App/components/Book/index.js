import React from 'react';
import {View, Text, Image} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import uuid from 'react-uuid';
import styles from './styles';
import Separator from '../Separator';
import {BookBanner} from '../AdBanner';
import {fetchBooksOnly} from '../../actions/depth';
import {BOOKS_INTERVAL} from '../../config/refreshIntervals';

const CROSS = require('../../../assets/themes/light/close_gray/shape.png');

const renderItem = ({item}) => (
  <View>
    <View style={[styles.listContainer, styles.container]}>
      <Text style={[styles.listItem, {flex: 0.8}]}>
        {parseFloat(item.bid.qty)}
      </Text>
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={CROSS} />
      </View>
      <Text
        style={[
          styles.listItem,
          {flex: 1, textAlign: 'center', color: '#17C491'},
        ]}>{`${parseFloat(item.bid.price)}`}</Text>
      <Text
        style={[
          styles.listItem,
          {flex: 1, textAlign: 'center', color: '#FC3E30'},
        ]}>{`${parseFloat(item.ask.price)}`}</Text>
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
        <Image source={CROSS} />
      </View>
      <Text style={[styles.listItem, {flex: 0.8, textAlign: 'right'}]}>
        {parseFloat(item.ask.qty)}
      </Text>
    </View>
  </View>
);

const DoubleSeparator = () => (
  <View style={{flexDirection: 'row'}}>
    <View style={{flex: 0.55}}>
      <Separator />
    </View>
    <View style={{flex: 0.05}} />
    <View style={{flex: 0.55}}>
      <Separator />
    </View>
  </View>
);

class Book extends React.PureComponent {
  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  componentDidMount() {
    this.intervalHandler();
  }

  componentDidUpdate() {
    this.intervalHandler();
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  intervalHandler = () => {
    const {isDepthChartActive, dispatchFetchData, symbol} = this.props;
    if (isDepthChartActive) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    } else if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        dispatchFetchData(symbol);
      }, BOOKS_INTERVAL);
    }
  };

  render() {
    const {hasData, books} = this.props;
    return (
      <View>
        {/*<View style={{alignItems: 'center', paddingTop: 11}}>*/}
        {/*  <BookBanner />*/}
        {/*</View>*/}
        <View style={[styles.headerContainer, styles.container]}>
          <Text style={[styles.header, {textAlign: 'left'}]}>Size</Text>
          <Text style={[styles.header, {textAlign: 'center'}]}>Bid</Text>
          <Text style={[styles.header, {textAlign: 'center'}]}>Ask</Text>
          <Text style={[styles.header, {textAlign: 'right'}]}>Size</Text>
        </View>
        <DoubleSeparator />
        {hasData && (
          <FlatList
            data={books}
            renderItem={renderItem}
            ItemSeparatorComponent={DoubleSeparator}
            keyExtractor={item => `${item.bid.qty}-${uuid()}`}
            initialNumToRender={10}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({
  depth: {books, hasData, isDepthChartActive},
  watchlist: {
    selectedSymbol: {symbol},
  },
}) => ({
  books,
  hasData,
  isDepthChartActive,
  symbol,
});

export default connect(
  mapStateToProps,
  {
    dispatchFetchData: fetchBooksOnly,
  },
)(Book);
