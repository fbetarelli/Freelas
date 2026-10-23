export const validateSearch = (search: string | null | undefined) => {
  if (search === null || search === undefined) {
    return null;
  }
  const escaped = search.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
  return `%${escaped}%`;
};
