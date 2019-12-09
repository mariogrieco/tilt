import React, {Component} from 'react';
import {FlatList, Platform} from 'react-native';
import {connect} from 'react-redux';
import Separator from '../Separator';
import SymbolSummary from '../SymbolSummary';

// import styles from './styles';

class StockSearch extends Component {
  keyExtractor(channel) {
    return channel.id;
  }

  onPress = channel_id => {
    // eslint-disable-next-line no-alert
    // alert(channel_id);
  };

  renderItem = ({item}) => {
    return (
      <SymbolSummary
        channelId={item.id}
        header={item.header}
        name={item.display_name}
        hidde_prices
        onPress={this.onPress.bind(this, item.id)}
        join={item.join}
        onJoin={this.join}
      />
    );
  };

  render() {
    const {list, theme} = this.props;
    return (
      <FlatList
        extraData={list}
        data={list}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={50}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={Separator}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: state.themes[state.themes.current],
  list: ownProps.list.map(channel => ({
    ...channel,
    join: !state.myChannelsMap.get(channel.id),
  })),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockSearch);
