import Client4 from '../api/MattermostClient';

export const ADD_REACTION_SUCCESS = 'ADD_REACTION_SUCCESS';
export const ADD_REACTION_ERROR = 'ADD_REACTIONS_ERROR';

export const REMOVE_REACTION_SUCESS = 'REMOVE_REACTION_SUCESS';
export const REMOVE_REACTION_ERROR = 'REMOVE_REACTION_ERROR';

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
