function fix_name_if_need(channel) {
  if (
    channel &&
    channel.name &&
    channel.name.length <= 3 &&
    channel.type !== 'D'
  ) {
    return {
      ...channel,
      name: channel.name.replace('11', ''),
    };
  }
  if (channel && channel.name && channel.name.match('town-square')) {
    return {
      ...channel,
      name: 'welcome',
    };
  }
  return channel;
}

export default fix_name_if_need;
