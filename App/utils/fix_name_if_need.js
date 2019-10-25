function fix_name_if_need(channel) {
  if (channel && channel.name && channel.name.length <= 3) {
    return {
      ...channel,
      name: channel.name.replace('11', ''),
    };
  }
  return channel;
}

export default fix_name_if_need;
