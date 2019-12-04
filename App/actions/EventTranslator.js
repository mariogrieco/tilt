import store from '../config/store';
import {
  addPostTo,
  removeFromPost,
  editPost,
  removePostFromChannelId,
} from './posts';
import {getChannelById, channelUpdated, deleteChannelSucess} from './channels';
import {removedReaction, addedReaction} from './reactions';
import {getPostCount} from './postCount';
import {userUpdatedSuccess, getNewUser} from './users';
import {getReactionsForUser} from './reactions';
import moment from 'moment';

const eventsDispatched = data => {
  switch (data.event) {
    case 'reaction_added': {
      const reaction = JSON.parse(data.data.reaction);
      return store.dispatch(
        addedReaction(reaction.emoji_name, reaction.user_id, reaction.post_id),
      );
    }
    case 'reaction_removed': {
      const reaction = JSON.parse(data.data.reaction);
      return store.dispatch(
        removedReaction(
          reaction.emoji_name,
          reaction.user_id,
          reaction.post_id,
        ),
      );
    }
    case 'posted': {
      const post = JSON.parse(data.data.post);
      return Promise.all([
        store.dispatch(getPostCount(post.user_id)),
        store.dispatch(addPostTo(post)),
      ]);
    }
    case 'post_deleted': {
      const post = JSON.parse(data.data.post);
      return store.dispatch(removeFromPost(post));
    }
    case 'post_edited': {
      const post = JSON.parse(data.data.post);
      return Promise.all([
        store.dispatch(getReactionsForUser(post.user_id)),
        store.dispatch(editPost(post)),
      ]);
    }
    case 'direct_added': {
      const {channel_id} = data.broadcast;
      return store.dispatch(getChannelById(channel_id, true));
    }
    case 'channel_created': {
      const {channel_id} = data.data;
      return store.dispatch(getChannelById(channel_id));
    }
    case 'new_user': {
      return store.dispatch(getNewUser(data.data.user_id));
    }
    case 'channel_updated': {
      const newChannel = JSON.parse(data.data.channel);
      return store.dispatch(channelUpdated(newChannel));
    }
    case 'user_updated': {
      const {user} = data.data;
      user.last_picture_update = moment().valueOf();
      return store.dispatch(userUpdatedSuccess(user));
    }
    case 'channel_deleted': {
      const {channel_id} = data.data;
      return Promise.all([
        store.dispatch(removePostFromChannelId(channel_id)),
        store.dispatch(
          deleteChannelSucess({
            channelId: channel_id,
          }),
        ),
      ]);
    }
    default:
      // console.log(data)
      return null;
  }
};

export default eventsDispatched;
