const throttle = <T extends (...args: any[]) => any>(cb: T, divider: number = 2) => {
  let count = 0;

  return (...args: Parameters<T>): ReturnType<T> | null => {
    if (++count % divider === 0) {
      count = 0;
      return cb(...args);
    }
    return null;
  };
};

export default throttle;
