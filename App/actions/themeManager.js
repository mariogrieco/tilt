export const CHANGE_THEME_REQUEST = 'CHANGE_THEME_REQUEST';

export const changeTheme = themeName => ({
  type: CHANGE_THEME_REQUEST,
  payload: themeName,
});
