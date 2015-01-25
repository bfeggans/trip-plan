/* */ 
(function(Buffer, process) {
  var path = require("path");
  var clone = require("clone");
  var cloneStats = require("clone-stats");
  var cloneBuffer = require("./lib/cloneBuffer");
  var isBuffer = require("./lib/isBuffer");
  var isStream = require("./lib/isStream");
  var isNull = require("./lib/isNull");
  var inspectStream = require("./lib/inspectStream");
  var Stream = require("stream");
  function File(file) {
    if (!file)
      file = {};
    var history = file.path ? [file.path] : file.history;
    this.history = history || [];
    this.cwd = file.cwd || process.cwd();
    this.base = file.base || this.cwd;
    this.stat = file.stat || null;
    this.contents = file.contents || null;
  }
  File.prototype.isBuffer = function() {
    return isBuffer(this.contents);
  };
  File.prototype.isStream = function() {
    return isStream(this.contents);
  };
  File.prototype.isNull = function() {
    return isNull(this.contents);
  };
  File.prototype.isDirectory = function() {
    return this.isNull() && this.stat && this.stat.isDirectory();
  };
  File.prototype.clone = function(opt) {
    if (typeof opt === 'boolean') {
      opt = {
        deep: opt,
        contents: true
      };
    } else if (!opt) {
      opt = {
        deep: false,
        contents: true
      };
    } else {
      opt.deep = opt.deep === true;
      opt.contents = opt.contents !== false;
    }
    var contents;
    if (this.isStream()) {
      contents = this.contents.pipe(new Stream.PassThrough());
      this.contents = this.contents.pipe(new Stream.PassThrough());
    } else if (this.isBuffer()) {
      contents = opt.contents ? cloneBuffer(this.contents) : this.contents;
    }
    var file = new File({
      cwd: this.cwd,
      base: this.base,
      stat: (this.stat ? cloneStats(this.stat) : null),
      history: this.history.slice(),
      contents: contents
    });
    Object.keys(this).forEach(function(key) {
      if (key === '_contents' || key === 'stat' || key === 'history' || key === 'path' || key === 'base' || key === 'cwd') {
        return;
      }
      file[key] = opt.deep ? clone(this[key], true) : this[key];
    }, this);
    return file;
  };
  File.prototype.pipe = function(stream, opt) {
    if (!opt)
      opt = {};
    if (typeof opt.end === 'undefined')
      opt.end = true;
    if (this.isStream()) {
      return this.contents.pipe(stream, opt);
    }
    if (this.isBuffer()) {
      if (opt.end) {
        stream.end(this.contents);
      } else {
        stream.write(this.contents);
      }
      return stream;
    }
    if (opt.end)
      stream.end();
    return stream;
  };
  File.prototype.inspect = function() {
    var inspect = [];
    var filePath = (this.base && this.path) ? this.relative : this.path;
    if (filePath) {
      inspect.push('"' + filePath + '"');
    }
    if (this.isBuffer()) {
      inspect.push(this.contents.inspect());
    }
    if (this.isStream()) {
      inspect.push(inspectStream(this.contents));
    }
    return '<File ' + inspect.join(' ') + '>';
  };
  Object.defineProperty(File.prototype, 'contents', {
    get: function() {
      return this._contents;
    },
    set: function(val) {
      if (!isBuffer(val) && !isStream(val) && !isNull(val)) {
        throw new Error('File.contents can only be a Buffer, a Stream, or null.');
      }
      this._contents = val;
    }
  });
  Object.defineProperty(File.prototype, 'relative', {
    get: function() {
      if (!this.base)
        throw new Error('No base specified! Can not get relative.');
      if (!this.path)
        throw new Error('No path specified! Can not get relative.');
      return path.relative(this.base, this.path);
    },
    set: function() {
      throw new Error('File.relative is generated from the base and path attributes. Do not modify it.');
    }
  });
  Object.defineProperty(File.prototype, 'path', {
    get: function() {
      return this.history[this.history.length - 1];
    },
    set: function(path) {
      if (typeof path !== 'string')
        throw new Error('path should be string');
      if (path && path !== this.path) {
        this.history.push(path);
      }
    }
  });
  module.exports = File;
})(require("buffer").Buffer, require("process"));
