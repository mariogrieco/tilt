export const FETCH_DEPTH_DATA = 'FETCH_DEPTH_DATA';
export const RESET_DEPTH_CHART = 'RESET_DEPTH_CHART';
export const RELEASE_DEPTH_FETCHING = 'RELEASE_DEPTH_FETCHING';
export const DEPTH_CHART_ACTIVE = 'DEPTH_CHART_ACTIVE';
export const DEPTH_CHART_INACTIVE = 'DEPTH_CHART_INACTIVE';

export const releaseDepthFetching = () => ({
  type: RELEASE_DEPTH_FETCHING
});

export const resetDepthChart = () => ({
  type: RESET_DEPTH_CHART
});

export const depthChartActive = () => ({
  type: DEPTH_CHART_ACTIVE
});

export const depthChartInactive = () => ({
  type: DEPTH_CHART_INACTIVE
});

export const fetchBooksOnly = symbol => dispatch => fetchDepthData(symbol, false, true, dispatch);

export const fetchGraphOnly = symbol => dispatch => fetchDepthData(symbol, true, false, dispatch);

export const fetchAll = symbol => dispatch => fetchDepthData(symbol, true, true, dispatch);

const graphCalcs = (data) => {
  const asks = [];
  const bids = [];
  const sortBids = data.bids.reverse();

  let currentQty = 0;

  for (let index = 0; index < data.asks.length; index += 1) {
    currentQty += parseFloat(data.asks[index][1]);
    asks.push({
      x: parseFloat(data.asks[index][0]),
      y: currentQty
    });
  }

  // reset quantity for asks
  currentQty = 0;

  // calcule the total cuantity
  for (let index = 0; index < sortBids.length; index += 1) {
    currentQty += parseFloat(sortBids[index][1]);
  }

  // generate the inverse line
  for (let index = 0; index < sortBids.length; index += 1) {
    currentQty -= parseFloat(sortBids[index][1]);
    bids.push({
      x: parseFloat(sortBids[index][0]),
      y: currentQty
    });
  }
  return ({ asks, bids });
};

const prepareBooks = (data) => {
  const books = [];
  for (let index = 0; index < data.asks.length; index += 1) {
    books.push({
      ask: {
        price: data.asks[index][0],
        qty: data.asks[index][1]
      },
      bid: {
        price: data.bids[index][0],
        qty: data.bids[index][1]
      }
    });
  }
  return books.slice(0, 20);
};

const fetchDepthData = (symbol, hasGraph, hasBooks, dispatch) => {
  console.log(symbol)
  fetch(`https://api.binance.com/api/v1/depth?symbol=${symbol}&limit=100`)
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      const emptyGraph = {
        asks: [{ x: 0, y: 0 }],
        bids: [{ x: 0, y: 0 }]
      };
      const emptyBooks = [
        {
          ask: { price: 0, qty: 0 },
          bids: { price: 0, qty: 0 }
        }
      ];
      dispatch({
        type: FETCH_DEPTH_DATA,
        payload: {
          graph: {
            ...(hasGraph ? graphCalcs(data) : emptyGraph)
          },
          books: [
            ...(hasBooks ? prepareBooks(data) : emptyBooks)
          ],
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
