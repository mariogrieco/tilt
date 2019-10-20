import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import Toggle from '../Toggle';
import { getSymbols } from '../../actions/symbols';
import cryptoItemStyles from '../CryptoItem/styles';
import { SYMBOL_DESCRIPTION_INTERVAL } from '../../config/refreshIntervals';
import styles from './styles';

const ORIGIN = 'CHART';

const Pricechange = ({ priceChange }) => {
  const color = priceChange > 0 ? '#17C491' : '#FC3E30';
  const priceTag = priceChange > 0 ? `${priceChange}` : `-${priceChange * -1}`;

  return (
    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[cryptoItemStyles.priceChangeChartView, { color }]}>
          {priceTag}
          {' '}
        </Text>
      </View>
    </View>
  );
};

const MemoPriceChange = React.memo(Pricechange);

class Description extends React.Component {
  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  componentDidMount() {
    const { dispatchGetSymbolData, symbol } = this.props;
    this.intervalId = setInterval(() => {
      dispatchGetSymbolData(ORIGIN, symbol);
    }, SYMBOL_DESCRIPTION_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const {
      lastPrice,
      priceChange,
      priceChangePercent,
      onToggle
    } = this.props;
    const color = priceChange > 0 ? '#17C491' : '#FC3E30';
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={[cryptoItemStyles.lastPrice, styles.lastPrice]}>{`${parseFloat(lastPrice)}`}</Text>
          <Toggle onPress={onToggle} />
        </View>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row' }}>
            <MemoPriceChange priceChange={priceChange} />
            <Text style={[cryptoItemStyles.priceChangeChartView, { color }]}>{`(${parseFloat(priceChangePercent).toFixed(2)}%)`}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({
  watchlist: {
    selectedSymbol: {
      lastPrice,
      priceChange,
      priceChangePercent,
      symbol
    }
  }
}) => ({
  lastPrice,
  priceChange,
  priceChangePercent,
  symbol
});

export default connect(
  mapStateToProps,
  {
    dispatchGetSymbolData: getSymbols
  }
)(Description);
