/* */ 
var Syntax = require("esprima-fb").Syntax;
var utils = require("../src/utils");
var reserverdWordsHelper = require("./reserved-words-helper");
function visitProperty(traverse, node, path, state) {
  utils.catchup(node.key.range[0], state);
  utils.append('"', state);
  utils.catchup(node.key.range[1], state);
  utils.append('"', state);
  utils.catchup(node.value.range[0], state);
  traverse(node.value, path, state);
  return false;
}
visitProperty.test = function(node) {
  return node.type === Syntax.Property && node.key.type === Syntax.Identifier && !node.method && !node.shorthand && !node.computed && reserverdWordsHelper.isReservedWord(node.key.name);
};
function visitMemberExpression(traverse, node, path, state) {
  traverse(node.object, path, state);
  utils.catchup(node.object.range[1], state);
  utils.append('[', state);
  utils.catchupWhiteSpace(node.property.range[0], state);
  utils.append('"', state);
  utils.catchup(node.property.range[1], state);
  utils.append('"]', state);
  return false;
}
visitMemberExpression.test = function(node) {
  return node.type === Syntax.MemberExpression && node.property.type === Syntax.Identifier && reserverdWordsHelper.isReservedWord(node.property.name);
};
exports.visitorList = [visitProperty, visitMemberExpression];
