const getChannelMuteConf = (state, channel_id) => {
  const channelProps = state.channelsProps[channel_id];

  if (!channelProps) {
    return false;
  }
  if (channelProps.notify_props) {
    return channelProps.notify_props.mark_unread === 'mention';
  }

  return false;
};

export default getChannelMuteConf;
