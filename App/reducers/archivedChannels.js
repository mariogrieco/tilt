import {DELETE_CHANNEL_SUCCESS} from '../actions/channels';

const initialState = [];

export default function archivedChannels(state = initialState, action) {
  switch (action.type) {
    case DELETE_CHANNEL_SUCCESS:
      return [...state, action.payload];

    default:
      return state;
  }
}
