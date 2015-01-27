/* */ 
"format cjs";
(function(process) {
  ;
  (function() {
    var undefined;
    var idCounter = 0;
    var indicatorObject = {};
    var keyPrefix = +new Date + '';
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
    var argsClass = '[object Arguments]',
        arrayClass = '[object Array]',
        boolClass = '[object Boolean]',
        dateClass = '[object Date]',
        funcClass = '[object Function]',
        numberClass = '[object Number]',
        objectClass = '[object Object]',
        regexpClass = '[object RegExp]',
        stringClass = '[object String]';
    var objectTypes = {
      'boolean': false,
      'function': true,
      'object': true,
      'number': false,
      'string': false,
      'undefined': false
    };
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      '\t': 't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
    var root = (objectTypes[typeof window] && window) || this;
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
      root = freeGlobal;
    }
    function baseIndexOf(array, value, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function compareAscending(a, b) {
      var ac = a.criteria,
          bc = b.criteria,
          index = -1,
          length = ac.length;
      while (++index < length) {
        var value = ac[index],
            other = bc[index];
        if (value !== other) {
          if (value > other || typeof value == 'undefined') {
            return 1;
          }
          if (value < other || typeof other == 'undefined') {
            return -1;
          }
        }
      }
      return a.index - b.index;
    }
    function escapeStringChar(match) {
      return '\\' + stringEscapes[match];
    }
    function slice(array, start, end) {
      start || (start = 0);
      if (typeof end == 'undefined') {
        end = array ? array.length : 0;
      }
      var index = -1,
          length = end - start || 0,
          result = Array(length < 0 ? 0 : length);
      while (++index < length) {
        result[index] = array[start + index];
      }
      return result;
    }
    var arrayRef = [];
    var objectProto = Object.prototype;
    var oldDash = root._;
    var toString = objectProto.toString;
    var reNative = RegExp('^' + String(toString).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/toString| for [^\]]+/g, '.*?') + '$');
    var ceil = Math.ceil,
        floor = Math.floor,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = root.isFinite,
        nativeIsNaN = root.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeRandom = Math.random;
    function lodash(value) {
      return (value instanceof lodash) ? value : new lodashWrapper(value);
    }
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    lodashWrapper.prototype = lodash.prototype;
    var support = {};
    (function() {
      var object = {
        '0': 1,
        'length': 1
      };
      support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);
    }(1));
    lodash.templateSettings = {
      'escape': /<%-([\s\S]+?)%>/g,
      'evaluate': /<%([\s\S]+?)%>/g,
      'interpolate': reInterpolate,
      'variable': ''
    };
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];
      function bound() {
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (this instanceof bound) {
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      return bound;
    }
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || root.Object();
        };
      }());
    }
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      switch (argCount) {
        case 1:
          return function(value) {
            return func.call(thisArg, value);
          };
        case 2:
          return function(a, b) {
            return func.call(thisArg, a, b);
          };
        case 3:
          return function(value, index, collection) {
            return func.call(thisArg, value, index, collection);
          };
        case 4:
          return function(accumulator, value, index, collection) {
            return func.call(thisArg, accumulator, value, index, collection);
          };
      }
      return bind(func, thisArg);
    }
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;
      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      return bound;
    }
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      return result;
    }
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (value && typeof value == 'object' && typeof value.length == 'number' && (isArray(value) || isArguments(value))) {
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;
          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }
    function baseIsEqual(a, b, stackA, stackB) {
      if (a === b) {
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;
      if (a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])) {
        return false;
      }
      if (a == null || b == null) {
        return a === b;
      }
      var className = toString.call(a),
          otherClass = toString.call(b);
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          return +a == +b;
        case numberClass:
          return a != +a ? b != +b : (a == 0 ? (1 / a == 1 / b) : a == +b);
        case regexpClass:
        case stringClass:
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        var aWrapped = a instanceof lodash,
            bWrapped = b instanceof lodash;
        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, stackA, stackB);
        }
        if (className != objectClass) {
          return false;
        }
        var ctorA = a.constructor,
            ctorB = b.constructor;
        if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ('constructor' in a && 'constructor' in b)) {
          return false;
        }
      }
      stackA || (stackA = []);
      stackB || (stackB = []);
      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var result = true,
          size = 0;
      stackA.push(a);
      stackB.push(b);
      if (isArr) {
        size = b.length;
        result = size == a.length;
        if (result) {
          while (size--) {
            if (!(result = baseIsEqual(a[size], b[size], stackA, stackB))) {
              break;
            }
          }
        }
      } else {
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            size++;
            return !(result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, stackA, stackB)) && indicatorObject;
          }
        });
        if (result) {
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              return !(result = --size > -1) && indicatorObject;
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();
      return result;
    }
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [],
          seen = callback ? [] : result;
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;
        if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
          if (callback) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = createCallback(callback, thisArg, 3);
        var index = -1,
            length = collection ? collection.length : 0;
        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;
      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == argsClass || false;
    }
    if (!isArguments(arguments)) {
      isArguments = function(value) {
        return value && typeof value == 'object' && typeof value.length == 'number' && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
      };
    }
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass || false;
    };
    var shimKeys = function(object) {
      var index,
          iterable = object,
          result = [];
      if (!iterable)
        return result;
      if (!(objectTypes[typeof object]))
        return result;
      for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
          result.push(index);
        }
      }
      return result;
    };
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    var htmlUnescapes = invert(htmlEscapes);
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');
    function assign(object) {
      if (!object) {
        return object;
      }
      for (var argsIndex = 1,
          argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
        var iterable = arguments[argsIndex];
        if (iterable) {
          for (var key in iterable) {
            object[key] = iterable[key];
          }
        }
      }
      return object;
    }
    function clone(value) {
      return isObject(value) ? (isArray(value) ? slice(value) : assign({}, value)) : value;
    }
    function defaults(object) {
      if (!object) {
        return object;
      }
      for (var argsIndex = 1,
          argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
        var iterable = arguments[argsIndex];
        if (iterable) {
          for (var key in iterable) {
            if (typeof object[key] == 'undefined') {
              object[key] = iterable[key];
            }
          }
        }
      }
      return object;
    }
    var forIn = function(collection, callback) {
      var index,
          iterable = collection,
          result = iterable;
      if (!iterable)
        return result;
      if (!objectTypes[typeof iterable])
        return result;
      for (index in iterable) {
        if (callback(iterable[index], index, collection) === indicatorObject)
          return result;
      }
      return result;
    };
    var forOwn = function(collection, callback) {
      var index,
          iterable = collection,
          result = iterable;
      if (!iterable)
        return result;
      if (!objectTypes[typeof iterable])
        return result;
      for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
          if (callback(iterable[index], index, collection) === indicatorObject)
            return result;
        }
      }
      return result;
    };
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};
      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }
    function isBoolean(value) {
      return value === true || value === false || value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }
    function isEmpty(value) {
      if (!value) {
        return true;
      }
      if (isArray(value) || isString(value)) {
        return !value.length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }
    function isEqual(a, b) {
      return baseIsEqual(a, b);
    }
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }
    function isFunction(value) {
      return typeof value == 'function';
    }
    if (isFunction(/x/)) {
      isFunction = function(value) {
        return typeof value == 'function' && toString.call(value) == funcClass;
      };
    }
    function isObject(value) {
      return !!(value && objectTypes[typeof value]);
    }
    function isNaN(value) {
      return isNumber(value) && value != +value;
    }
    function isNull(value) {
      return value === null;
    }
    function isNumber(value) {
      return typeof value == 'number' || value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }
    function isRegExp(value) {
      return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
    }
    function isString(value) {
      return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }
    function isUndefined(value) {
      return typeof value == 'undefined';
    }
    function omit(object) {
      var props = [];
      forIn(object, function(value, key) {
        props.push(key);
      });
      props = baseDifference(props, baseFlatten(arguments, true, false, 1));
      var index = -1,
          length = props.length,
          result = {};
      while (++index < length) {
        var key = props[index];
        result[key] = object[key];
      }
      return result;
    }
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);
      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }
    function pick(object) {
      var index = -1,
          props = baseFlatten(arguments, true, false, 1),
          length = props.length,
          result = {};
      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);
      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }
    function contains(collection, target) {
      var indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;
      if (length && typeof length == 'number') {
        result = indexOf(collection, target) > -1;
      } else {
        forOwn(collection, function(value) {
          return (result = value === target) && indicatorObject;
        });
      }
      return result;
    }
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });
    function every(collection, callback, thisArg) {
      var result = true;
      callback = createCallback(callback, thisArg, 3);
      var index = -1,
          length = collection ? collection.length : 0;
      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = !!callback(value, index, collection)) && indicatorObject;
        });
      }
      return result;
    }
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = createCallback(callback, thisArg, 3);
      var index = -1,
          length = collection ? collection.length : 0;
      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }
    function find(collection, callback, thisArg) {
      callback = createCallback(callback, thisArg, 3);
      var index = -1,
          length = collection ? collection.length : 0;
      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return indicatorObject;
          }
        });
        return result;
      }
    }
    function findWhere(object, properties) {
      return where(object, properties, true);
    }
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === indicatorObject) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
    }
    function forEachRight(collection, callback) {
      var length = collection ? collection.length : 0;
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection) === false && indicatorObject;
        });
      }
    }
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;
      callback = createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      var index = -1,
          length = collection ? collection.length : 0;
      if (callback == null && typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = createCallback(callback, thisArg, 3);
        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      var index = -1,
          length = collection ? collection.length : 0;
      if (callback == null && typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = createCallback(callback, thisArg, 3);
        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }
    var pluck = map;
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection)
        return accumulator;
      var noaccum = arguments.length < 3;
      callback = createCallback(callback, thisArg, 4);
      var index = -1,
          length = collection.length;
      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
        });
      }
      return accumulator;
    }
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }
    function reject(collection, callback, thisArg) {
      callback = createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }
    function some(collection, callback, thisArg) {
      var result;
      callback = createCallback(callback, thisArg, 3);
      var index = -1,
          length = collection ? collection.length : 0;
      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = callback(value, index, collection)) && indicatorObject;
        });
      }
      return !!result;
    }
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      callback = createCallback(callback, thisArg, 3);
      forEach(collection, function(value, key, collection) {
        result[++index] = {
          'criteria': [callback(value, key, collection)],
          'index': index,
          'value': value
        };
      });
      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        result[length] = result[length].value;
      }
      return result;
    }
    function toArray(collection) {
      if (isArray(collection)) {
        return slice(collection);
      }
      if (collection && typeof collection.length == 'number') {
        return map(collection);
      }
      return values(collection);
    }
    function where(collection, properties, first) {
      return (first && isEmpty(properties)) ? undefined : (first ? find : filter)(collection, properties);
    }
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;
      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }
    function flatten(array, isShallow) {
      return baseFlatten(array, isShallow);
    }
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;
      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length;
      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
        }
      }
      var array = args[0],
          index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];
      outer: while (++index < length) {
        value = array[index];
        if (indexOf(result, value) < 0) {
          var argsIndex = argsLength;
          while (--argsIndex) {
            if (indexOf(args[argsIndex], value) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      return result;
    }
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;
      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function range(start, end, step) {
      start = +start || 0;
      step = (+step || 1);
      if (end == null) {
        end = start;
        start = 0;
      }
      var index = -1,
          length = nativeMax(0, ceil((end - start) / step)),
          result = Array(length);
      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;
        callback = createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;
      callback = callback ? createCallback(callback, thisArg, 1) : identity;
      value = callback(value);
      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value) ? low = mid + 1 : high = mid;
      }
      return low;
    }
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }
    function uniq(array, isSorted, callback, thisArg) {
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }
    function zip() {
      var index = -1,
          length = max(pluck(arguments, 'length')),
          result = Array(length < 0 ? 0 : length);
      while (++index < length) {
        result[index] = pluck(arguments, index);
      }
      return result;
    }
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};
      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }
    function bind(func, thisArg) {
      return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg);
    }
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;
      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }
    function compose() {
      var funcs = arguments,
          length = funcs.length;
      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;
        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;
      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };
      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };
      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);
        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;
          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          } else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        } else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() {
        func.apply(undefined, args);
      }, 1);
    }
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() {
        func.apply(undefined, args);
      }, wait);
    }
    function memoize(func, resolver) {
      var cache = {};
      return function() {
        var key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
        return hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = func.apply(this, arguments));
      };
    }
    function once(func) {
      var ran,
          result;
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);
        func = null;
        return result;
      };
    }
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;
      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      options = {};
      options.leading = leading;
      options.maxWait = wait;
      options.trailing = trailing;
      return debounce(func, wait, options);
    }
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func);
      return function(object) {
        var length = props.length,
            result = false;
        while (length--) {
          if (!(result = object[props[length]] === func[props[length]])) {
            break;
          }
        }
        return result;
      };
    }
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }
    function identity(value) {
      return value;
    }
    function mixin(object) {
      forEach(functions(object), function(methodName) {
        var func = lodash[methodName] = object[methodName];
        lodash.prototype[methodName] = function() {
          var args = [this.__wrapped__];
          push.apply(args, arguments);
          var result = func.apply(lodash, args);
          return this.__chain__ ? new lodashWrapper(result, true) : result;
        };
      });
    }
    function noConflict() {
      root._ = oldDash;
      return this;
    }
    function noop() {}
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };
    function property(key) {
      return function(object) {
        return object[key];
      };
    }
    function random(min, max) {
      if (min == null && max == null) {
        max = 1;
      }
      min = +min || 0;
      if (max == null) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      return min + floor(nativeRandom() * (max - min + 1));
    }
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }
    function template(text, data, options) {
      var _ = lodash,
          settings = _.templateSettings;
      text = String(text || '');
      options = defaults({}, options, settings);
      var index = 0,
          source = "__p += '",
          variable = options.variable;
      var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + (options.interpolate || reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, evaluateValue, offset) {
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
        if (escapeValue) {
          source += "' +\n_.escape(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";
      if (!variable) {
        variable = 'obj';
        source = 'with (' + variable + ' || {}) {\n' + source + '\n}\n';
      }
      source = 'function(' + variable + ') {\n' + "var __t, __p = '', __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" + source + 'return __p\n}';
      try {
        var result = Function('_', 'return ' + source)(_);
      } catch (e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      result.source = source;
      return result;
    }
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);
      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }
    function uniqueId(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    }
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }
    function wrapperValueOf() {
      return this.__wrapped__;
    }
    lodash.after = after;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.countBy = countBy;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.range = range;
    lodash.reject = reject;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.zip = zip;
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.clone = clone;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = findWhere;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;
    lodash.take = first;
    lodash.head = first;
    mixin(lodash);
    lodash.VERSION = '2.4.1';
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.value = wrapperValueOf;
    forEach(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__;
        func.apply(value, arguments);
        if (!support.spliceObjects && value.length === 0) {
          delete value[0];
        }
        return this;
      };
    });
    forEach(['concat', 'join', 'slice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            result = func.apply(value, arguments);
        if (this.__chain__) {
          result = new lodashWrapper(result);
          result.__chain__ = true;
        }
        return result;
      };
    });
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      root._ = lodash;
      define(function() {
        return lodash;
      });
    } else if (freeExports && freeModule) {
      if (moduleExports) {
        (freeModule.exports = lodash)._ = lodash;
      } else {
        freeExports._ = lodash;
      }
    } else {
      root._ = lodash;
    }
  }.call(this));
})(require("process"));
