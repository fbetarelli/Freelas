export const removeUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as Partial<T>;
