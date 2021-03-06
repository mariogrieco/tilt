import React from 'react';
import {View, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import uuid from 'react-uuid';
import Separator from '../Separator';
// import {HistoryBanner} from '../AdBanner';
import fetchData from '../../actions/history';
import {HISTORIES_INTERVAL} from '../../config/refreshIntervals';
import styles from './style';

class History extends React.PureComponent {
  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  componentDidMount() {
    const {symbol, dispatchFetchData} = this.props;
    this.intervalId = setInterval(() => {
      dispatchFetchData(symbol);
    }, HISTORIES_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  renderItem = ({item}) => {
    const {theme} = this.props;

    return (
      <View style={[styles.listITemContainer, styles.container]}>
        <Text
          style={[styles.listText, {color: theme.primaryTextColor}, {flex: 1}]}>
          {parseFloat(item.qty)}
        </Text>
        <Text
          style={[
            styles.listText,
            {flex: 1, textAlign: 'center', color: item.color},
          ]}>{`${item.price}`}</Text>
        <Text
          style={[
            styles.listText,
            {color: theme.primaryTextColor},
            {flex: 1, textAlign: 'right'},
          ]}>
          {item.time}
        </Text>
      </View>
    );
  };

  render() {
    const {data} = this.props;
    return (
      <View>
        {/*<View style={{alignItems: 'center', paddingTop: 11}}>*/}
        {/*  <HistoryBanner />*/}
        {/*</View>*/}
        <View style={[styles.headerContainer, styles.container]}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.header, {flex: 1}]}>Amount</Text>
            <Text style={[styles.header, {flex: 1, textAlign: 'center'}]}>
              Price
            </Text>
            <Text style={[styles.header, {flex: 1, textAlign: 'right'}]}>
              Time
            </Text>
          </View>
        </View>
        <Separator styles={{height: 2}} />
        <FlatList
          data={data.slice(0, 20)}
          renderItem={this.renderItem}
          ItemSeparatorComponent={Separator}
          keyExtractor={item => `${item.time}-${uuid()}`}
          initialNumToRender={10}
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  history: {data},
  watchlist: {
    selectedSymbol: {symbol},
  },
  themes,
}) => ({data, symbol, theme: themes[themes.current]});

export default connect(
  mapStateToProps,
  {
    dispatchFetchData: fetchData,
  },
)(History);
