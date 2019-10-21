import {
  // GET_COMMAND_LIST_ERROR,
  GET_COMMAND_LIST_SUCCESS,
} from '../actions/commands';

const initialState = [
  {
    trigger: '-Bullish-',
  },
  {
    trigger: '-Bearish-',
  },
  {
    trigger: '-YOLO-',
  },
  {
    trigger: '-Shitpost-',
  },
  {
    trigger: '-Discussion-',
  },
  {
    trigger: '-Gain-',
  },
  {
    trigger: '-Loss-',
  },
  {
    trigger: '-Stocks-',
  },
  {
    trigger: '-Options-',
  },
  {
    trigger: '-Futures-',
  },
  {
    trigger: '-Cryptos-',
  },
  {
    trigger: '-Shrug-',
  },
  // {
  //   description: "Appends ¯\\_(ツ)_/¯ to your message",
  //   name: "/shrug {message}, appends ¯\\_(ツ)_/¯",
  //   trigger: "/shrug",
  // }
];

const commands = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMAND_LIST_SUCCESS:
      return state;
    default:
      return state;
  }
};

export default commands;
