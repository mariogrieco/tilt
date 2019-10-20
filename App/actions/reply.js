export const POST_REPLY = 'POST_REPLY';

export const postReply = (postId, userId) => dispatch => dispatch({
  type: POST_REPLY,
  payload: {
    postId,
    userId
  }
});
