export const wait = (duration: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });
};
