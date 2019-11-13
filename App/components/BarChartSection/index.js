import React from 'react';
import {StyleSheet, View, processColor} from 'react-native';
import {connect} from 'react-redux';
import {BarChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import config from './config';

class BarChartSection extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data.length > 0) {
      return update(state, {
        data: {
          dataSets: {
            $set: [
              {
                values: props.data,
                label: 'Bar dataSet',
                config: {
                  highlightEnabled: false,
                  colors: props.colors,
                  // barShadowColor: processColor('lightgrey'),
                  // highlightAlpha: 90,
                  // highlightColor: processColor('red'),
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
    description: {},
    legend: {},
    data: {},
    // highlights: [],
    xAxis: {},
    yAxis: {},
  };

  componentDidMount() {
    this.setState({
      ...config,
    });
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
    const {description, data, xAxis, yAxis, legend} = this.state;
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <BarChart
          chartDescription={description}
          style={styles.chart}
          marker={{enabled: false}}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
          // animation={{ durationX: 2000 }}
          legend={legend}
          gridBackgroundColor={processColor('#fff')}
          chartBackgroundColor={processColor(theme.primaryBackgroundColor)}
          // visibleRange={{ x: { min: 0, max: 5 } }}
          drawBarShadow={false}
          // drawValueAboveBar
          pinchZoom={false}
          // scaleEnabled={false}
          dragEnabled={false}
          doubleTapToZoomEnabled={false}
          // onSelect={this.handleSelect.bind(this)}
          // highlights={this.state.highlights}
          // onChange={event => console.log(event.nativeEvent)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
});

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(BarChartSection);
