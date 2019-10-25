const getPrivateMessagesChnnelsList = (state, channel = {}) => {
  const myId = state.login && state.login.user ? state.login.user.id : '';
  const userId = channel.name.replace(`${myId}`, '').replace('__', '');
  channel.display_name = state.users.data[userId]
    ? state.users.data[userId].username
    : '';
  return channel.display_name;
};

export default getPrivateMessagesChnnelsList;
