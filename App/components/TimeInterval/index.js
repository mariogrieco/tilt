import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import uuid from 'react-uuid';
import Interval from '../Interval';
import {changeInterval} from '../../actions/candle';
import {CANDLE_INTERVAL_MODERATE} from '../../config/refreshIntervals';
import intervals from './intervals';
import styles from './styles';

class TimeInterval extends React.Component {
  constructor(props) {
    super(props);
    this.intervalId = null;
  }

  componentDidMount() {
    const {onSelect, selectedInterval} = this.props;
    if (onSelect) {
      this.intervalId = setInterval(() => {
        onSelect(
          intervals[selectedInterval].interval,
          intervals[selectedInterval].starTimeMilliseconds(),
          intervals[selectedInterval].format,
        );
      }, CANDLE_INTERVAL_MODERATE);
      onSelect(
        intervals[selectedInterval].interval,
        intervals[selectedInterval].starTimeMilliseconds(),
        intervals[selectedInterval].format,
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleSelect = index => {
    const {onSelect, dispatchInterval} = this.props;
    dispatchInterval(index);
    if (onSelect) {
      clearInterval(this.intervalId);
      // inmediate refresh
      onSelect(
        intervals[index].interval,
        intervals[index].starTimeMilliseconds(),
        intervals[index].format,
      );
      this.intervalId = setInterval(() => {
        onSelect(
          intervals[index].interval,
          intervals[index].starTimeMilliseconds(),
          intervals[index].format,
        );
      }, CANDLE_INTERVAL_MODERATE);
    }
  };

  render() {
    const {selectedInterval} = this.props;
    return (
      <View style={{flex: 0.23, justifyContent: 'center'}}>
        <View style={styles.controls}>
          {intervals.map((interval, index) => (
            <Interval
              tag={interval.startTimeTag}
              selected={index === selectedInterval}
              key={uuid()}
              onPress={() => this.handleSelect(index)}
            />
          ))}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({candle: selectedInterval}) => selectedInterval;

export default connect(
  mapStateToProps,
  {dispatchInterval: changeInterval},
)(TimeInterval);
