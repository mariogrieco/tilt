import React, { lazy, Suspense } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Description from '../ChartViewTopDescription';
import CandleSection from '../CandleSection';
import { ChartBanner } from '../AdBanner';

const DepthSection = lazy(() => import('../DepthSection'));


class Chart extends React.PureComponent {
  state = {
    selectedChart: 'left'
  }

  handleToggle = (_selectedChart) => {
    const { selectedChart } = this.state;
    if (_selectedChart !== selectedChart) this.setState({ selectedChart: _selectedChart });
  }

  render() {
    const {
      selectedSymbol: {
        symbol
      }
    } = this.props;
    const { selectedChart } = this.state;
    return (
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <View style={{ flex: 0.23 }}>

          <Description
            onToggle={this.handleToggle}
          />
        </View>
        {
      selectedChart === 'left'
        ? <CandleSection symbol={symbol} />
        : (
          <Suspense
            fallback={(
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }}
              >
                <ActivityIndicator size="large" color="#17C491" />
              </View>
)}
          >
            <DepthSection symbol={symbol} />
          </Suspense>
        )
    }
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ChartBanner />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ watchlist: { selectedSymbol } }) => ({ selectedSymbol });

export default connect(mapStateToProps)(Chart);
