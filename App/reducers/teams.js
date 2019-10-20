import { GET_TEAMS_SUCCESS, SET_DEFAULT_TEAM_SUCCESS } from '../actions/teams';
// import mergeWith from 'lodash/mergeWith';
// import isEmpty from 'lodash/isEmpty';

const initialState = {
	ids: [],
	default_team_id: null
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
			return {
				...state,
				ids: action.payload,
				default_team_id: action.payload.find((team) => team.name === 'default').id
			};
		}
		default:
			return state;
	}
};

export default teams;
