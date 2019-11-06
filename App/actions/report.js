// import Client4 from '../api/MattermostClient';

export const REPORT_POST_TO_MODERATOR_SUCCESS =
  'REPORT_POST_TO_MODERATOR_SUCCESS';
export const REPORT_POST_TO_MODERATOR_ERROR = 'REPORT_POST_TO_MODERATOR_ERROR';
import {createPost} from './posts';
import {createDirectChannel} from './channels';

// const MODERATOR_USER_ID = 'xcmomnxtji8f7r6atftifs994r';
const MODERATOR_USER_ID = 'a4ucqkhc8ig5fcf4pmo49somze';

export const reportPostById = post_id => async (dispatch, getState) => {
  try {
    const me = getState().login.user;
    const channel = await dispatch(createDirectChannel(MODERATOR_USER_ID));
    const posted = await dispatch(
      createPost(
        `Reported by @${me.username} ${me.email}`,
        channel.id,
        undefined,
        [],
        {reported_by: me.id, reported: post_id, repost: post_id},
      ),
    );
    dispatch(reportPostByIdSucess(posted));
  } catch (ex) {
    dispatch(reportPostByIdError(ex));
    return Promise.reject(ex.message);
  }
};

export const reportPostByIdSucess = report => ({
  type: REPORT_POST_TO_MODERATOR_SUCCESS,
  payload: report,
});

export const reportPostByIdError = err => ({
  type: REPORT_POST_TO_MODERATOR_ERROR,
  payload: err,
});
