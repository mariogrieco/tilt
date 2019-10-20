import { FETCH_BOOKS } from '../actions/book';

const initialState = {
  bids: [],
  asks: [],
  hasData: false
};

const books = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOOKS:
      return ({
        ...action.payload,
        hasData: true
      });
    default:
      return state;
  }
};

export default books;
