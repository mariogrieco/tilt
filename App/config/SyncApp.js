import {
  getChannels,
  getLastViewForChannels,
  getMyChannels
} from '../actions/channels';
import {
  getTeams
} from '../actions/teams';
import {
  getPostsByChannelId
} from '../actions/posts';
import {
  getProfilesInGroupChannels,
} from '../actions/users';
import {
  getFlagged
} from '../actions/flagged';

import Client4 from '../api/MattermostClient';
import {
  loginSuccess,
  loginFailed
} from './../actions/login';
import {
  setNewSponsored,
  GET_SPONSORED_ERROR
} from '../actions/sponsored';

import moment from 'moment';

const sync = async (dispatch, callback) => {
  try {
    const asyncFetchs = [];

    await dispatch(getTeams());
    const MyChannels = await dispatch(getMyChannels());
    asyncFetchs.push(dispatch(getLastViewForChannels()));
    asyncFetchs.push(dispatch(getChannels()));
    asyncFetchs.push(dispatch(getPostsByChannelId(MyChannels)));
    await Promise.all(asyncFetchs);
    await dispatch(getProfilesInGroupChannels());
    await dispatch(getFlagged());
    Client4.getSponsored().then((str) => {
      if (!!str) {
        if (str.trim().length > 0) {
          dispatch(setNewSponsored(str));
        }
      }
    }).catch((ex) => {
      dispatch({
        type: GET_SPONSORED_ERROR,
        payload: ex
      });
    })

    Client4.getMe().then((user) => {
      user.last_picture_update = moment().unix();
      dispatch(loginSuccess(user));
    }).catch((err) => {
      dispatch(loginFailed(err));
    });
    console.log('Sync.init(store); done!!')
  } catch (err) {
    console.log(err);
  }
}

export default {
  init: sync
};