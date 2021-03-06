import {GET_TEAMS_SUCCESS} from '../actions/teams';
// import mergeWith from 'lodash/mergeWith';
// import isEmpty from 'lodash/isEmpty';

const initialState = {
  ids: [],
  default_team_id: 'k1df69t1ibryue11z5wd4n48nr',
};

const teams = (state = initialState, action) => {
  switch (action.type) {
    // case SET_DEFAULT_TEAM_SUCCESS: {
    // return {
    // ...state,
    // default_team_id: action.payload
    // };
    // }
    case GET_TEAMS_SUCCESS: {
      const team = action.payload.find(_team => _team.name === 'default');
      return {
        ...state,
        ids: action.payload,
        default_team_id: team ? team.id : state.default_team_id,
      };
    }
    default:
      return state;
  }
};

export default teams;
