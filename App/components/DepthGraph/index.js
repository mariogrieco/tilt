import React from 'react';
import {View, processColor} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import update from 'immutability-helper';
import {LineChart} from 'react-native-charts-wrapper';

class DepthGraph extends React.Component {
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
                  lineWidth: StyleSheet.hairlineWidth,
                  drawCircles: false,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: false,
                  color: processColor(props.config.color),
                  drawFilled: true,
                  fillColor: processColor(props.config.color),
                  fillAlpha: 90,
                },
              },
            ],
          },
        },
      });
    }
    return null;
  }

  constructor() {
    super();

    this.state = {
      data: {},
      xAxis: {},
      yAxis: {},
    };
  }

  componentDidMount() {
    const {config} = this.props;
    this.setState(
      // eslint-disable-next-line react/no-access-state-in-setstate
      update(this.state, {
        xAxis: {
          $set: {
            textColor: processColor('#0e141e'),
            textSize: 12,
            gridColor: processColor('#DCDCDC'),
            gridLineWidth: StyleSheet.hairlineWidth,
            axisLineColor: processColor('#DCDCDC'),
            axisLineWidth: StyleSheet.hairlineWidth,
            fontFamily: 'SFProDisplay-Regular',
            avoidFirstLastClipping: true,
            position: 'BOTTOM',
          },
        },
        yAxis: {
          $set: {
            left: {
              drawAxisLine: true,
              axisLineColor: processColor('#DCDCDC'),
              axisLineWidth: StyleSheet.hairlineWidth,
              avoidFirstLastClipping: true,
              gridLineWidth: StyleSheet.hairlineWidth,
              gridColor: processColor('#DCDCDC'),
              textSize: 12,
              fontFamily: 'SFProDisplay-Regular',
              textColor: processColor('#0e141e'),
              position: 'INSIDE_CHART',
            },
            right: {
              drawAxisLine: true,
              axisLineColor: processColor('#DCDCDC'),
              axisLineWidth: StyleSheet.hairlineWidth,
              avoidFirstLastClipping: true,
              gridLineWidth: StyleSheet.hairlineWidth,
              gridColor: processColor('#DCDCDC'),
              textSize: 12,
              fontFamily: 'SFProDisplay-Regular',
              textColor: processColor('#0e141e'),
              position: 'INSIDE_CHART',
            },
          },
        },
        data: {
          $set: {
            dataSets: [
              {
                values: [{y: 0}],
                label: '',
                config: {
                  lineWidth: 1.5,
                  drawCircles: false,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: false,
                  color: processColor(config.color),
                  drawFilled: true,
                  fillColor: processColor(config.color),
                  fillAlpha: 100,
                },
              },
            ],
          },
        },
      }),
    );
  }

  // handleSelect(event) {
  //   const entry = event.nativeEvent;
  //   if (entry == null) {
  //     this.setState({ ...this.state, selectedEntry: null });
  //   } else {
  //     this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
  //   }

  //   console.log(event.nativeEvent);
  // }

  render() {
    const {data, xAxis, yAxis} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={data}
            chartDescription={{text: ''}}
            xAxis={xAxis}
            yAxis={yAxis}
            legend={{enabled: false}}
            // onSelect={this.handleSelect.bind(this)}
            // onChange={event => console.log(event.nativeEvent)}
            maxVisibleValueCount={5}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // transform: [{ rotate: '-180deg'}]
  },
  chart: {
    flex: 1,
  },
});

export default DepthGraph;
