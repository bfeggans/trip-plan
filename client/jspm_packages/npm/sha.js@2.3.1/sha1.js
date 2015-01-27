/* */ 
(function(Buffer) {
  var inherits = require("inherits");
  var Hash = require("./hash");
  var A = 0 | 0;
  var B = 4 | 0;
  var C = 8 | 0;
  var D = 12 | 0;
  var E = 16 | 0;
  var W = new (typeof Int32Array === 'undefined' ? Array : Int32Array)(80);
  var POOL = [];
  function Sha1() {
    if (POOL.length)
      return POOL.pop().init();
    if (!(this instanceof Sha1))
      return new Sha1();
    this._w = W;
    Hash.call(this, 16 * 4, 14 * 4);
    this._h = null;
    this.init();
  }
  inherits(Sha1, Hash);
  Sha1.prototype.init = function() {
    this._a = 0x67452301;
    this._b = 0xefcdab89;
    this._c = 0x98badcfe;
    this._d = 0x10325476;
    this._e = 0xc3d2e1f0;
    Hash.prototype.init.call(this);
    return this;
  };
  Sha1.prototype._POOL = POOL;
  Sha1.prototype._update = function(X) {
    var a,
        b,
        c,
        d,
        e,
        _a,
        _b,
        _c,
        _d,
        _e;
    a = _a = this._a;
    b = _b = this._b;
    c = _c = this._c;
    d = _d = this._d;
    e = _e = this._e;
    var w = this._w;
    for (var j = 0; j < 80; j++) {
      var W = w[j] = j < 16 ? X.readInt32BE(j * 4) : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      var t = add(add(rol(a, 5), sha1_ft(j, b, c, d)), add(add(e, W), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }
    this._a = add(a, _a);
    this._b = add(b, _b);
    this._c = add(c, _c);
    this._d = add(d, _d);
    this._e = add(e, _e);
  };
  Sha1.prototype._hash = function() {
    if (POOL.length < 100)
      POOL.push(this);
    var H = new Buffer(20);
    H.writeInt32BE(this._a | 0, A);
    H.writeInt32BE(this._b | 0, B);
    H.writeInt32BE(this._c | 0, C);
    H.writeInt32BE(this._d | 0, D);
    H.writeInt32BE(this._e | 0, E);
    return H;
  };
  function sha1_ft(t, b, c, d) {
    if (t < 20)
      return (b & c) | ((~b) & d);
    if (t < 40)
      return b ^ c ^ d;
    if (t < 60)
      return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }
  function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
  }
  function add(x, y) {
    return (x + y) | 0;
  }
  function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  module.exports = Sha1;
})(require("buffer").Buffer);
