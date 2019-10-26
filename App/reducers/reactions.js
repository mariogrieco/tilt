import {
  ADDED_REACTION,
  REMOVED_REACTION,
  GET_REACTIONS_FOR_USER_SUCCES,
} from '../actions/reactions';

const initialState = {
  user_id: [],
};

function normalizePayload(reactions) {
  const current_reactions = [
    '+1',
    '-1',
    'frowning_face',
    'joy',
    'rocket',
    'eyes',
  ];
  return current_reactions.map(key => {
    const match = reactions.find(r => r.EmojiName === key);
    if (match) {
      return match;
    }
    return {EmojiName: key, sum: 0};
  });
}

const reactions = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS_FOR_USER_SUCCES: {
      return {
        [action.payload.userId]: normalizePayload(action.payload.reactions),
      };
    }
    case REMOVED_REACTION: {
      const {emojiName, userId} = action.payload;
      const nextState = {...state};
      if (nextState[userId]) {
        nextState[userId].find((reaction, index) => {
          const nextReactions = {...reaction};
          if (reaction.EmojiName === emojiName) {
            nextReactions.sum -= 1;
            nextReactions.sum = nextReactions.sum <= 0 ? 0 : nextReactions.sum;
            if (nextState[userId][index]) {
              nextState[userId][index].sum = nextReactions.sum;
            }
            return true;
          }
        });
      }
      return nextState;
    }
    case ADDED_REACTION: {
      const {emojiName, userId} = action.payload;
      const nextState = {...state};
      if (nextState[userId]) {
        nextState[userId].find((reaction, index) => {
          const nextReactions = {...reaction};
          if (reaction.EmojiName === emojiName) {
            if (nextState[userId][index]) {
              nextState[userId][index].sum = ++nextReactions.sum;
            }
          }
        });
      }
      return nextState;
    }
    default: {
      return state;
    }
  }
};

export default reactions;
