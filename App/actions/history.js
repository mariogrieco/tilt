import moment from 'moment';

export const FETCH_TRADE_HISTORIES = 'FETCH_TRADE_HISTORIES';
export const RESET_HISTORIES = 'RESET_HISTORIES';

export const resetHistories = () => ({type: RESET_HISTORIES});

const fetchHistories = symbol => dispatch => {
  fetch(`https://api.binance.com/api/v1/trades?symbol=${symbol}`)
    .then(response => response.json())
    .then(data => {
      let historyList = data.map(value => ({
        ...value,
        price: parseFloat(value.price),
        time: moment(value.time).format('HH:mm:ss'),
      }));

      for (let index = 0; index < historyList.length; index += 1) {
        let color = null;
        const price = historyList[index];
        const prevPrice = historyList[index - 1];

        if (index === 0) {
          color = '#17C491';
          price.color = color;
        } else if (price.price > prevPrice.price) {
          color = '#17C491';
          price.color = color;
        } else if (price.price < prevPrice.price) {
          color = '#FC3E30';
          price.color = color;
        } else if (price.price === prevPrice.price) {
          price.color = prevPrice.color;
        }
      }

      historyList = historyList.reverse();

      dispatch({
        type: FETCH_TRADE_HISTORIES,
        payload: historyList,
      });
    });
};

export default fetchHistories;
