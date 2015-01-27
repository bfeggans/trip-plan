/* */ 
var assert = require("assert");
var linesModule = require("./lines");
var types = require("./types");
var getFieldValue = types.getFieldValue;
var Node = types.namedTypes.Node;
var Expression = types.namedTypes.Expression;
var SourceLocation = types.namedTypes.SourceLocation;
var util = require("./util");
var comparePos = util.comparePos;
var NodePath = types.NodePath;
var isObject = types.builtInTypes.object;
var isArray = types.builtInTypes.array;
var isString = types.builtInTypes.string;
function Patcher(lines) {
  assert.ok(this instanceof Patcher);
  assert.ok(lines instanceof linesModule.Lines);
  var self = this,
      replacements = [];
  self.replace = function(loc, lines) {
    if (isString.check(lines))
      lines = linesModule.fromString(lines);
    replacements.push({
      lines: lines,
      start: loc.start,
      end: loc.end
    });
  };
  self.get = function(loc) {
    loc = loc || {
      start: {
        line: 1,
        column: 0
      },
      end: {
        line: lines.length,
        column: lines.getLineLength(lines.length)
      }
    };
    var sliceFrom = loc.start,
        toConcat = [];
    function pushSlice(from, to) {
      assert.ok(comparePos(from, to) <= 0);
      toConcat.push(lines.slice(from, to));
    }
    replacements.sort(function(a, b) {
      return comparePos(a.start, b.start);
    }).forEach(function(rep) {
      if (comparePos(sliceFrom, rep.start) > 0) {} else {
        pushSlice(sliceFrom, rep.start);
        toConcat.push(rep.lines);
        sliceFrom = rep.end;
      }
    });
    pushSlice(sliceFrom, loc.end);
    return linesModule.concat(toConcat);
  };
}
exports.Patcher = Patcher;
exports.getReprinter = function(path) {
  assert.ok(path instanceof NodePath);
  var node = path.value;
  if (!Node.check(node))
    return;
  var orig = node.original;
  var origLoc = orig && orig.loc;
  var lines = origLoc && origLoc.lines;
  var reprints = [];
  if (!lines || !findReprints(path, reprints))
    return;
  return function(print) {
    var patcher = new Patcher(lines);
    reprints.forEach(function(reprint) {
      var old = reprint.oldPath.value;
      SourceLocation.assert(old.loc, true);
      patcher.replace(old.loc, print(reprint.newPath).indentTail(old.loc.indent));
    });
    return patcher.get(origLoc).indentTail(-orig.loc.indent);
  };
};
function findReprints(newPath, reprints) {
  var newNode = newPath.value;
  Node.assert(newNode);
  var oldNode = newNode.original;
  Node.assert(oldNode);
  assert.deepEqual(reprints, []);
  if (newNode.type !== oldNode.type) {
    return false;
  }
  var oldPath = new NodePath(oldNode);
  var canReprint = findChildReprints(newPath, oldPath, reprints);
  if (!canReprint) {
    reprints.length = 0;
  }
  return canReprint;
}
function findAnyReprints(newPath, oldPath, reprints) {
  var newNode = newPath.value;
  var oldNode = oldPath.value;
  if (newNode === oldNode)
    return true;
  if (isArray.check(newNode))
    return findArrayReprints(newPath, oldPath, reprints);
  if (isObject.check(newNode))
    return findObjectReprints(newPath, oldPath, reprints);
  return false;
}
function findArrayReprints(newPath, oldPath, reprints) {
  var newNode = newPath.value;
  var oldNode = oldPath.value;
  isArray.assert(newNode);
  var len = newNode.length;
  if (!(isArray.check(oldNode) && oldNode.length === len))
    return false;
  for (var i = 0; i < len; ++i)
    if (!findAnyReprints(newPath.get(i), oldPath.get(i), reprints))
      return false;
  return true;
}
function findObjectReprints(newPath, oldPath, reprints) {
  var newNode = newPath.value;
  isObject.assert(newNode);
  if (newNode.original === null) {
    return false;
  }
  var oldNode = oldPath.value;
  if (!isObject.check(oldNode))
    return false;
  if (Node.check(newNode)) {
    if (!Node.check(oldNode)) {
      return false;
    }
    if (!oldNode.loc) {
      return false;
    }
    if (newNode.type === oldNode.type) {
      var childReprints = [];
      if (findChildReprints(newPath, oldPath, childReprints)) {
        reprints.push.apply(reprints, childReprints);
      } else {
        reprints.push({
          newPath: newPath,
          oldPath: oldPath
        });
      }
      return true;
    }
    if (Expression.check(newNode) && Expression.check(oldNode)) {
      reprints.push({
        newPath: newPath,
        oldPath: oldPath
      });
      return true;
    }
    return false;
  }
  return findChildReprints(newPath, oldPath, reprints);
}
var reusablePos = {
  line: 1,
  column: 0
};
function hasOpeningParen(oldPath) {
  var oldNode = oldPath.value;
  var loc = oldNode.loc;
  var lines = loc && loc.lines;
  if (lines) {
    var pos = reusablePos;
    pos.line = loc.start.line;
    pos.column = loc.start.column;
    while (lines.prevPos(pos)) {
      var ch = lines.charAt(pos);
      if (ch === "(") {
        var rootPath = oldPath;
        while (rootPath.parentPath)
          rootPath = rootPath.parentPath;
        return comparePos(rootPath.value.loc.start, pos) <= 0;
      }
      if (ch !== " ") {
        return false;
      }
    }
  }
  return false;
}
function hasClosingParen(oldPath) {
  var oldNode = oldPath.value;
  var loc = oldNode.loc;
  var lines = loc && loc.lines;
  if (lines) {
    var pos = reusablePos;
    pos.line = loc.end.line;
    pos.column = loc.end.column;
    do {
      var ch = lines.charAt(pos);
      if (ch === ")") {
        var rootPath = oldPath;
        while (rootPath.parentPath)
          rootPath = rootPath.parentPath;
        return comparePos(pos, rootPath.value.loc.end) <= 0;
      }
      if (ch !== " ") {
        return false;
      }
    } while (lines.nextPos(pos));
  }
  return false;
}
function hasParens(oldPath) {
  return hasOpeningParen(oldPath) && hasClosingParen(oldPath);
}
function findChildReprints(newPath, oldPath, reprints) {
  var newNode = newPath.value;
  var oldNode = oldPath.value;
  isObject.assert(newNode);
  isObject.assert(oldNode);
  if (newNode.original === null) {
    return false;
  }
  if (!newPath.canBeFirstInStatement() && newPath.firstInStatement() && !hasOpeningParen(oldPath))
    return false;
  if (newPath.needsParens(true) && !hasParens(oldPath)) {
    return false;
  }
  for (var k in util.getUnionOfKeys(newNode, oldNode)) {
    if (k === "loc")
      continue;
    if (!findAnyReprints(newPath.get(k), oldPath.get(k), reprints))
      return false;
  }
  return true;
}
