import {
  // getChannels,
  getLastViewForChannels,
  getMyChannels,
  getChannelStatsByGroup,
} from '../actions/channels';
import {getTeams} from '../actions/teams';
import {getPostsByChannelId} from '../actions/posts';
import {getProfilesInGroupChannels} from '../actions/users';
import {getBlockUserListForUserId} from '../actions/blockedUsers';
import {getFlagged} from '../actions/flagged';

import Client4 from '../api/MattermostClient';
import {loginSuccess, loginFailed} from './../actions/login';
import {setNewSponsored, GET_SPONSORED_ERROR} from '../actions/sponsored';
import {
  setNewAdminCreators,
  GET_NEW_ADMIN_CREATOR_ERROR,
} from '../actions/adminCreators';

import moment from 'moment';

const sync = async (dispatch, callback) => {
  try {
    await Client4.getMe()
      .then(user => {
        user.last_picture_update = moment().valueOf();
        dispatch(getBlockUserListForUserId(user.id));
        dispatch(loginSuccess(user));
      })
      .catch(err => {
        dispatch(loginFailed(err));
      });

    const asyncFetchs = [];
    await dispatch(getTeams());
    const MyChannels = await dispatch(getMyChannels());
    asyncFetchs.push(dispatch(getLastViewForChannels()));
    asyncFetchs.push(dispatch(getPostsByChannelId(MyChannels)));
    await Promise.all(asyncFetchs);
    await dispatch(getProfilesInGroupChannels());
    await dispatch(getFlagged());
    Client4.getSponsored()
      .then(str => {
        if (str) {
          if (str.trim().length > 0) {
            if (!str.match('error')) {
              dispatch(setNewSponsored(str));
            }
          }
        }
      })
      .catch(ex => {
        dispatch({
          type: GET_SPONSORED_ERROR,
          payload: ex,
        });
      });

    Client4.getAdminCreators()
      .then(str => {
        if (str) {
          if (str.trim().length > 0) {
            if (!str.match('error')) {
              dispatch(setNewAdminCreators(str));
            }
          }
        }
      })
      .catch(ex => {
        dispatch({
          type: GET_NEW_ADMIN_CREATOR_ERROR,
          payload: ex,
        });
      });
    await dispatch(getChannelStatsByGroup(MyChannels));
    console.log('Sync.init(store); done!!');
  } catch (err) {
    console.log(err);
  }
};

export default {
  init: sync,
};
