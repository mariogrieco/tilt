import React from 'react';
import {LineChart} from 'react-native-charts-wrapper';
import {processColor} from 'react-native';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import StyleSheet from 'react-native-extended-stylesheet';
import minichart from '../../actions/miniChart';
import isEqual from 'lodash/isEqual';
import styles from './styles';

const fillColor = {
  green: processColor('#17C491'),
  red: processColor('#FC3E30'),
};

class MiniChart extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.data.length > 0) {
      return update(state, {
        data: {
          dataSets: {
            $set: [
              {
                values: props.data,
                label: '',
                config: {
                  lineWidth: 1,
                  drawCircles: false,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: false,
                  color: fillColor[props.color],
                  drawFilled: false,
                  fillColor: fillColor[props.color],
                  fillAlpha: 100,
                  drawValues: false,
                },
              },
            ],
          },
        },
      });
    }
    return null;
  }

  state = {
    data: {},
    xAxis: {},
    yAxis: {},
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    const {color, dispatchMiniChart, symbol} = this.props;

    this.setState({
      xAxis: {
        drawAxisLine: false,
        axisLineColor: processColor('#DCDCDC'),
        axisLineWidth: StyleSheet.hairlineWidth,
        position: 'BOTTOM',
        drawGridLines: false,
        drawLabels: false,
      },
      yAxis: {
        left: {
          enabled: false,
        },
        right: {
          enabled: false,
        },
      },
      data: {
        dataSets: [
          {
            values: [],
            label: '',
            config: {
              lineWidth: 1.2,
              drawCircles: false,
              drawCubicIntensity: 0.3,
              drawCubic: true,
              drawHighlightIndicators: false,
              color: fillColor[color],
              drawFilled: false,
              fillColor: fillColor[color],
              fillAlpha: 100,
              drawValues: false,
            },
          },
        ],
      },
    });

    dispatchMiniChart(symbol);
  }

  render() {
    const {data, xAxis, yAxis} = this.state;
    return (
      <LineChart
        style={styles.chart}
        data={data}
        chartDescription={{text: ''}}
        xAxis={xAxis}
        yAxis={yAxis}
        legend={{enabled: false}}
      />
    );
  }
}

MiniChart.defaultProps = {
  data: [],
};

const mapStateToProps = ({miniChart}, props) => ({
  data: miniChart[props.symbol],
});

export default connect(
  mapStateToProps,
  {dispatchMiniChart: minichart},
)(MiniChart);
