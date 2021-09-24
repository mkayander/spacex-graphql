const cooldown = <T extends (...args: any[]) => any>(cb: T, delay: number = 1000, startFromInit: boolean = true) => {
  let lastRunTime = startFromInit ? Date.now() : 0;
  return (...args: Parameters<T>): ReturnType<T> | null => {
    if (Date.now() > lastRunTime + delay) {
      lastRunTime = Date.now();
      return cb(...args);
    }

    console.log("Dropping the run...");
    return null;
  };
};

export default cooldown;
