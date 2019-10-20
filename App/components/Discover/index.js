import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {FlatList, ActivityIndicator} from 'react-native';
import isEqual from 'lodash/isEqual';
import getJoinChannelsList from '../../selectors/getJoinChannelsList';
import ChannelDisplayName from '../ChannelDisplayName';
import {setChannelPaginator, getChannels} from '../../actions/channels';

class Discover extends React.Component {
  state = {
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  _fetchMore = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const {
            setChannelPaginator,
            getChannels,
            current_page,
            stop,
          } = this.props;
          if (stop) return null;
          const result = await getChannels(current_page + 1);
          setChannelPaginator({
            current_page: current_page + 1,
            stop: result.length === 0 ? true : false,
          });
        } catch (ex) {
          alert(ex.message || ex);
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  renderItem({item}) {
    return (
      <ChannelDisplayName
        showMembersLabel={false}
        display_name={item.name}
        key={item.id}
        create_at={item.create_at}
        channel_id={item.id}
        channel={item}
        join
      />
    );
  }

  render() {
    const {channels} = this.props;
    const {loading} = this.state;
    return (
      <Fragment>
        <FlatList
          style={{flex: 1}}
          data={channels}
          extraData={channels}
          keyExtractor={channel => channel.id}
          renderItem={this.renderItem}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 35}}
          initialNumToRender={22}
          onEndReached={this._fetchMore}
          onEndReachedThreshold={0.35}
          keyboardDismissMode="on-drag"
        />
        {loading && <ActivityIndicator size="large" color="#17C491" />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  channels: getJoinChannelsList(state),
  current_page: state.channelsPaginator.current_page,
  stop: state.channelsPaginator.stop,
});

export default connect(
  mapStateToProps,
  {
    setChannelPaginator,
    getChannels,
  },
)(Discover);
