// Adapted from Lars's and my own earlier tests

const fs = require('fs');
const assert = require('assert');
eval(fs.readFileSync('code.js')+'');

function randArr() {
  let arr = [];
  let len = Math.floor(Math.random() * 20) + 5; // 5 to 24

  for (let i = 0; i < len; ++ i)
    arr[i] = Math.floor(Math.random() * 5); // 0 to 4

  return arr;
}

function syncMatch(arr, key) {
  let matches = 0;
  
  for (let i = 0; i < arr.length; ++i)
    if (arr[i] == key) ++matches;

  return matches;
}

function syncMin(arr) {
  let min = Infinity;

  for (let i = 0; i < arr.length; ++i)
    if (arr[i] < min) min = arr[i];

  return min;
}

for (let i = 0; i < 10; ++i) {
  let arr = randArr();
  let key = arr[Math.floor(Math.random() * arr.length)];

  nMatches(arr, key, function(matches) {
    assert(matches == syncMatch(arr, key));
  });

  asyncMin(arr, function(min) {
    let syncMinVal = syncMin(arr);
    let mes = "arr: " + arr + ", async min: " + min, + ", sync min: " + syncMinVal;
    assert(min == syncMinVal, mes);
  });
}
