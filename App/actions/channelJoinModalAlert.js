export const SET_ACTIVE_MODAL_ID = 'SET_ACTIVE_MODAL_ID';
export const CLOSE_ACTIVE_MODAL_ID = 'CLOSE_ACTIVE_MODAL_ID';

export const openModal = id => ({
  type: SET_ACTIVE_MODAL_ID,
  payload: id
});

export const closeModal = () => ({
  type: CLOSE_ACTIVE_MODAL_ID
  // payload: 
});
