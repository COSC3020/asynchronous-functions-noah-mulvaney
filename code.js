// COSC3020 Async Functions Exercise
// Noah Mulvaney
// 10 Apr 2024

// Adapted from slides 21, 22 of parallelism lecture slides

const {StaticPool} = require("node-worker-threads-pool");

function nMatches(arr, key, done) {
  const nThreads = Math.floor(Math.sqrt(arr.length));

  const workerPool = new StaticPool({
    size: nThreads,
    task: function(subArr) {
      let m = 0;
      
      for (let i = 0; i < subArr.length; ++i)
        if (subArr[i] == this.workerData) ++m;

      return m;
    },
    workerData: key
  });

  const size = arr.length / nThreads;

  let matches = 0, threadsFinished = 0;
  
  for (let i = 0; i < nThreads; ++i) {
    (async () => {
      let m = await workerPool.exec(arr.slice(i * size, (i + 1) * size));
      // console.log(i, m);
      matches += m;
      ++threadsFinished;

      if (threadsFinished == nThreads) {
        done(matches);
        workerPool.destroy();
      }
    })();
  }
}
