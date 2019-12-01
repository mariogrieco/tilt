import React, {Component} from 'react';
import {View, Text} from 'react-native';
import isEqual from 'lodash/isEqual';
import LineChartContainer from '../chart-popup/line-chart-container';
import {connect} from 'react-redux';

import styles from './styles';

export class StockChart extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(this.state, nextState);
  }

  state = {
    data: {
      dataSets: [
        {
          values: [],
        },
      ],
    },
    marker: {},
    legend: {},
    xAxis: {},
    yAxis: {},
    volume: [],
    colors: [],
  };

  render() {
    const {chartPopup, theme} = this.props;
    const colorIsRed = chartPopup.changePercent < 0;
    const symbol_name = chartPopup.symbol.replace('$', '');
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={[styles.price, {color: theme.popupPriceColor}]}>
            ${chartPopup.price}
          </Text>
          <Text>
            <Text
              style={[
                styles.text,
                colorIsRed ? styles.redPercent : styles.symbolPercent,
              ]}>
              {chartPopup.change}
            </Text>{' '}
            <Text style={styles.changePercent}>
              ({chartPopup.changePercent}%)
            </Text>
          </Text>
        </View>
        {chartPopup.chart_data &&
          <LineChartContainer
            isRed={colorIsRed}
            symbol={symbol_name}
            data={chartPopup.chart_data}
            fullHeight
          />
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedSymbol: state.watchlist.selectedSymbol.symbol,
  theme: state.themes[state.themes.current],
  chartPopup: state.chartPopup,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockChart);
