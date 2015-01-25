/* */ 
(function(process) {
  var defaults = require("lodash.defaults"),
      escape = require("lodash.escape"),
      escapeStringChar = require("lodash._escapestringchar"),
      keys = require("lodash.keys"),
      reInterpolate = require("lodash._reinterpolate"),
      templateSettings = require("lodash.templatesettings"),
      values = require("lodash.values");
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
  var reNoMatch = /($^)/;
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
  function template(text, data, options) {
    var settings = templateSettings.imports._.templateSettings || templateSettings;
    text = String(text || '');
    options = defaults({}, options, settings);
    var imports = defaults({}, options.imports, settings.imports),
        importsKeys = keys(imports),
        importsValues = values(imports);
    var isEvaluating,
        index = 0,
        interpolate = options.interpolate || reNoMatch,
        source = "__p += '";
    var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
    text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);
      source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
      if (escapeValue) {
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    var variable = options.variable,
        hasVariable = variable;
    if (!hasVariable) {
      variable = 'obj';
      source = 'with (' + variable + ') {\n' + source + '\n}\n';
    }
    source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
    source = 'function(' + variable + ') {\n' + (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') + "var __t, __p = '', __e = _.escape" + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
    try {
      var result = Function(importsKeys, 'return ' + source).apply(undefined, importsValues);
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
  module.exports = template;
})(require("process"));
