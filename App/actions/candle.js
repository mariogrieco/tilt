import moment from 'moment';

export const FETCH_CANDLE_DATA = 'FETCH_CANDLE_DATA';
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';
export const RESET_CANDLE = 'RESET_CANDLE';

export const changeInterval = interval => ({
  type: CHANGE_INTERVAL,
  payload: interval
});

export const resetInterval = () => ({
  type: RESET_CANDLE,
  payload: 0
});

const fetchCandleData = (symbol, interval, startTime, dateFormat) => (dispatch) => {
  const URL = `https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}`;

  fetch(URL)
    .then(response => response.json())
    .then((data) => {
      const candles = data.map(value => (
        {
          open: parseFloat(value[1]),
          close: parseFloat(value[4]),
          shadowH: parseFloat(value[2]),
          shadowL: parseFloat(value[3]),
          volume: parseFloat(value[5]),
          closeTime: moment(value[6]).format(dateFormat)
        }
      ));

      const action = {
        type: FETCH_CANDLE_DATA,
        payload: {
          data: candles,
          symbol
        }
      };
      dispatch(action);
    });
};

export default fetchCandleData;
