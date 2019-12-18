import Client4 from '../api/MattermostClient';

export const ADD_REACTION_SUCCESS = 'ADD_REACTION_SUCCESS';
export const ADD_REACTION_ERROR = 'ADD_REACTIONS_ERROR';

export const REMOVE_REACTION_SUCESS = 'REMOVE_REACTION_SUCESS';
export const REMOVE_REACTION_ERROR = 'REMOVE_REACTION_ERROR';

export const GET_REACTIONS_FOR_USER_SUCCES = 'GET_REACTIONS_FOR_USER_SUCCES';
export const GET_REACTIONS_FOR_USER_ERROR = 'GET_REACTIONS_FOR_USER_ERROR';

export const ADDED_REACTION = 'ADDED_REACTION';
export const REMOVED_REACTION = 'REMOVED_REACTION';

import {current_reactions} from '../reducers/reactions';

export const getReactionsForUser = userId => async dispatch => {
  try {
    const reactions = await Client4.getReactionsForUser(userId);
    dispatch(
      getReactionsForUserSucess({
        reactions,
        userId,
      }),
    );
    return reactions.filter(reaction =>
      current_reactions.find(name => reaction.EmojiName === name),
    );
  } catch (ex) {
    dispatch(getReactionsForUserError(ex));
    return Promise.reject(ex.message);
  }
};

export const getReactionsForUserSucess = payload => ({
  type: GET_REACTIONS_FOR_USER_SUCCES,
  payload,
});

export const getReactionsForUserError = err => ({
  type: GET_REACTIONS_FOR_USER_ERROR,
  payload: err,
});

export const addReaction = (userId, postId, emojiName) => async dispatch => {
  try {
    const r = await Client4.addReaction(userId, postId, emojiName);
    // dispatch(addReactionsSucess(r));
    return r;
  } catch (ex) {
    dispatch(addReactionsError(ex));
    return Promise.reject(ex.message);
  }
};

export const addReactionsSucess = reaction => ({
  type: ADD_REACTION_SUCCESS,
  payload: reaction,
});

export const addReactionsError = err => ({
  type: ADD_REACTION_ERROR,
  payload: err,
});

export const removeReaction = (userId, postId, emojiName) => async dispatch => {
  try {
    const r = await Client4.removeReaction(userId, postId, emojiName);
    dispatch(removeReactionsSucess(r));
    return r;
  } catch (ex) {
    dispatch(removeReactionsError(ex));
    return Promise.reject(ex.message);
  }
};

export const removeReactionsSucess = reaction => ({
  type: REMOVE_REACTION_SUCESS,
  payload: reaction,
});

export const removeReactionsError = err => ({
  type: REMOVE_REACTION_ERROR,
  payload: err,
});


export const removedReaction = (emojiName, user_id, post_id) => ({
  type: REMOVED_REACTION,
  payload: {emojiName, user_id, post_id},
});

export const addedReaction = (emojiName, user_id, post_id) => ({
  type: ADDED_REACTION,
  payload: {emojiName, user_id, post_id},
});
