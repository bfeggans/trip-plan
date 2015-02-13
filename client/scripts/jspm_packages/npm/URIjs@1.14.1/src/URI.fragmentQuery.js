/* */ 
"format cjs";
(function(root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory(require("./URI"));
  } else if (typeof define === 'function' && define.amd) {
    define(["./URI"], factory);
  } else {
    factory(root.URI);
  }
}(this, function(URI) {
  'use strict';
  var p = URI.prototype;
  var f = p.fragment;
  URI.fragmentPrefix = '?';
  var _parts = URI._parts;
  URI._parts = function() {
    var parts = _parts();
    parts.fragmentPrefix = URI.fragmentPrefix;
    return parts;
  };
  p.fragmentPrefix = function(v) {
    this._parts.fragmentPrefix = v;
    return this;
  };
  p.fragment = function(v, build) {
    var prefix = this._parts.fragmentPrefix;
    var fragment = this._parts.fragment || '';
    if (v === true) {
      if (fragment.substring(0, prefix.length) !== prefix) {
        return {};
      }
      return URI.parseQuery(fragment.substring(prefix.length));
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.fragment = prefix + URI.buildQuery(v);
      this.build(!build);
      return this;
    } else {
      return f.call(this, v, build);
    }
  };
  p.addFragment = function(name, value, build) {
    var prefix = this._parts.fragmentPrefix;
    var data = URI.parseQuery((this._parts.fragment || '').substring(prefix.length));
    URI.addQuery(data, name, value);
    this._parts.fragment = prefix + URI.buildQuery(data);
    if (typeof name !== 'string') {
      build = value;
    }
    this.build(!build);
    return this;
  };
  p.removeFragment = function(name, value, build) {
    var prefix = this._parts.fragmentPrefix;
    var data = URI.parseQuery((this._parts.fragment || '').substring(prefix.length));
    URI.removeQuery(data, name, value);
    this._parts.fragment = prefix + URI.buildQuery(data);
    if (typeof name !== 'string') {
      build = value;
    }
    this.build(!build);
    return this;
  };
  p.addHash = p.addFragment;
  p.removeHash = p.removeFragment;
  return URI;
}));
