const runBackgroundTask = (label, task) => {
  setImmediate(() => {
    Promise.resolve()
      .then(task)
      .catch((error) => {
        console.error(`${label} failed:`, error.message);
      });
  });
};

module.exports = { runBackgroundTask };
