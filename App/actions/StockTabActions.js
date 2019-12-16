import Client4 from '../api/MattermostClient';

export const GET_ACTIVE_MARKET_LIST_SUCCESS = 'GET_ACTIVE_MARKET_LIST_SUCCESS';
export const GET_ACTIVE_MARKET_LIST_ERROR = 'GET_ACTIVE_MARKET_LIST_ERROR';

export const GET_LOSERS_MARKET_LIST_SUCCESS = 'GET_LOSERS_MARKET_LIST_SUCCESS';
export const GET_LOSERS_MARKET_LIST_ERROR = 'GET_LOSERS_MARKET_LIST_ERROR';

export const GET_GAINERS_MARKET_LIST_SUCCESS = 'GET_GAINERS_MARKET_LIST_SUCCESS';
export const GET_GAINERS_MARKET_LIST_ERROR = 'GET_GAINERS_MARKET_LIST_ERROR'; 


export const getStocksMarketMostactiveList = () => async dispatch => {
  try {
    const list = await Client4.getStocksMarketMostactiveList();
    dispatch(getStocksMarketMostactiveListSucess(list));
    return list;
  } catch (ex) {
    dispatch(getStocksMarketMostactiveListError(ex));
    return Promise.reject(ex.message);
  }
};

export const getStocksMarketMostactiveListSucess = list => ({
  type: GET_ACTIVE_MARKET_LIST_SUCCESS,
  payload: list,
});

export const getStocksMarketMostactiveListError = err => ({
  type: GET_ACTIVE_MARKET_LIST_ERROR,
  payload: err,
});

export const getStocksMarketLosersList = () => async dispatch => {
  try {
    const list = await Client4.getStocksMarketLosersList();
    dispatch(getStocksMarketLosersListSucess(list));
    return list;
  } catch (ex) {
    dispatch(getStocksMarketLosersListError(ex));
    return Promise.reject(ex.message);
  }
};

export const getStocksMarketLosersListSucess = list => ({
  type: GET_LOSERS_MARKET_LIST_SUCCESS,
  payload: list,
});

export const getStocksMarketLosersListError = err => ({
  type: GET_LOSERS_MARKET_LIST_ERROR,
  payload: err,
});

export const getStocksMarketGainersList = () => async dispatch => {
  try {
    const list = await Client4.getStocksMarketGainersList();
    dispatch(getStocksMarketGainersListSucess(list));
    return list;
  } catch (ex) {
    dispatch(getStocksMarketGainersListError(ex));
    return Promise.reject(ex.message);
  }
};

export const getStocksMarketGainersListSucess = list => ({
  type: GET_GAINERS_MARKET_LIST_SUCCESS,
  payload: list,
});

export const getStocksMarketGainersListError = err => ({
  type: GET_GAINERS_MARKET_LIST_ERROR,
  payload: err,
});
