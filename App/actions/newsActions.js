import Client4 from '../api/MattermostClient';

export const GET_NEWS_FOR_SYMBOL_SUCCESS = 'GET_NEWS_FOR_SYMBOL_SUCCESS';
export const GET_NEWS_FOR_SYMBOL_ERROR = 'GET_NEWS_FOR_SYMBOL_ERROR';

export const getNewsForSymbol = symbol => async dispatch => {
  try {
    const data = await Client4.getNews(symbol);
    dispatch(
      getNewsForSymbolSucess({
        symbol,
        data,
      }),
    );
    return data;
  } catch (ex) {
    dispatch(getNewsForSymbolError(ex));
    return [];
  }
};

export const getNewsForSymbolSucess = data => ({
  type: GET_NEWS_FOR_SYMBOL_SUCCESS,
  payload: data,
});

export const getNewsForSymbolError = err => ({
  type: GET_NEWS_FOR_SYMBOL_ERROR,
  payload: err,
});
