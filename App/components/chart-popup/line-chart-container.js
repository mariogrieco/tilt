import React, {Component} from 'react';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import isEqual from 'lodash/isEqual';
import {View, processColor} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import Client4 from '../../api/MattermostClient';
import moment from 'moment';

class LineChartContainer extends Component {
  state = {
    data: null,
    loading: false,
  };

  componentWillUnmount() {
    this.setState({
      data: null,
    });
  }

  getKlinesData(symbol) {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const {data} = await Client4.getKlines(
            symbol,
            '30m',
            moment()
              .subtract(1, 'days')
              .utc()
              .valueOf(),
          );
          this.setDataState(data);
        } catch (ex) {
          console.log('ex: ', ex);
          return ex;
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  }

  setDataState(items) {
    const nextState = items.map(item => {
      return {x: parseFloat(item[0]), y: parseFloat(item[4])};
    });
    this.setState({
      data: nextState,
    });
  }

  componentDidMount(nextProps) {
    this.getKlinesData(this.props.symbol);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const {theme, isRed} = this.props;
    const {data} = this.state;
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1, width: '100%', paddingTop: 10}}>
        <View style={styles.container}>
          {data && (
            <LineChart
              chartDescription={{text: ''}}
              style={styles.chart}
              backgroundColor={theme.primaryBackgroundColor}
              drawGridBackground={false}
              drawBorders={false}
              touchEnabled={true}
              dragEnabled={false}
              scaleEnabled={false}
              scaleXEnabled={false}
              scaleYEnabled={false}
              legend={{
                enabled: false,
              }}
              animation={{
                durationX: 0,
                durationY: 1500,
                easingY: 'EaseInOutQuart',
              }}
              xAxis={{
                textColor: processColor(theme.primaryTextColor),
                // granularity: 1,
              }}
              yAxis={{
                axisMinValue: 0,
                axisMinimum: 0,
                left: {
                  enabled: false,
                },
                right: {
                  enabled: true,
                  textColor: processColor(theme.primaryTextColor),
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
                          processColor(isRed ? '#fc3e30' : '#17c491'),
                          processColor('transparent'),
                        ],
                        positions: [0, 0.5],
                        angle: 90,
                        orientation: 'TOP_BOTTOM',
                      },
                      fillAlpha: 1000,
                    },
                    values: data,
                    label: 'A',
                  },
                ],
                label: '',
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
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  chart: {
    flex: 1,
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
