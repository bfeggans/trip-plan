/* */ 
(function(process) {
  var dateFormat = require("../lib/dateformat");
  var val = process.argv[2] || new Date();
  console.log(dateFormat(val, 'W'));
})(require("process"));
