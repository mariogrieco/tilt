function filterPostBy(params) {
  if (params) {
    if (params.root_id !== '' || params.parent_id !== '') {
      return false;
    }
    if (
      params.type !== 'system_leave_team' &&
      params.type !== 'system_join_team' &&
      params.type !== 'system_leave_channel' &&
      params.type !== 'system_join_channel'
    ) {
      return true;
    }
  }
  return false;
}

export default filterPostBy;
