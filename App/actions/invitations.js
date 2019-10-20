import Client4 from '../api/MattermostClient';

export const SENT_EMAIL_SUCCESS = 'SENT_EMAIL_SUCCESS';
export const SENT_EMAIL_ERROR = 'SENT_EMAIL_ERROR';

export const sendEmailGuestInvitesToChannels = (
  channelIds,
  emails,
  message,
  // teamId = 'k1df69t1ibryue11z5wd4n48nr'
) => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id
    const data = await Client4.sendEmailInvitesToTeam(team_id, emails);
    dispatch(sendEmailGuestInvitesToChannelsSucess(data));
    return data;
  } catch (ex) {
    alert(ex.message);
    dispatch(sendEmailGuestInvitesToChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

export const sendEmailGuestInvitesToChannelsSucess = data => ({
  type: SENT_EMAIL_SUCCESS,
  payload: data
});

export const sendEmailGuestInvitesToChannelsError = err => ({
  type: SENT_EMAIL_ERROR,
  payload: err
});
