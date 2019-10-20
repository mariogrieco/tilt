export const FETCH_SYMBOLS = 'FETCH_CRYPTOS';
export const SELECTED_SYMBOL = 'SELECTED_SYMBOL';
export const FETCH_CRYPTOS_ERROR = 'FETCH_CRYPTO_ERROR';

export const getSymbols = (ORIGIN, symbol) => dispatch => {
  const URL = symbol
    ? `https://api.binance.com/api/v1/ticker/24hr?symbol=${symbol}`
    : 'https://api.binance.com/api/v1/ticker/24hr';

  fetch(URL)
    .then(response => response.json())
    .then(data =>
      dispatch({
        type: `${ORIGIN}_${FETCH_SYMBOLS}`,
        payload: data,
      }),
    )
    .catch(err =>
      dispatch({
        type: FETCH_CRYPTOS_ERROR,
        payload: err,
      }),
    );
};

export const selectedSymbol = symbol => ({
  type: SELECTED_SYMBOL,
  payload: symbol,
});
