// this action is unused for now. See Depth actions an reducer.
export const FETCH_BOOKS = 'FETCH_BOOKS';

const fetchBooks = symbol => (dispatch) => {
  fetch(`https://api.binance.com/api/v1/depth?symbol=${symbol}`)
    .then(response => response.json())
    .then((data) => {
      dispatch({
        type: FETCH_BOOKS,
        payload: data
      });
    });
};

export default fetchBooks;
