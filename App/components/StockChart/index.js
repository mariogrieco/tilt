import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Client4 from '../../api/MattermostClient';
import isEqual from 'lodash/isEqual';
import LineChartContainer from '../chart-popup/line-chart-container';
import {connect} from 'react-redux';
import moment from 'moment';

import styles from './styles';

export class StockChart extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(this.state, nextState);
  }

  async componentDidMount() {
    try {
      const {channel} = this.props;
      if (!channel) return null;
      const symbol_name = channel.display_name;
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        display_name: symbol_name,
      });
      const infoTicket = await Client4.getSymbolTicket(symbol_name);
      const {data} = await Client4.getKlines(
        symbol_name,
        '30m',
        moment()
          .subtract(1, 'days')
          .utc()
          .valueOf(),
      );

      if (data && data.items.length > 0) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          values: {items: data.items},
        });
      }
      if (infoTicket) {
        console.log(infoTicket);
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          infoTicket: {...infoTicket},
        });
      }
    } catch (ex) {
      return Promise.resolve([]);
    }
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
    values: null,
    infoTicket: {
      change: 0,
      changePercent: 0,
      price: 0,
    },
    display_name: '',
  };

  render() {
    const {theme} = this.props;
    const {values, infoTicket, display_name} = this.state;
    const colorIsRed = infoTicket.changePercent < 0;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}>
        <View style={styles.heading}>
          <Text style={[styles.price, {color: theme.popupPriceColor}]}>
            ${infoTicket.price}
          </Text>
          <Text
            style={[
              styles.changePercent,
              colorIsRed ? styles.redPercent : styles.symbolPercent,
            ]}>
            {infoTicket.change} ({infoTicket.changePercent}%)
          </Text>
        </View>
        {values && (
          <LineChartContainer
            isRed={colorIsRed}
            symbol={display_name}
            data={values}
            fullHeight
            stockRoom
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedSymbol: state.watchlist.selectedSymbol.symbol,
  theme: state.themes[state.themes.current],
  chartPopup: state.chartPopup,
  channel: state.mapChannels.get(state.appNavigation.active_channel_id),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockChart);
