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
  var b = p.build;
  URI.fragmentPrefix = '!';
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
    var furi;
    if (v === true) {
      if (fragment.substring(0, prefix.length) !== prefix) {
        furi = URI('');
      } else {
        furi = new URI(fragment.substring(prefix.length));
      }
      this._fragmentURI = furi;
      furi._parentURI = this;
      return furi;
    } else if (v !== undefined && typeof v !== 'string') {
      this._fragmentURI = v;
      v._parentURI = v;
      this._parts.fragment = prefix + v.toString();
      this.build(!build);
      return this;
    } else if (typeof v === 'string') {
      this._fragmentURI = undefined;
    }
    return f.call(this, v, build);
  };
  p.build = function(deferBuild) {
    var t = b.call(this, deferBuild);
    if (deferBuild !== false && this._parentURI) {
      this._parentURI.fragment(this);
    }
    return t;
  };
  return URI;
}));
