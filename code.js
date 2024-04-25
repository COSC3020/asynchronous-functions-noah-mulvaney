// COSC3020 Async Functions Exercise
// Noah Mulvaney
// 25 Apr 2024

const {StaticPool} = require("node-worker-threads-pool");

// Adapted from slides 21, 22 of parallelism lecture slides
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

// asynchronously find the minimum value in an array 
function asyncMin(arr, cb) {
  const nThreads = Math.floor(Math.sqrt(arr.length)); // number of threads = sqrt{n}
  let min = Infinity; // global variable to store minimum value found

  // setup worker threads
  const workers = new StaticPool({
    size: nThreads,
    task: function(subArr) {
      for (let i = 0; i < subArr.length; ++i)
        if (subArr[i] < this.workerData) this.workerData = subArr[i];
    },
    workerData: min // shared data, updated by all threads
  });

  const subSize = arr.length / nThreads; // size of sub arrays passed to each thread
  let nFinished = 0; // number of threads finished

  // assign work to threads
  for (let i = 0; i < nThreads; ++i) {
    (async () => {
      // start thread working on sub array
      await workerPool.exec(arr.slice(i * subSize, (i + 1) * subsize));
      ++nFinished;

      if (nFinished == nThreads) { // all threads have finished
        cp(workers.workerData); // call the callback function with shared data
        workers.destory(); // delete all the worker threads
      }
  }
