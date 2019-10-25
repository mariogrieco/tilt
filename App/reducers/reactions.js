import {
  ADDED_REACTION,
  REMOVED_REACTION,
  GET_REACTIONS_FOR_USER_SUCCES,
} from '../actions/reactions';

const initialState = {
  user_id: [],
};

const reactions = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS_FOR_USER_SUCCES: {
      return {
        [action.payload.userId]: action.payload.reactions,
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
