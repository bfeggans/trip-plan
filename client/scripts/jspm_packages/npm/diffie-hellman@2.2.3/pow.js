/* */ 
module.exports = function (a, b, prime) {
  var sum = 1;
  while (b--) {
    sum *= a;
    sum %=prime;
  }
};

var mods = {};
function barrett(a, b, prime) {
  var k, fourk, m;
  if (prime in mods) {
    k = mods[prime].k;
    fourk = mods[prime].fourk;
    m = mods[prime].m;
  } else {
    k = prime.toString(2).length;
    fourk = Math.pow(4, k);
    m = Math.floor(fourk/prime);
    mods[prime] = {
      k: k,
      fourk: fourk,
      m:m
    };
  }

  var q, r;
  var sum = 1;
  while (b--) {
    sum *= a;
    if (sum > prime) {
        q = Math.floor(m*sum/fourk);
        r = sum - q*prime;
        if (r<prime) {
           sum = r;
        } else {
        sum = r - prime;
}
    }
  }
  return sum;
}