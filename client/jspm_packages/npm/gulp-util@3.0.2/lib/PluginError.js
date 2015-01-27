/* */ 
var util = require("util");
var arrayDiffer = require("array-differ");
var arrayUniq = require("array-uniq");
var chalk = require("chalk");
var objectAssign = require("object-assign");
var nonEnumberableProperties = ['name', 'message', 'stack'];
var propertiesNotToDisplay = nonEnumberableProperties.concat(['plugin', 'showStack', 'showProperties', '__safety', '_stack']);
var parseOptions = function(plugin, message, opt) {
  opt = opt || {};
  if (typeof plugin === 'object') {
    opt = plugin;
  } else {
    if (message instanceof Error) {
      opt.error = message;
    } else if (typeof message === 'object') {
      opt = message;
    } else {
      opt.message = message;
    }
    opt.plugin = plugin;
  }
  return objectAssign({
    showStack: false,
    showProperties: true
  }, opt);
};
function PluginError(plugin, message, opt) {
  if (!(this instanceof PluginError))
    throw new Error('Call PluginError using new');
  Error.call(this);
  var options = parseOptions(plugin, message, opt);
  var self = this;
  if (options.error) {
    arrayUniq(Object.keys(options.error).concat(nonEnumberableProperties)).forEach(function(prop) {
      self[prop] = options.error[prop];
    });
  }
  var properties = ['name', 'message', 'fileName', 'lineNumber', 'stack', 'showStack', 'showProperties', 'plugin'];
  properties.forEach(function(prop) {
    if (prop in options)
      this[prop] = options[prop];
  }, this);
  if (!this.name)
    this.name = 'Error';
  if (!this.stack) {
    var safety = {toString: function() {
        return this._messageWithDetails() + '\nStack:';
      }.bind(this)};
    Error.captureStackTrace(safety, arguments.callee || this.constructor);
    this.__safety = safety;
  }
  if (!this.plugin)
    throw new Error('Missing plugin name');
  if (!this.message)
    throw new Error('Missing error message');
}
util.inherits(PluginError, Error);
PluginError.prototype._messageWithDetails = function() {
  var messageWithDetails = 'Message:\n    ' + this.message;
  var details = this._messageDetails();
  if (details !== '') {
    messageWithDetails += '\n' + details;
  }
  return messageWithDetails;
};
PluginError.prototype._messageDetails = function() {
  if (!this.showProperties) {
    return '';
  }
  var properties = arrayDiffer(Object.keys(this), propertiesNotToDisplay);
  if (properties.length === 0) {
    return '';
  }
  var self = this;
  properties = properties.map(function stringifyProperty(prop) {
    return '    ' + prop + ': ' + self[prop];
  });
  return 'Details:\n' + properties.join('\n');
};
PluginError.prototype.toString = function() {
  var sig = chalk.red(this.name) + ' in plugin \'' + chalk.cyan(this.plugin) + '\'';
  var detailsWithStack = function(stack) {
    return this._messageWithDetails() + '\nStack:\n' + stack;
  }.bind(this);
  var msg;
  if (this.showStack) {
    if (this.__safety) {
      msg = this.__safety.stack;
    } else if (this._stack) {
      msg = detailsWithStack(this._stack);
    } else {
      msg = detailsWithStack(this.stack);
    }
  } else {
    msg = this._messageWithDetails();
  }
  return sig + '\n' + msg;
};
module.exports = PluginError;
