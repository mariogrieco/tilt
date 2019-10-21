import {
  // GET_COMMAND_LIST_ERROR,
  GET_COMMAND_LIST_SUCCESS,
} from '../actions/commands';

const initialState = [
  {
    name: 'Bullish',
    trigger: '-Bullish-',
  },
  {
    name: 'Bearish',
    trigger: '-Bearish-',
  },
  {
    name: 'YOLO',
    trigger: '-YOLO-',
  },
  {
    name: 'Shitpost',
    trigger: '-Shitpost-',
  },
  {
    name: 'Discussion',
    trigger: '-Discussion-',
  },
  {
    name: 'Gain',
    trigger: '-Gain-',
  },
  {
    name: 'Loss',
    trigger: '-Loss-',
  },
  {
    name: 'Stocks',
    trigger: '-Stocks-',
  },
  {
    name: 'Options',
    trigger: '-Options-',
  },
  {
    name: 'Futures',
    trigger: '-Futures-',
  },
  {
    name: 'Cryptos',
    trigger: '-Cryptos-',
  },
  {
    name: '¯\\_(ツ)_/¯',
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
