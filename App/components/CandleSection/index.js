/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import {View, processColor} from 'react-native';
import {CandleStickChart} from 'react-native-charts-wrapper';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import merge from 'lodash/merge';
import isEqueal from 'lodash/isEqual';
import BarChartSection from '../BarChartSection';
import fetchCandle from '../../actions/candle';
import isEqual from 'lodash/isEqual';
import TimeInterval from '../TimeInterval';
import styles from './styles';
import config from './config';

class CandleSection extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!isEqueal(props.candleData, state.data.dataSets[0].values)) {
      const xLabels = props.candleData.map(item => item.closeTime);
      const volume = props.candleData.map(item => ({y: item.volume}));
      const colors = props.candleData.map(item =>
        item.close < item.open
          ? processColor('rgba(252, 62, 48, 0.65)')
          : processColor('rgba(23, 196, 145, 0.65)'),
      );

      return update(state, {
        data: {
          dataSets: {
            $set: [
              {
                values: props.candleData,
                config: {
                  highlightEnabled: false,
                  // highlightColor: processColor('darkgray'),
                  shadowColor: processColor('#585c63'),
                  shadowWidth: 1,
                  shadowColorSameAsCandle: false,
                  neutralColor: processColor('#8E8E95'),
                  increasingColor: processColor('#17C491'),
                  increasingPaintStyle: 'FILL',
                  decreasingColor: processColor('#FC3E30'),
                  drawValues: false,
                },
                label: 'AAPL',
              },
            ],
          },
        },
        xAxis: {
          $merge: {
            valueFormatter: xLabels,
            textColor: processColor(props.theme.primaryTextColor),
            gridColor: processColor(props.theme.borderBottomColor),
            axisLineColor: processColor(props.theme.borderBottomColor),
          },
        },
        yAxis: {
          $set: {
            ...merge({}, state.yAxis, {
              left: {
                textColor: processColor(props.theme.primaryTextColor),
                gridColor: processColor(props.theme.borderBottomColor),
                axisLineColor: processColor(props.theme.borderBottomColor),
              },
              right: {
                gridColor: processColor(props.theme.borderBottomColor),
                axisLineColor: processColor(props.theme.borderBottomColor),
              },
            }),
          },
        },
        volume: {
          $set: volume,
        },
        colors: {
          $set: colors,
        },
      });
    }
    return null;
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

  componentDidMount() {
    this.setState({
      ...config,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentWillUnmount() {
    clearInterval(this.fetcher);
  }

  handleSelectTimeInterval = (interval, startTime, format) => {
    const {fetchData, symbol} = this.props;
    fetchData(symbol, interval, startTime, format);
  };

  render() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}>
        <CandleStickChart
          style={styles.chart}
          data={this.state.data}
          marker={this.state.marker}
          chartDescription={{text: ''}}
          legend={this.state.legend}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          dragEnabled={false}
          doubleTapToZoomEnabled={false}
          pinchZoom={false}
          chartBackgroundColor={processColor(theme.primaryBackgroundColor)}
          autoScaleMinMaxEnabled
          // onSelect={this.handleSelect.bind(this)}
          // eslint-disable-next-line react/no-string-refs
          ref="chart"
        />
        <View
          style={{
            flex: 0.2,
            width: '100%',
            backgroundColor: theme.primaryBackgroundColor,
          }}>
          <BarChartSection
            data={this.state.volume}
            colors={this.state.colors}
          />
        </View>
        <TimeInterval onSelect={this.handleSelectTimeInterval} />
      </View>
    );
  }
}

CandleSection.defaultProps = {
  candleData: [
    {
      shadowH: 0,
      shadowL: 0,
      close: 0,
      open: 0,
    },
  ],
};

const mapStateToProps = ({candle, themes}) => ({
  candleData: candle.data,
  theme: themes[themes.current],
});

export default connect(
  mapStateToProps,
  {fetchData: fetchCandle},
)(CandleSection);
