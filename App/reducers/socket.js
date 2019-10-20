// import {

// } from '../actions/socketActions.js'

const initialState = {
  conn: null,
  connectFailCount: 0,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    // case typeName:
    //   return { ...state, ...payload }

    default: {
      return state;
    }
  }
};
