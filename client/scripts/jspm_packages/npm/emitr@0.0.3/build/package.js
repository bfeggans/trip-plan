/* */ 
"use strict";
var fs = require("fs-extra");
var path = require("path");
var webbuild = require("webbuilder");
var now = new Date();
var libraryDir = path.resolve(__dirname, "..");
var moduleName = require("../package.json!systemjs-json").name || path.basename(libraryDir);
fs.removeSync(path.join(libraryDir, 'target'));
var singleOut = path.join(libraryDir, "/target/single/" + moduleName + ".js");
fs.mkdirpSync(path.dirname(singleOut));
webbuild(libraryDir, {
  out: singleOut,
  prefix: "// " + moduleName + " built for browser " + now.toISOString() + "\n",
  includeSystem: true,
  withDependencies: true
});
var systemOut = path.join(libraryDir, "/target/system/" + moduleName + ".js");
fs.mkdirpSync(path.dirname(systemOut));
webbuild(libraryDir, {
  out: systemOut,
  prefix: "// " + moduleName + " built for bundle module system " + now.toISOString() + "\n",
  includeSystem: false,
  withDependencies: false
});
