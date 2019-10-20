import {MODAL_ACTIVE, RESET_PASSWORD_MODAL} from '../actions/modal';

const initialState = {
  modalActive: false,
  resetPasswordModal: false,
};

const modal = (state = initialState, action) => {
  switch (action.type) {
    case MODAL_ACTIVE:
      return {
        ...state,
        modalActive: action.payload,
      };
    case RESET_PASSWORD_MODAL:
      return {
        ...state,
        resetPasswordModal: action.payload,
      };
    default:
      return state;
  }
};

export default modal;
