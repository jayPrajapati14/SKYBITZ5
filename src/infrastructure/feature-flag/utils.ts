export const isUserSpecific = (toUser: number | number[] | undefined, customerId: number): boolean => {
  if (!toUser) return true;

  const targetUsers = Array.isArray(toUser) ? toUser : [toUser];
  return targetUsers.includes(customerId);
};
