/* */ 
var crypto = require("crypto");
var exportFn = require("./pbkdf2");
var exported = exportFn(crypto);
module.exports = {
  pbkdf2: exported.pbkdf2,
  pbkdf2Sync: exported.pbkdf2Sync,
  __pbkdf2Export: exportFn
};
