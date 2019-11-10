import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import omit from 'lodash/omit';
import MiniChart from '../MiniChart';
import {selectedSymbol} from '../../actions/symbols';
import {resetInterval} from '../../actions/candle';
import {resetDepthChart} from '../../actions/depth';
import {resetHistories} from '../../actions/history';
import isEqual from 'lodash/isEqual';
import styles from './styles';

// const ARROW_UP = require('../../../assets/themes/light/arrow_up/shape.png');
// const ARROW_DOWN = require('../../../assets/themes/light/arrow_down/shape.png');

class CryptoItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  handleOnPress = () => {
    const {
      navigation,
      selectedSymbol: dispatchSelectedSymbol,
      dispatchResetInterval,
      dispatchResetDepthChart,
      dispatchResetHistories,
    } = this.props;
    const symbol = omit(this.props, ['navigation', 'selectedSymbol']);
    dispatchSelectedSymbol({...symbol});
    dispatchResetInterval();
    dispatchResetDepthChart();
    dispatchResetHistories();
    navigation.navigate('Room');
  };

  renderChangePrice = price => {
    const color = price > 0 ? '#17C491' : '#FC3E30';
    // const arrow = price > 0 ? ARROW_UP : ARROW_DOWN;
    return (
      <View style={[styles.priceChangeContainer, {backgroundColor: color}]}>
        <Text style={styles.priceChangeListView}>{`${parseFloat(price).toFixed(
          2,
        )}%`}</Text>
      </View>
    );
  };

  render() {
    const {symbol, lastPrice, priceChangePercent} = this.props;
    const {theme} = this.props;
    const color = priceChangePercent > 0 ? 'green' : 'red';

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.handleOnPress}>
        <View style={styles.container}>
          <Text style={[styles.pair]}>{symbol}</Text>
          <View styles={{alignSelf: 'center'}}>
            <MiniChart symbol={symbol} color={color} />
          </View>
          {this.renderChangePrice(priceChangePercent)}
        </View>
      </TouchableOpacity>
    );
  }
}

CryptoItem.defaultProps = {
  chartData: [],
};
const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(
  null,
  {
    selectedSymbol,
    mapStateToProps,
    dispatchResetInterval: resetInterval,
    dispatchResetDepthChart: resetDepthChart,
    dispatchResetHistories: resetHistories,
  },
)(CryptoItem);
