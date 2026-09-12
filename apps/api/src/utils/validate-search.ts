export const validateSearch = (search: string | null | undefined) => {
  if (search === null || search === undefined) {
    return null;
  }
  return `%${search}%`;
};
