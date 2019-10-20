import {
  // GET_COMMAND_LIST_ERROR,
  GET_COMMAND_LIST_SUCCESS,
} from '../actions/commands';

const initialState = [
  {
    description: 'Display text as a code block',
    name: '/code {text}, display text as a code block',
    trigger: '/code',
  },
  {
    description: 'Echo back text from your account',
    name: '/echo {message} {delay in seconds}',
    trigger: '/echo',
  },
  {
    description: 'Send an email invite to join Tilt',
    name: '/invite_people {name@domain.com}',
    trigger: '/invite_people',
  },
  {
    description: 'Join the given channel',
    name: '/join #{channel-name}',
    trigger: '/join',
  },
  {
    description: 'Open the given channel',
    name: '/open #{channel-name}',
    trigger: '/open',
  },
  {
    description: 'Leave the current channel',
    name: 'Leave the current channel',
    trigger: '/leave',
  },
  {
    description: 'Logout of Tilt',
    name: 'Log out of Tilt',
    trigger: '/logout',
  },
  {
    description: 'Send a Direct Message to a user',
    name: '/msg {@username} {message}',
    trigger: '/msg',
  },
  {
    description: 'Search for a text in the current channel',
    name: '/search {text}, search for the text',
    trigger: '/search',
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
