import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {FlatList, ActivityIndicator, Platform} from 'react-native';
import isEqual from 'lodash/isEqual';
import {withNavigation} from 'react-navigation';
import getJoinChannelsList from '../../selectors/getJoinChannelsList';
import ChannelDisplayName from '../ChannelDisplayName';
// import {setChannelPaginator, getChannels} from '../../actions/channels';
import {
  getHashtagChannels,
  getPageOnFocus,
} from '../../actions/HashtagChannelsPaginator';

class Discover extends React.Component {
  state = {
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('didFocus', () => {
      this.props.getPageOnFocus();
    });
    this.props.getPageOnFocus();
  }

  _fetchMore = ({distanceFromEnd}) => {
    if (distanceFromEnd < 0) return null;
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
          const channels = await this.props.getHashtagChannels(page);
          console.log(channels);
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
    console.log(channels.length);
    return (
      <Fragment>
        <FlatList
          style={{flex: 1}}
          data={channels}
          extraData={channels}
          keyExtractor={channel => channel.id}
          renderItem={this.renderItem}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 0.15}}
          initialNumToRender={50}
          onEndReached={this._fetchMore}
          onEndReachedThreshold={0.15}
          keyboardDismissMode="on-drag"
          updateCellsBatchingPerio={150}
          maxToRenderPerBatch={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
        {loading && <ActivityIndicator size="large" color="#17C491" />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  channels: getJoinChannelsList(state),
  page: state.hashtagChannelsPaginator.page,
  stop: state.hashtagChannelsPaginator.stop,
});

export default withNavigation(
  connect(
    mapStateToProps,
    {getHashtagChannels, getPageOnFocus},
  )(Discover),
);
