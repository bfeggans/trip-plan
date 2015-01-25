/* */ 
"use strict";
var shams = require("./shams");
var Event = function() {};
Event.extend = function inlineExtend(properties) {
  var superclass = this,
      subclassConstructor;
  if (typeof superclass !== 'function') {
    throw new TypeError("extend: Superclass must be a constructor function, was a " + typeof superclass);
  }
  if (typeof properties === 'function') {
    subclassConstructor = properties;
  } else if (properties != null && properties.hasOwnProperty('constructor')) {
    subclassConstructor = properties.constructor;
  } else {
    subclassConstructor = function() {
      superclass.apply(this, arguments);
    };
  }
  subclassConstructor.superclass = superclass;
  subclassConstructor.prototype = shams.create(superclass.prototype, {constructor: {
      enumerable: false,
      value: subclassConstructor
    }});
  if (typeof properties === 'object') {
    if (shams.getPrototypeOf(properties) !== Object.prototype) {
      throw new Error("extend: Can't extend something that already has a prototype chain.");
    }
    for (var instanceProperty in properties) {
      if (instanceProperty !== 'constructor' && properties.hasOwnProperty(instanceProperty)) {
        subclassConstructor.prototype[instanceProperty] = properties[instanceProperty];
      }
    }
  }
  for (var staticProperty in superclass) {
    if (superclass.hasOwnProperty(staticProperty)) {
      subclassConstructor[staticProperty] = superclass[staticProperty];
    }
  }
  return subclassConstructor;
};
Event.prototype.toString = function() {
  var result = [];
  for (var key in this) {
    if (typeof result[key] !== 'function') {
      result.push(key + ": " + this[key] + ",");
    }
  }
  return result.join(" ");
};
module.exports = Event;
