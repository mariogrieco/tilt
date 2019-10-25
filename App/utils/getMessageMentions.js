
export const getMessageMentions = (message, usernames) => {
  const usersText = `@(${usernames.join('|')})+`;
  const hasMentions = message.match(usersText);
  if (hasMentions) {
    return hasMentions[0];
  }
  return null;
};
