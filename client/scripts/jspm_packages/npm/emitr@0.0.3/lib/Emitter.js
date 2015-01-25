/* */ 
"use strict";
var slice = Array.prototype.slice;
var metaEvents = require("./events");
var MultiMap = require("./MultiMap");
var getPrototypeOf = require("./shams").getPrototypeOf;
var ONCE_FUNCTION_MARKER = {};
function notify(listeners, args) {
  if (listeners.length === 0) {
    return false;
  }
  listeners = listeners.slice();
  for (var i = 0,
      len = listeners.length; i < len; ++i) {
    var listener = listeners[i];
    listener.callback.apply(listener.context, args);
  }
  return true;
}
function notifyRemoves(emitter, listenerRecords) {
  for (var i = 0,
      len = listenerRecords.length; i < len; ++i) {
    var listenerRecord = listenerRecords[i];
    emitter.trigger(new metaEvents.RemoveListenerEvent(listenerRecord.eventIdentifier, listenerRecord.callback, listenerRecord.registeredContext));
  }
}
function Emitter() {
  this._emitterListeners = new MultiMap();
  this._emitterMetaEventsOn = false;
}
;
Emitter.prototype = {
  on: function listen(eventIdentifier, callback, context) {
    if (typeof callback !== 'function') {
      throw new TypeError("on: Illegal Argument: callback must be a function, was " + (typeof callback));
    }
    if (this._emitterListeners === undefined) {
      this._emitterListeners = new MultiMap();
    }
    if (typeof eventIdentifier === 'function' && (eventIdentifier.prototype instanceof metaEvents.MetaEvent || eventIdentifier === metaEvents.MetaEvent)) {
      this._emitterMetaEventsOn = true;
    }
    this._emitterListeners.add(eventIdentifier, {
      eventIdentifier: eventIdentifier,
      callback: callback,
      registeredContext: context,
      context: context !== undefined ? context : this
    });
    if (this._emitterMetaEventsOn === true) {
      this.trigger(new metaEvents.AddListenerEvent(eventIdentifier, callback._onceFunctionMarker === ONCE_FUNCTION_MARKER ? callback._wrappedCallback : callback, context));
    }
  },
  once: function(eventIdentifier, callback, context) {
    if (typeof callback !== 'function') {
      throw new TypeError("onnce: Illegal Argument: callback must be a function, was " + (typeof callback));
    }
    var off = this.off.bind(this),
        hasFired = false;
    function onceEventHandler() {
      if (hasFired === false) {
        hasFired = true;
        off(eventIdentifier, onceEventHandler, context);
        callback.apply(this, arguments);
      }
    }
    onceEventHandler._onceFunctionMarker = ONCE_FUNCTION_MARKER;
    onceEventHandler._wrappedCallback = callback;
    this.on(eventIdentifier, onceEventHandler, context);
  },
  off: function off(eventIdentifier, callback, context) {
    if (this._emitterListeners == null) {
      return false;
    }
    if (arguments.length === 0) {
      if (this._emitterMetaEventsOn === true) {
        var allListeners = this._emitterListeners.getValues();
        notifyRemoves(this, allListeners);
      }
      this._emitterListeners.clear();
      return true;
    } else if (arguments.length === 1) {
      if (this._emitterListeners.hasAny(eventIdentifier)) {
        var listeners = this._emitterListeners.getValues(eventIdentifier);
        this._emitterListeners['delete'](eventIdentifier);
        if (this._emitterMetaEventsOn === true) {
          notifyRemoves(this, listeners);
        }
        return true;
      }
      return false;
    } else if (eventIdentifier === null && callback === null) {
      return this.clearListeners(context);
    } else {
      if (typeof callback !== 'function') {
        throw new TypeError("off: Illegal Argument: callback must be a function, was " + (typeof callback));
      }
      var removedAListener = this._emitterListeners.removeLastMatch(eventIdentifier, function(record) {
        var callbackToCompare = record.callback._onceFunctionMarker === ONCE_FUNCTION_MARKER ? record.callback._wrappedCallback : record.callback;
        var callbackMatches = callback === callbackToCompare;
        var contextMatches = record.registeredContext === context;
        return callbackMatches && contextMatches;
      });
      if (removedAListener && this._emitterMetaEventsOn === true) {
        this.trigger(new metaEvents.RemoveListenerEvent(eventIdentifier, callback, context));
      }
      return removedAListener;
    }
  },
  trigger: function trigger(event) {
    var args;
    var anyListeners = false;
    if (this._emitterListeners != null) {
      args = slice.call(arguments, 1);
      if (this._emitterListeners.hasAny(event)) {
        anyListeners = true;
        notify(this._emitterListeners.getValues(event), args);
      }
      if (typeof event === 'object') {
        var last = event,
            proto = getPrototypeOf(event);
        while (proto !== null && proto !== last) {
          if (this._emitterListeners.hasAny(proto.constructor)) {
            anyListeners = true;
            notify(this._emitterListeners.getValues(proto.constructor), arguments);
          }
          last = proto;
          proto = getPrototypeOf(proto);
        }
      }
    }
    if (this._emitterMetaEventsOn === true && anyListeners === false && event instanceof metaEvents.DeadEvent === false) {
      this.trigger(new metaEvents.DeadEvent(event, args));
    }
    return anyListeners;
  },
  clearListeners: function clearListeners(context) {
    if (context == null) {
      throw new Error('clearListeners: context must be provided.');
    }
    var removedListeners,
        trackRemovals = false;
    if (this._emitterMetaEventsOn === true) {
      trackRemovals = true;
      removedListeners = [];
    }
    this._emitterListeners.filterAll(function(record) {
      var keepListener = record.registeredContext !== context;
      if (trackRemovals && keepListener === false) {
        removedListeners.push(record);
      }
      return keepListener;
    });
    if (trackRemovals && removedListeners.length > 0) {
      notifyRemoves(this, removedListeners);
    }
  }
};
Emitter.mixInto = function(destination) {
  if (typeof destination === 'function') {
    destination = destination.prototype;
  }
  for (var key in Emitter.prototype) {
    if (destination.hasOwnProperty(key)) {
      throw new Error("Emitter.mixInto: Destination already has function " + key + " unable to mixin.");
    }
    destination[key] = Emitter.prototype[key];
  }
};
module.exports = Emitter;
