import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';
import concat from 'lodash/concat';
import uniqBy from 'lodash/uniqBy';
import Toggle from '../Toggle';
import ChannelDisplayName from '../ChannelDisplayName';
import SearchUserDisplay from '../SearchUserDisplay';
import {getFavoriteChannelById} from '../../selectors/getFavoriteChannels';

import getChannelsList from '../../selectors/getChannelsList';

class PublicSearch extends React.Component {
  state = {
    currentToggleSelected: 'left',
  };

  handleTogglePress = currentToggleSelected =>
    this.setState({currentToggleSelected});

  getParseName(channel) {
    return channel.name;
  }

  render() {
    const {
      channels,
      users,
      searchValue,
      mapChannelsForJoin,
      mapFavoritesChannels,
      channelStatsGroup,
      mapChannelsColors,
    } = this.props;
    const {currentToggleSelected} = this.state;

    return (
      <ScrollView>
        <View
          style={{
            width: '57%',
            paddingLeft: 15,
            marginTop: 15,
            marginBottom: 15,
          }}>
          <Toggle
            leftLabel="Channels"
            rightLabel="Members"
            onPress={this.handleTogglePress}
          />
        </View>
        {currentToggleSelected === 'left'
          ? channels
              .filter(channel =>
                this.getParseName(channel).includes(searchValue),
              )
              .map(channel => (
                <ChannelDisplayName
                  show
                  channel={channel}
                  members={channelStatsGroup[channel.id] || 0}
                  display_name={channel.display_name}
                  create_at={channel.create_at}
                  key={channel.id}
                  channel_id={channel.id}
                  header={channel.header}
                  showMembersLabel={!!mapChannelsForJoin[channel.id]}
                  join={!mapChannelsForJoin[channel.id]}
                  fav={mapFavoritesChannels[channel.id]}
                  titleColor={mapChannelsColors[channel.id]}
                />
              ))
          : users
              .filter(user => user && user.username.includes(searchValue))
              .map(user => (
                <SearchUserDisplay
                  key={user ? user.id : ''}
                  username={user ? user.username : ''}
                  id={user ? user.id : ''}
                />
              ))}
      </ScrollView>
    );
  }
}

PublicSearch.defaultProps = {
  channels: [],
  users: {},
  myChannels: [],
  searchValue: '',
};

const mapStateToProps = state => {
  const {users, myChannelsMap, channelStatsGroup} = state;
  let channels = [...state.mapChannels.valueSeq().toJS()];
  const mapChannelsForJoin = {};
  const mapFavoritesChannels = {};
  const mapChannelsColors = {};
  const searchResult = state.search;

  getChannelsList(state).forEach(channel => {
    mapChannelsForJoin[channel.id] = true;
    mapFavoritesChannels[channel.id] = getFavoriteChannelById(
      state,
      channel.id,
    );
    mapChannelsColors[channel.id] = channel.titleColor;
  });
  const sponsoredIds = state.sponsored;
  const usersWithOutSponsored = Object.values(users.data).filter(
    user => !sponsoredIds.includes(user.id),
  );

  channels = concat(searchResult, channels);
  channels = uniqBy(channels, 'id');

  return {
    channels,
    users: usersWithOutSponsored,
    mapChannelsForJoin,
    mapFavoritesChannels,
    channelStatsGroup,
    mapChannelsColors,
    myChannels: myChannelsMap.valueSeq().toJS(),
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicSearch);
