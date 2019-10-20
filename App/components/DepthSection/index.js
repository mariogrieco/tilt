import React from 'react';
import {
  View,
  processColor,
} from 'react-native';
import { connect } from 'react-redux';
import { LineChart } from 'react-native-charts-wrapper';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import { depthChartActive, depthChartInactive, fetchAll } from '../../actions/depth';
import { DEPTH_INTERVAL } from '../../config/refreshIntervals';
import config from './config';
import styles from './styles';

const memoProcessColor = memoize(color => processColor(color));

class DepthSection extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    if (
      !isEqual(state.data.dataSets[0].values, props.bids)
      || !isEqual(state.data.dataSets[1].values, props.asks)
    ) {
      return update(state, {
        data: {
          dataSets: {
            0: {
              $merge: {
                values: props.bids,
                label: 'Bids',
                config: {
                  highlightEnabled: false,
                  drawValues: false,
                  colors: [memoProcessColor('#17C491')],
                  drawCircles: false,
                  lineWidth: 2,
                  drawFilled: true,
                  fillColor: memoProcessColor('#17C491'),
                }
              }
            },
            1: {
              $merge: {
                values: props.asks,
                label: 'Asks',
                config: {
                  highlightEnabled: false,
                  drawValues: false,
                  colors: [memoProcessColor('#FC3E30')],
                  drawCircles: false,
                  lineWidth: 2,
                  drawFilled: true,
                  fillColor: memoProcessColor('#FC3E30'),
                }
              }
            }
          }
        }
      });
    }
    return null;
  }

  state = {
    xAxis: {},
    yAxis: {},
    marker: {},
    data: {
      dataSets: [
        {
          values: [{ x: 0, y: 0 }],
          label: 'Bids',
          config: {
            highlightEnabled: false,
            drawValues: false,
            colors: [memoProcessColor('#17C491')],
            drawCircles: false,
            lineWidth: 2,
            drawFilled: true,
            fillColor: memoProcessColor('#17C491'),
          }
        },
        {
          values: [{ x: 0, y: 0 }],
          label: 'Asks',
          config: {
            highlightEnabled: false,
            drawValues: false,
            colors: [memoProcessColor('#FC3E30')],
            drawCircles: false,
            lineWidth: 2,
            drawFilled: true,
            fillColor: memoProcessColor('#FC3E30'),
          }
        }
      ]
    },
  };

  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  componentDidMount() {
    const { dispatchFetchData, symbol, dispatchNowActive } = this.props;
    dispatchNowActive();
    this.setState({ ...config });
    this.intervalId = setInterval(() => {
      dispatchFetchData(symbol);
    }, DEPTH_INTERVAL);
  }

  componentWillUnmount() {
    const { dispatchNowInactive } = this.props;
    clearInterval(this.intervalId);
    dispatchNowInactive();
  }

  render() {
    const {
      data,
      xAxis,
      yAxis,
      marker
    } = this.state;

    return (
      <View style={{ flex: 1, marginTop: 15, marginBottom: 0 }}>
        <View style={styles.container}>
          <LineChart
            data={data}
            xAxis={xAxis}
            yAxis={yAxis}
            marker={marker}
            legend={{ enabled: false }}
            style={styles.chart}
            chartDescription={{ text: '' }}
            dragEnabled={false}
            doubleTapToZoomEnabled={false}
            pinchZoom={false}
            chartBackgroundColor={processColor('#fff')}
            autoScaleMinMaxEnabled
          />
        </View>
      </View>
    );
  }
}

DepthSection.defaultProps = {
  asks: [],
  bids: []
};

const mapStateToProps = ({
  depth: {
    graph: {
      asks,
      bids
    },
    isFetching
  }
}) => ({
  asks,
  bids,
  isFetching
});

export default connect(
  mapStateToProps,
  {
    dispatchFetchData: fetchAll,
    dispatchNowActive: depthChartActive,
    dispatchNowInactive: depthChartInactive
  }
)(DepthSection);