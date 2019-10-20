import moment from 'moment';

export const FETCH_MINICHART = 'FETCH_MINICHART';

const minichart = symbol => (dispatch) => {
  const time = moment().subtract(1, 'days').utc().valueOf();
  fetch(`https://api.binance.com/api/v1/klines?symbol=${symbol}&interval=3m&startTime=${time}&limit=100`)
    .then(response => response.json())
    .then(data => dispatch({
      type: FETCH_MINICHART,
      payload: {
        symbol,
        data: data.map(values => ({ y: parseFloat(values[4]) }))
      }
    }))
    .catch(err => console.log(err));
};

export default minichart;
