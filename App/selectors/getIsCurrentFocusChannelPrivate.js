import findIndex from 'lodash/findIndex';
import memoize from 'lodash/memoize';
import getPrivateMessagesChnnelsList from './getPrivateMessagesChnnelsList';

const getIsCurrentFocusChannelPrivate = (state) => {
  const channels = getPrivateMessagesChnnelsList(state);
  return findIndex(channels, { id: state.appNavigation.active_channel_id }) !== -1;
};

export default memoize(getIsCurrentFocusChannelPrivate);
