/* */ 
(function(Buffer) {
  var buf = require("buffer");
  var Buffer = buf.Buffer;
  module.exports = function(o) {
    return typeof o === 'object' && o instanceof Buffer;
  };
})(require("buffer").Buffer);
