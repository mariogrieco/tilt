const getPrivateMessagesChnnelsList = (state, channel = {}) => {
  const myId = state.login && state.login.user ? state.login.user.id : '';
  const userId = channel.name.replace(`${myId}`, '').replace('__', '');
  channel.name = state.users.data[userId]
    ? state.users.data[userId].username
    : '';
  return channel.name;
};

export default getPrivateMessagesChnnelsList;
