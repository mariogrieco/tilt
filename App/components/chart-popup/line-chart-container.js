import React, {Component} from 'react';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import isEqual from 'lodash/isEqual';
import {View, processColor} from 'react-native';
import {LineChart, BarChart} from 'react-native-charts-wrapper';
// import Client4 from '../../api/MattermostClient';
// import moment from 'moment';

class LineChartContainer extends Component {
  state = {
    data: null,
    loading: false,
  };

  // componentWillUnmount() {
  //   this.setState({
  //     data: null,
  //     barChartData: null,
  //   });
  // }

  // getKlinesData(symbol) {
  //   this.setState(
  //     {
  //       loading: true,
  //     },
  //     async () => {
  //       try {
  //         const {data} = await Client4.getKlines(
  //           symbol,
  //           '30m',
  //           moment()
  //             .subtract(1, 'days')
  //             .utc()
  //             .valueOf(),
  //         );
  //         this.setDataState(data);
  //       } catch (ex) {
  //         console.log('ex: ', ex);
  //         return ex;
  //       } finally {
  //         this.setState({
  //           loading: false,
  //         });
  //       }
  //     },
  //   );
  // }

  setDataState(items) {
    const barChartData = [];
    const nextState = items.map(item => {
      barChartData.push({y: item.volume});
      return {x: item.date, y: item.close};
    });

    this.setState({
      data: nextState,
      barChartData,
    });
  }

  componentDidMount() {
    if (
      this.props.data &&
      this.props.data.items &&
      this.props.data.items.length > 0
    ) {
      this.setDataState(this.props.data.items);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        isIex: this.props.data.isIex,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const {theme, isRed} = this.props;
    const {data, barChartData, isIex} = this.state;
    return (
      <View
        style={
          data
            ? {
                paddingTop: 5,
                height: 460,
              }
            : {}
        }>
        <View style={styles.container}>
          {data && (
            <LineChart
              chartDescription={{text: ''}}
              style={styles.chart}
              backgroundColor={theme.modalPopupBackgroundColor}
              drawGridBackground={false}
              drawBorders={false}
              touchEnabled={false}
              dragEnabled={false}
              scaleEnabled={false}
              scaleXEnabled={false}
              scaleYEnabled={false}
              legend={{
                enabled: false,
              }}
              // animation={{
              //   durationX: 0,
              //   durationY: 0,
              //   easingY: 'EaseInOutQuart',
              // }}
              xAxis={{
                textColor: processColor(theme.primaryTextColor),
                granularity: 1,
                labelCount: 5,
                avoidFirstLastClipping: true,
                position: 'TOP',
                valueFormatter: 'date',
                valueFormatterPattern: isIex ? 'MMM dd' : 'HH:MM',
                axisLineColor: processColor(theme.borderBottomColor),
                axisLineWidth: StyleSheet.hairlineWidth,
                gridLineWidth: StyleSheet.hairlineWidth,
                gridColor: processColor(theme.borderBottomColor),
              }}
              yAxis={{
                left: {
                  enabled: true,
                  drawAxisLine: true,
                  axisLineWidth: StyleSheet.hairlineWidth,
                  axisLineColor: processColor(theme.borderBottomColor),
                  drawGridLines: false,
                  drawLabels: false,
                },
                right: {
                  enabled: true,
                  position: 'INSIDE_CHART',
                  axisMinValue: 0,
                  textSize: 11,
                  fontFamily: 'SFProDisplay-Regular',
                  labelCount: 5,
                  // axisMinimum: 0,
                  avoidFirstLastClipping: true,
                  textColor: processColor(theme.primaryTextColor),
                  axisLineColor: processColor(theme.borderBottomColor),
                  axisLineWidth: StyleSheet.hairlineWidth,
                  gridLineWidth: StyleSheet.hairlineWidth,
                  gridColor: processColor(theme.borderBottomColor),
                },
              }}
              data={{
                dataSets: [
                  {
                    config: {
                      // mode: 'CUBIC_BEZIER',
                      drawValues: false,
                      lineWidth: 1,
                      drawCircles: false,
                      circleColor: processColor('transparent'),
                      drawCircleHole: false,
                      circleRadius: 0,
                      highlightColor: processColor('transparent'),
                      color: processColor(isRed ? '#fc3e30' : '#17c491'),
                      drawFilled: true,
                      fillGradient: {
                        colors: [
                          processColor(
                            isRed
                              ? theme.modalPopupBackgroundColor
                              : theme.modalPopupBackgroundColor,
                          ),
                          processColor(isRed ? '#fc3e30' : '#17c491'),
                        ],
                        positions: [0, 0.5],
                        angle: 90,
                        orientation: 'BOTTOM_TOP',
                      },
                      fillAlpha: 100,
                    },
                    values: data,
                    label: 'A',
                  },
                ],
                label: '',
              }}
            />
          )}
          {barChartData && (
            <BarChart
              style={styles.barChart}
              chartDescription={{text: ''}}
              backgroundColor={theme.modalPopupBackgroundColor}
              drawGridBackground={false}
              drawBorders={false}
              touchEnabled={false}
              dragEnabled={false}
              scaleEnabled={false}
              scaleXEnabled={false}
              scaleYEnabled={false}
              drawValueAboveBar={false}
              drawBarShadow={false}
              legend={{
                enabled: false,
              }}
              xAxis={{
                granularityEnabled: false,
                granularity: 1,
                drawGridLines: false,
                drawLabels: false,
                drawAxisLine: false,
                fontSize: 0,
                yOffset: 0,
              }}
              yAxis={{
                drawAxisLine: false,
                drawGridLines: false,
                drawLabels: false,
                left: {
                  drawAxisLine: false,
                  drawGridLines: false,
                  drawLabels: false,
                  spaceTop: 0,
                  spaceBottom: 0,
                },
                right: {
                  drawAxisLine: false,
                  drawGridLines: false,
                  drawLabels: false,
                  spaceTop: 0,
                  spaceBottom: 0,
                },
              }}
              data={{
                dataSets: [
                  {
                    textColor: processColor('transparent'),
                    values: barChartData,
                    label: '',
                    config: {
                      color: processColor(theme.volumeBarColor),
                      drawValues: false,
                    },
                  },
                ],
                config: {
                  barWidth: 0.8,
                },
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  chart: {
    flex: 3,
    marginBottom: 0,
    paddingBottom: 0,
  },
  barChart: {
    flex: 0.8,
    paddingTop: 0,
    marginTop: 0,
  },
});

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LineChartContainer);
