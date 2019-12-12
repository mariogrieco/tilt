import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {FlatList, ActivityIndicator, Platform} from 'react-native';
import isEqual from 'lodash/isEqual';
import {withNavigation} from 'react-navigation';
import getMyChannels from '../../selectors/getMyChannels';
import ChannelDisplayName from '../ChannelDisplayName';
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
    // if (this.navigationListener) {
    //   this.navigationListener.remove();
    // }
  }

  componentDidMount() {
    // const {navigation} = this.props;
    // this.navigationListener = navigation.addListener('didFocus', () => {
    //   // this.props.getPageOnFocus();
    // });
    // this.getData();
    // this.props.getPageOnFocus();
  }

  _fetchMore = ({distanceFromEnd}) => {
    // if (distanceFromEnd < 0) {
    //   return null;
    // }
    // this.getData();
  };

  getData() {
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
  }

  renderItem({item}) {
    return (
      <ChannelDisplayName
        name={item.name}
        key={item.id}
        create_at={item.create_at}
        channel_id={item.id}
        channel={item}
        content_type={item.content_type}
        fav={item.fav}
        showMembersLabel
        members={item.members}
      />
    );
  }

  render() {
    const {channels} = this.props;
    const {loading} = this.state;
    const {theme} = this.props;
    return (
      <Fragment>
        <FlatList
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}
          data={channels}
          extraData={channels}
          keyExtractor={channel => channel.id}
          renderItem={this.renderItem}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 0.15}}
          initialNumToRender={50}
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
  channels: getMyChannels(
    state,
    channel => channel.content_type === 'N' && channel.type === 'O',
  ),
  page: state.hashtagChannelsPaginator.page,
  stop: state.hashtagChannelsPaginator.stop,
  theme: state.themes[state.themes.current],
});

export default withNavigation(
  connect(
    mapStateToProps,
    {getHashtagChannels, getPageOnFocus},
  )(Discover),
);
