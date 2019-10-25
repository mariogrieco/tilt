const getStatusForUserId = (userId, state) => {
  const match = state.statuse.find(status => status.user_id === userId);
  return match ? match.status : 'notFound';
};

export default getStatusForUserId;
