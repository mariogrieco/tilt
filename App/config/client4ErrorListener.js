import {logoutSuccess} from '../actions/login';

function isTypeError(type) {
  return type.includes('_ERROR');
}

const init = store => {
  // store.subscribe(event => {
  //   console.log('event: ', event);
  // })
};

export default init;
