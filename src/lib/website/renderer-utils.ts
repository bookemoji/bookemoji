export const wait = (duration: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });
};

export const decay = (t: number, value: number): number => {
  return Math.max(0, value - Math.random() * 4);
};

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
