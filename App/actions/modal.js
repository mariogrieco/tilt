export const MODAL_ACTIVE = 'MODAL_ACTIVE';
export const RESET_PASSWORD_MODAL = 'RESET_PASSWORD_MODAL';

export const modalActive = modal => ({
  type: MODAL_ACTIVE,
  payload: modal
});

export const resetPasswordModal = modal => ({
  type: RESET_PASSWORD_MODAL,
  payload: modal
});
