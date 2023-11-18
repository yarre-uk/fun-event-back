const timeoutPromise = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve('Hello'), seconds * 1000);
  });

export default timeoutPromise;
