export const deepClone = <T extends { [key: string]: any }>(object: T) =>
  JSON.parse(JSON.stringify(object)) as T;
