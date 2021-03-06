/* */ 
var crypto = require("crypto");
var Benchmark = require("benchmark");
var generatePrimes = require("./generatePrime");
var microtime = require("microtime");
var total = 1000;
var out = new Array(total);
var ss = require("simple-statistics");
var sizes = [50, 100, 200, 400, 600, 800];
sizes.forEach(function(size) {
  var i = -1;
  var t,
      t2;
  console.log('unsafe', size);
  while (++i < total) {
    t = microtime.now();
    out[i] = generatePrimes(size, 2, crypto);
    t2 = microtime.now();
    out[i].time = t2 - t;
  }
  var time = out.map(function(t) {
    return t.time;
  });
  var runs = out.map(function(t) {
    return t.runs;
  });
  var tests = out.map(function(t) {
    return t.tests;
  });
  var perTest = out.map(function(t) {
    return t.time / t.tests;
  });
  var sieve = out.map(function(t) {
    return t.sieve;
  });
  var fermat = out.map(function(t) {
    return t.fermat;
  });
  var rabin = out.map(function(t) {
    return t.rabin;
  });
  console.log('time', JSON.stringify({
    mean: ss.mean(time),
    median: ss.median(time),
    max: ss.max(time),
    min: ss.min(time)
  }, false, 4));
  console.log('runs', JSON.stringify({
    mean: ss.mean(runs),
    median: ss.median(runs),
    max: ss.max(runs),
    min: ss.min(runs)
  }, false, 4));
  console.log('tests', JSON.stringify({
    mean: ss.mean(tests),
    median: ss.median(tests),
    max: ss.max(tests),
    min: ss.min(tests)
  }, false, 4));
  console.log('sieve', JSON.stringify({
    mean: ss.mean(sieve),
    median: ss.median(sieve),
    max: ss.max(sieve),
    min: ss.min(sieve)
  }, false, 4));
  console.log('fermat', JSON.stringify({
    mean: ss.mean(fermat),
    median: ss.median(fermat),
    max: ss.max(fermat),
    min: ss.min(fermat)
  }, false, 4));
  console.log('rabin', JSON.stringify({
    mean: ss.mean(rabin),
    median: ss.median(rabin),
    max: ss.max(rabin),
    min: ss.min(rabin)
  }, false, 4));
  console.log('pertest', JSON.stringify({
    mean: ss.mean(perTest),
    median: ss.median(perTest),
    max: ss.max(perTest),
    min: ss.min(perTest)
  }, false, 4));
});
