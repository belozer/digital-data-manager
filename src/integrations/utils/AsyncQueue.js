class AsyncQueue {
  constructor(isLoadedDelegate) {
    this.isLoadedDelegate = isLoadedDelegate;
    this.asyncQueue = [];

    // emulate async queue for Ofsys sync script
    let invervalCounter = 0;
    const invervalId = setInterval(() => {
      invervalCounter += 1;
      if (isLoadedDelegate()) {
        this.flushQueue();
        clearInterval(invervalId);
      } else if (invervalCounter > 10) {
        clearInterval(invervalId);
      }
    }, 100);
  }

  flushQueue() {
    let handler = this.asyncQueue.shift();
    while (handler && typeof handler === 'function') {
      handler();
      handler = this.asyncQueue.shift();
    }
    this.asyncQueue.push = (callback) => {
      callback();
    };
    this._flushed = true;
  }

  push(handler) {
    this.asyncQueue.push(handler);
    if (!this._flushed && this.isLoadedDelegate()) {
      this.flushQueue();
    }
  }
}

export default AsyncQueue;
