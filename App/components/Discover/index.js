import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {FlatList, ActivityIndicator} from 'react-native';
import isEqual from 'lodash/isEqual';
import getJoinChannelsList from '../../selectors/getJoinChannelsList';
import ChannelDisplayName from '../ChannelDisplayName';
// import {setChannelPaginator, getChannels} from '../../actions/channels';
import {getHashtagChannels} from '../../actions/HashtagChannelsPaginator';

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
          const {page, stop} = this.props;
          if (stop) {
            return null;
          }
          await this.props.getHashtagChannels(page);
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

  componentDidMount() {
    this._fetchMore();
  }

  renderItem({item}) {
    return (
      <ChannelDisplayName
        showMembersLabel={false}
        name={item.name}
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
        />
        {loading && <ActivityIndicator size="large" color="#17C491" />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  channels: getJoinChannelsList(state),
  current_page: state.hashtagChannelsPaginator.page,
  stop: state.hashtagChannelsPaginator.stop,
});

export default connect(
  mapStateToProps,
  {getHashtagChannels},
)(Discover);
