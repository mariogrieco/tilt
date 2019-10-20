export const getUsersNames = state => state.users.keys
  .filter(key => !state.sponsored.includes(key))
  .map(key => (state.users.data[key] ? state.users.data[key].username : ''));

export const getUserWithNames = state => state.users.keys
  .filter(key => !state.sponsored.includes(key))
  .map(key => (state.users.data[key] ? state.users.data[key] : {}));
