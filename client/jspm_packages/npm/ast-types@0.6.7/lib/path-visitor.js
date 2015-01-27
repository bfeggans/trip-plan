/* */ 
var assert = require("assert");
var types = require("./types");
var NodePath = require("./node-path");
var Node = types.namedTypes.Node;
var isArray = types.builtInTypes.array;
var isObject = types.builtInTypes.object;
var isFunction = types.builtInTypes.function;
var hasOwn = Object.prototype.hasOwnProperty;
var undefined;
function PathVisitor() {
  assert.ok(this instanceof PathVisitor);
  this._reusableContextStack = [];
  this._methodNameTable = computeMethodNameTable(this);
  this.Context = makeContextConstructor(this);
  this._visiting = false;
  this._changeReported = false;
}
function computeMethodNameTable(visitor) {
  var typeNames = Object.create(null);
  for (var methodName in visitor) {
    if (/^visit[A-Z]/.test(methodName)) {
      typeNames[methodName.slice("visit".length)] = true;
    }
  }
  var supertypeTable = types.computeSupertypeLookupTable(typeNames);
  var methodNameTable = Object.create(null);
  var typeNames = Object.keys(supertypeTable);
  var typeNameCount = typeNames.length;
  for (var i = 0; i < typeNameCount; ++i) {
    var typeName = typeNames[i];
    methodName = "visit" + supertypeTable[typeName];
    if (isFunction.check(visitor[methodName])) {
      methodNameTable[typeName] = methodName;
    }
  }
  return methodNameTable;
}
PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
  if (methods instanceof PathVisitor) {
    return methods;
  }
  if (!isObject.check(methods)) {
    return new PathVisitor;
  }
  function Visitor() {
    assert.ok(this instanceof Visitor);
    PathVisitor.call(this);
  }
  var Vp = Visitor.prototype = Object.create(PVp);
  Vp.constructor = Visitor;
  extend(Vp, methods);
  extend(Visitor, PathVisitor);
  isFunction.assert(Visitor.fromMethodsObject);
  isFunction.assert(Visitor.visit);
  return new Visitor;
};
function extend(target, source) {
  for (var property in source) {
    if (hasOwn.call(source, property)) {
      target[property] = source[property];
    }
  }
  return target;
}
PathVisitor.visit = function visit(node, methods) {
  var visitor = PathVisitor.fromMethodsObject(methods);
  if (node instanceof NodePath) {
    visitor.visit(node);
    return node.value;
  }
  var rootPath = new NodePath({root: node});
  visitor.visit(rootPath.get("root"));
  return rootPath.value.root;
};
var PVp = PathVisitor.prototype;
var recursiveVisitWarning = ["Recursively calling visitor.visit(path) resets visitor state.", "Try this.visit(path) or this.traverse(path) instead."].join(" ");
PVp.visit = function(path) {
  assert.ok(!this._visiting, recursiveVisitWarning);
  this._visiting = true;
  this._changeReported = false;
  this.reset.apply(this, arguments);
  try {
    return this.visitWithoutReset(path);
  } finally {
    this._visiting = false;
  }
};
PVp.reset = function(path) {};
PVp.visitWithoutReset = function(path) {
  if (this instanceof this.Context) {
    return this.visitor.visitWithoutReset(path);
  }
  assert.ok(path instanceof NodePath);
  var value = path.value;
  var methodName = Node.check(value) && this._methodNameTable[value.type];
  if (methodName) {
    var context = this.acquireContext(path);
    try {
      context.invokeVisitorMethod(methodName);
    } finally {
      this.releaseContext(context);
    }
  } else {
    visitChildren(path, this);
  }
};
function visitChildren(path, visitor) {
  assert.ok(path instanceof NodePath);
  assert.ok(visitor instanceof PathVisitor);
  var value = path.value;
  if (isArray.check(value)) {
    path.each(visitor.visitWithoutReset, visitor);
  } else if (!isObject.check(value)) {} else {
    var childNames = types.getFieldNames(value);
    var childCount = childNames.length;
    var childPaths = [];
    for (var i = 0; i < childCount; ++i) {
      var childName = childNames[i];
      if (!hasOwn.call(value, childName)) {
        value[childName] = types.getFieldValue(value, childName);
      }
      childPaths.push(path.get(childName));
    }
    for (var i = 0; i < childCount; ++i) {
      visitor.visitWithoutReset(childPaths[i]);
    }
  }
}
PVp.acquireContext = function(path) {
  if (this._reusableContextStack.length === 0) {
    return new this.Context(path);
  }
  return this._reusableContextStack.pop().reset(path);
};
PVp.releaseContext = function(context) {
  assert.ok(context instanceof this.Context);
  this._reusableContextStack.push(context);
  context.currentPath = null;
};
PVp.reportChanged = function() {
  this._changeReported = true;
};
PVp.wasChangeReported = function() {
  return this._changeReported;
};
function makeContextConstructor(visitor) {
  function Context(path) {
    assert.ok(this instanceof Context);
    assert.ok(this instanceof PathVisitor);
    assert.ok(path instanceof NodePath);
    Object.defineProperty(this, "visitor", {
      value: visitor,
      writable: false,
      enumerable: true,
      configurable: false
    });
    this.currentPath = path;
    this.needToCallTraverse = true;
    Object.seal(this);
  }
  assert.ok(visitor instanceof PathVisitor);
  var Cp = Context.prototype = Object.create(visitor);
  Cp.constructor = Context;
  extend(Cp, sharedContextProtoMethods);
  return Context;
}
var sharedContextProtoMethods = Object.create(null);
sharedContextProtoMethods.reset = function reset(path) {
  assert.ok(this instanceof this.Context);
  assert.ok(path instanceof NodePath);
  this.currentPath = path;
  this.needToCallTraverse = true;
  return this;
};
sharedContextProtoMethods.invokeVisitorMethod = function invokeVisitorMethod(methodName) {
  assert.ok(this instanceof this.Context);
  assert.ok(this.currentPath instanceof NodePath);
  var result = this.visitor[methodName].call(this, this.currentPath);
  if (result === false) {
    this.needToCallTraverse = false;
  } else if (result !== undefined) {
    this.currentPath = this.currentPath.replace(result)[0];
    if (this.needToCallTraverse) {
      this.traverse(this.currentPath);
    }
  }
  assert.strictEqual(this.needToCallTraverse, false, "Must either call this.traverse or return false in " + methodName);
};
sharedContextProtoMethods.traverse = function traverse(path, newVisitor) {
  assert.ok(this instanceof this.Context);
  assert.ok(path instanceof NodePath);
  assert.ok(this.currentPath instanceof NodePath);
  this.needToCallTraverse = false;
  visitChildren(path, PathVisitor.fromMethodsObject(newVisitor || this.visitor));
};
sharedContextProtoMethods.visit = function visit(path, newVisitor) {
  assert.ok(this instanceof this.Context);
  assert.ok(path instanceof NodePath);
  assert.ok(this.currentPath instanceof NodePath);
  this.needToCallTraverse = false;
  PathVisitor.fromMethodsObject(newVisitor || this.visitor).visitWithoutReset(path);
};
sharedContextProtoMethods.reportChanged = function reportChanged() {
  this.visitor.reportChanged();
};
module.exports = PathVisitor;
