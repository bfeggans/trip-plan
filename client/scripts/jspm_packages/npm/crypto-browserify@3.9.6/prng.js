/* */ 
(function(Buffer) {
  'use strict';
  (function() {
    var g = ('undefined' === typeof window ? global : window) || {};
    var _crypto = (g.crypto || g.msCrypto || require('@empty'));
    module.exports = function(size) {
      if (_crypto.getRandomValues) {
        var bytes = new Buffer(size);
        _crypto.getRandomValues(bytes);
        return bytes;
      } else if (_crypto.pseudoRandomBytes) {
        return _crypto.pseudoRandomBytes(size);
      } else
        throw new Error('pseudo random number generation not yet implemented for this browser\n' + 'use chrome, FireFox or Internet Explorer 11');
    };
  }());
})(require("buffer").Buffer);
