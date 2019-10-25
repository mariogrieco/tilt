import Client4 from '../api/MattermostClient';

export const GET_TEAMS_SUCCESS = 'GET_TEAMS_SUCCESS';
export const GET_TEAMS_ERRROR = 'GET_TEAMS_ERRROR';

export const SET_DEFAULT_TEAM_SUCCESS = 'SET_DEFAULT_TEAM_SUCCESS';
export const SET_DEFAULT_TEAM_ERROR = 'SET_DEFAULT_TEAM_ERROR';

export const getTeams = () => async dispatch => {
  try {
    const teams = await Client4.getTeams();
    dispatch({
      type: GET_TEAMS_SUCCESS,
      payload: teams,
    });
    return teams;
  } catch (err) {
    dispatch(onOneTeamError(err));
    return Promise.reject(err);
  }
};

function onOneTeamError(err) {
  return {
    type: SET_DEFAULT_TEAM_ERROR,
    payload: err,
  };
}

export const addToTeam = (teamId, userId) => async dispatch => {
  try {
    await Client4.addToTeam(teamId, userId);
    dispatch({
      type: SET_DEFAULT_TEAM_SUCCESS,
      payload: teamId,
    });
    return teamId;
  } catch (err) {
    dispatch(onOneTeamError(err));
    return Promise.reject(err);
  }
};
