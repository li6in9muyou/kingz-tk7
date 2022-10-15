export const sleep = (milliSeconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliSeconds));
