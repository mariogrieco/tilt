import Client4 from '../api/MattermostClient';
import NavigationService from './../config/NavigationService'
import {
  searchPostsWithParams
} from '../actions/advancedSearch';
import {
  removeFromChannel,
  navigateIfExists,
  createDirectChannel
} from './channels';
import {
  logout,
  isLogin
} from '../actions/login';
import getPrivateMessagesChnnelsList from '../selectors/getChannelNameForPM'
import cloneDeep from 'lodash/cloneDeep';
// getCommandsList (teamId)
// executeCommand (command, commandArgs = {})

export const GET_COMMAND_LIST_SUCCESS = 'GET_COMMAND_LIST_SUCCESS';
export const GET_COMMAND_LIST_ERROR = 'GET_COMMAND_LIST_ERROR';

export const EXECUTE_AWAY_SUCCESS = 'EXECUTE_AWAY_SUCCESS';
export const EXECUTE_AWAY_ERROR = 'EXECUTE_AWAY_ERROR';

export const EXECUTE_OFFLINE_ERROR = 'EXECUTE_OFFLINE_ERROR';
export const EXECUTE_OFFLINE_SUCCESS = 'EXECUTE_OFFLINE_SUCCESS';

export const EXECUTE_ONLINE_SUCCESS = 'EXECUTE_ONLINE_SUCCESS';
export const EXECUTE_ONLINE_ERROR = 'EXECUTE_ONLINE_ERROR';

const customTeamId = 'k1df69t1ibryue11z5wd4n48nr'; // TEMPORAL !

export const getCommandsList = () => async (dispatch) => {
  try {
    const commandList = await Client4.getCommandsList(customTeamId);
    dispatch(getCommandsListSuccess(commandList));
  } catch (ex) {
    dispatch(getCommandsListError(ex));
    return Promise.reject(ex.message);
  }
};

export const getCommandsListSuccess = list => ({
  type: GET_COMMAND_LIST_SUCCESS,
  payload: list
});

export const getCommandsListError = err => ({
  type: GET_COMMAND_LIST_ERROR,
  payload: err
});

export const executeCommand = (command, channelId) => async (dispatch, getState) => {
  const defaultTeam  = getState().teams.default_team_id;

  switch (command.split(' ')[0]) {
    case '/search': {
      let channel = getState().myChannels.find(_channel => channelId === _channel.id) || {};
      if (channel.type === 'D') {
        channel = {
          ...channel,
          name: getPrivateMessagesChnnelsList(getState(), cloneDeep(channel))
        };
      }
      let queryStr = command.replace('/search', '').trim();
      queryStr = `in: ${channel.name} ${queryStr} `;
      await dispatch(searchPostsWithParams(queryStr, 0));
      NavigationService.navigate('AdvancedSearch', {
        queryStr,
        channel
      });
      return true;
    }
    case '/join':
    case '/open': {
      return dispatch(navigateIfExists(`${command.split(' ')[1]}`));
    }
    case '/logout': {
      await dispatch(logout());
      await dispatch(isLogin(false));
      NavigationService.navigate('SignUp');
      return true;
    }
    case '/leave': {
      const meId = getState().login.user.id;
      NavigationService.navigate('PublicChat');
      await dispatch(removeFromChannel(meId, channelId));
      return true;
    }
    case '/msg': {
      try {
        const r = await executeCommands(command, channelId);
        const username = command.split(' ')[1];
        let userId = '';
        getState().users.keys.forEach(key => {
          const data = getState().users.data[key];
          if (data && `@${data.username}` === username) {
            userId = data.id; 
          }
        });
        return dispatch(createDirectChannel(userId));
      } catch (err) {
        dispatch(customErrorCommands(err));
        return Promise.reject(err);
      }
    }
    default: {
      return await executeCommands(command, channelId, defaultTeam);
    }
  }
}

function customErrorCommands (err) {
  return {
    type: 'COMMANDS_ERROR',
    payload: err
  };
};

async function executeCommands (command, channelId, defaultTeam) {
  try {
    // alert();
    const result = await Client4.executeCommand(command, {
      // command,
      channel_id: channelId,
      team_id: defaultTeam
    });
    // dispatch(executeAwaySuccess(result));
    return result;
  } catch (ex) {
    dispatch(customErrorCommands(err));
    return Promise.reject(`${ex.message || ex}: ${command}`);
    // return Promise.reject(`Command with a trigger of ${command.split(' ')[0]} not found`);
  }
}

export const executeAwaySuccess = result => ({
  type: EXECUTE_AWAY_SUCCESS,
  payload: result
});

export const executeAwayError = err => ({
  type: EXECUTE_AWAY_ERROR,
  payload: err
});

export const executeOffline = ({
  channel_id
  // command: "/offline "
  // team_id: "k1df69t1ibryue11z5wd4n48nr"
}) => async (dispatch, getState) => {
  try {
    const result = await Client4.executeCommand({
      command: '/offline',
      team_id: getState().teams.default_team_id,
      channel_id
    });
    dispatch(executeOfflineSuccess(result));
    return result;
  } catch (ex) {
    dispatch(executeOfflineError(ex));
    return Promise.reject(ex.message);
;
  }
};

export const executeOfflineSuccess = result => ({
  type: EXECUTE_OFFLINE_SUCCESS,
  payload: result
});

export const executeOfflineError = err => ({
  type: EXECUTE_OFFLINE_ERROR,
  payload: err
});

export const executeOnline = ({
  channel_id
  // command: "/offline "
  // team_id: "k1df69t1ibryue11z5wd4n48nr"
}) => async (dispatch, getState) => {
  try {
    const result = await Client4.executeCommand({
      command: '/online',
      team_id: getState().teams.default_team_id,
      channel_id
    });
    dispatch(executeOfflineSuccess(result));
    return result;
  } catch (ex) {
    dispatch(executeOfflineError(ex));
    return Promise.reject(ex.message);
  }
};

export const executeOnlineSuccess = result => ({
  type: EXECUTE_ONLINE_SUCCESS,
  payload: result
});

export const executeOnlineError = err => ({
  type: EXECUTE_ONLINE_ERROR,
  payload: err
});
