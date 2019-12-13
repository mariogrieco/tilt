import {
  // ADDED_REACTION,
  // REMOVED_REACTION,
  GET_REACTIONS_FOR_USER_SUCCES,
} from '../actions/reactions';

const initialState = {};
export const current_reactions = [
  '+1',
  '-1',
  'frowning_face',
  'joy',
  'rocket',
  'eyes',
];

function normalizePayload(reactions) {
  return current_reactions
    .map(key => {
      const match = reactions.find(r => r.EmojiName === key);
      if (match) {
        return match;
      }
      return null;
    })
    .filter(r => r);
}

const reactions = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS_FOR_USER_SUCCES: {
      return {
        [action.payload.userId]: normalizePayload(action.payload.reactions),
      };
    }
    // case REMOVED_REACTION: {
    //   const {emojiName, user_id, post_id} = action.payload;
    //   const nextState = {...state};
    //   if (nextState[user_id]) {
    //     nextState[user_id].find((reaction, index) => {
    //       const nextReactions = {...reaction};
    //       if (
    //         reaction.EmojiName === emojiName &&
    //         nextState[`${post_id}-added-${emojiName}`]
    //       ) {
    //         nextReactions.sum -= 1;
    //         nextReactions.sum = nextReactions.sum <= 0 ? 0 : nextReactions.sum;
    //         if (nextState[user_id][index]) {
    //           nextState[user_id][index].sum = nextReactions.sum;
    //           nextState[`${post_id}-added-${emojiName}`] = false;
    //         }
    //         return true;
    //       }
    //     });
    //   }
    //   return nextState;
    // }
    // case ADDED_REACTION: {
    //   const {emojiName, user_id, post_id} = action.payload;
    //   const nextState = {...state};
    //   if (nextState[user_id]) {
    //     nextState[user_id].find((reaction, index) => {
    //       const nextReactions = {...reaction};
    //       if (reaction.EmojiName === emojiName) {
    //         if (nextState[user_id][index]) {
    //           if (!nextState[`${post_id}-added-${emojiName}`]) {
    //             nextState[user_id][index].sum = ++nextReactions.sum;
    //           }
    //           nextState[`${post_id}-added-${emojiName}`] = true;
    //         }
    //       }
    //     });
    //   }
    //   return nextState;
    // }
    default: {
      return state;
    }
  }
};

export default reactions;
