import React from 'react';
import {View, Text} from 'react-native';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import JoinBigBtn from '../JoinBigBtn';
import {addToChannel} from '../../actions/channels';
import {getPostsForChannel} from '../../actions/posts';
import Channel from '../../Screens/Channel';
import isEqual from 'lodash/isEqual';

import ChannelPreview from '../ChannelPreview';

class ChannelOptionalView extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  handleJoin = async () => {
    const {meId, active_channel_id} = this.props;
    try {
      await this.props.addToChannel(meId, active_channel_id);
      await this.props.getPostsForChannel(active_channel_id, 0);
    } catch (err) {
      alert(err.message || err);
    }
  };

  render() {
    const {onMychannel, channel, active_channel_id, theme} = this.props;
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        {!onMychannel && channel && (
          <ChannelPreview
            channel_id={active_channel_id}
            onJoin={this.handleJoin}
          />
        )}
        {onMychannel && <Channel isDollar displayAs="tab" />}
        {!onMychannel && !channel && !!active_channel_id && (
          <Text>
            Unable to find an existing channel for the current symbol.
          </Text>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {active_channel_id} = state.appNavigation;
  const onMychannel = state.myChannelsMap.get(active_channel_id);
  const channel = state.mapChannels.get(active_channel_id);
  return {
    onMychannel,
    channel,
    active_channel_id,
    meId: state.login.user ? state.login.user.id : {},
    theme: state.themes[state.themes.current],
  };
};

const mapDispatchToProps = {
  addToChannel,
  getPostsForChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelOptionalView);
