import Client4 from '../api/MattermostClient';

import NavigationService from './../config/NavigationService';

export const GET_USERS_SUCESS = 'GET_USERS_SUCESS';

export const GET_USERS_ERROR = 'GET_USERS_ERROR';
export const GET_STATUS_USERS__BY_ID_ERROR = 'GET_STATUS_USERS__BY_ID_ERROR';

export const GET_STATUS_USERS__BY_ID_SUCESS = 'GET_STATUS_USERS__BY_ID_SUCESS';
export const SET_CURRENT_DISPLAY_USER_PROFILE =
  'SET_CURRENT_DISPLAY_USER_PROFILE';

export const USER_UPDATED_SUCCESS = 'USER_UPDATED_SUCCESS';
export const USER_UPDATED_ERROR = 'USER_UPDATED_ERROR';

export const GET_NEW_USER_SUCCESS = 'GET_NEW_USER_SUCCESS';
export const GET_NEW_USER_ERROR = 'GET_NEW_USER_ERROR';

export const UPDATE_ME_SUCCES = 'UPDATE_ME_SUCCES';
export const UPDATE_ME_ERROR = 'UPDATE_ME_ERROR';

export const GET_MY_CHANNEL_MEMBERS_ERROR = 'GET_MY_CHANNEL_MEMBERS_ERROR';
export const GET_MY_CHANNEL_MEMBERS_SUCCES = 'GET_MY_CHANNEL_MEMBERS_SUCCES';

export const onUser = username => (dispatch, getState) => {
  const usersData = getState().users;
  usersData.keys.forEach(key => {
    const currentUser = usersData.data[key] || {};
    const formatName = `@${currentUser.username}`;
    if (formatName === username) {
      const me = getState().login.user;
      if (me && me.id === currentUser.id) {
        NavigationService.navigate('LoggedIn');
      } else {
        dispatch(setCurrentDisplayUserProfile(currentUser.id));
        NavigationService.navigate('MemberProfile');
      }
    }
  });
};

// export const getMyChannelMembers = () => async (dispatch, getState) => {
//   try {
//     team_id = getState().teams.default_team_id;
//     team_id = team_id ? team_id: 'k1df69t1ibryue11z5wd4n48nr';
//     const members = await Client4.getMyChannelMembers(team_id);
//     const allUsersIds = members.map(({ user_id }) => {
//       return user_id;
//     });
//     const r = await Client4.getProfilesByIds(allUsersIds);
//     dispatch(getMyChannelMembersSuccess(members));
//     console.log(allUsersIds);
//     console.log(r);
//     return r;
//   } catch (ex) {
//     dispatch(getMyChannelMembersError(ex));
//     return Promise.reject(ex.message);
//   }
// };

export const getMyChannelMembersSuccess = members => ({
  type: GET_MY_CHANNEL_MEMBERS_SUCCES,
  payload: members,
});

export const getMyChannelMembersError = err => ({
  type: GET_MY_CHANNEL_MEMBERS_ERROR,
  payload: err,
});

export const updateUser = newUser => async dispatch => {
  try {
    const r = await Client4.updateUser(newUser);
    dispatch(updateUserSuccess(r));
  } catch (ex) {
    dispatch(updateUserError(ex));
    return Promise.reject(ex.message);
  }
};

export const updateUserSuccess = updated => ({
  type: UPDATE_ME_SUCCES,
  payload: updated,
});

export const updateUserError = err => ({
  type: UPDATE_ME_ERROR,
  payload: err,
});

export const getNewUser = userId => async dispatch => {
  try {
    const newUser = await Client4.getUser(userId);
    dispatch(getNewUserSuccess(newUser));
  } catch (ex) {
    dispatch(getNewUserError(ex));
    return Promise.reject(ex.message);
  }
};

export const getNewUserSuccess = newUser => ({
  type: GET_NEW_USER_SUCCESS,
  payload: newUser,
});

export const getNewUserError = err => ({
  type: GET_NEW_USER_ERROR,
  payload: err,
});

// export const getUsersStatus = usersIds => async (dispatch, getState) => {
//   try {
//     usersIds = usersIds ? usersIds :  getState().users.map(({ id }) => id);
//     const result = await Client4.getStatusesByIds(usersIds);
//     dispatch(getStatusesByIdsSucess(result));
//   } catch (ex) {
//     dispatch(getStatusesByIdsError(ex.message));
//     return Promise.reject(ex.message);
//   }
// };

// export const getStatusesByIdsSucess = users => ({
//   type: GET_STATUS_USERS__BY_ID_SUCESS,
//   payload: users
// });

// export const getStatusesByIdsError = message => ({
//   type: GET_STATUS_USERS__BY_ID_ERROR,
//   payload: message
// });

export const userUpdatedSuccess = newUser => ({
  type: USER_UPDATED_SUCCESS,
  payload: newUser,
});

export const userUpdatedError = err => ({
  type: USER_UPDATED_ERROR,
  payload: err,
});

export const getProfilesInChannels = channels => async dispatch => {
  try {
    const payload = [];
    const asyncCalls = [];
    let results = [];

    channels.forEach(channel => {
      asyncCalls.push(Client4.getProfilesInChannel(channel.id));
    });

    results = await Promise.all(asyncCalls);

    results.forEach(profiles => {
      profiles.forEach(profile => {
        payload.push(profile);
      });
    });

    dispatch(getUsersSucess(payload));
    return payload;
  } catch (ex) {
    dispatch(getUsersError(ex));
    return Promise.reject(ex.message);
  }
};

export const getProfilesInTeam = () => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id;
    const payload = await Client4.getProfilesInTeam(
      team_id,
      0,
      999999999999999999999999999999999999999,
    );
    dispatch(getUsersSucess(payload));
    return payload;
  } catch (ex) {
    dispatch(getUsersError(ex));
    return Promise.reject(ex.message);
  }
};

export const getProfilesInGroupChannels = () => async (dispatch, getState) => {
  try {
    // const channels = getState().myChannels.map(({ id }) => id);
    const payload = await Client4.getProfilesInChannel('', '', '', '');
    dispatch(getUsersSucess(payload));
    return payload;
  } catch (ex) {
    dispatch(getUsersError(ex));
    return Promise.reject(ex.message || ex);
  }
  // return dispatch(getProfilesInTeam());
};

export const getUsersSucess = users => ({
  type: GET_USERS_SUCESS,
  payload: users,
});

export const getUsersError = err => ({
  type: GET_USERS_ERROR,
  payload: err,
});

export const setCurrentDisplayUserProfile = userId => ({
  type: SET_CURRENT_DISPLAY_USER_PROFILE,
  payload: userId,
});
