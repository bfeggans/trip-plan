/* */ 
"format cjs";
(function(process) {
  (function(root, factory) {
    'use strict';
    if (typeof exports === 'object') {
      module.exports = factory(require("./URI"));
    } else if (typeof define === 'function' && define.amd) {
      define(["./URI"], factory);
    } else {
      root.URITemplate = factory(root.URI, root);
    }
  }(this, function(URI, root) {
    'use strict';
    var _URITemplate = root && root.URITemplate;
    var hasOwn = Object.prototype.hasOwnProperty;
    function URITemplate(expression) {
      if (URITemplate._cache[expression]) {
        return URITemplate._cache[expression];
      }
      if (!(this instanceof URITemplate)) {
        return new URITemplate(expression);
      }
      this.expression = expression;
      URITemplate._cache[expression] = this;
      return this;
    }
    function Data(data) {
      this.data = data;
      this.cache = {};
    }
    var p = URITemplate.prototype;
    var operators = {
      '': {
        prefix: '',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
      },
      '+': {
        prefix: '',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encodeReserved'
      },
      '#': {
        prefix: '#',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encodeReserved'
      },
      '.': {
        prefix: '.',
        separator: '.',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
      },
      '/': {
        prefix: '/',
        separator: '/',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
      },
      ';': {
        prefix: ';',
        separator: ';',
        named: true,
        empty_name_separator: false,
        encode: 'encode'
      },
      '?': {
        prefix: '?',
        separator: '&',
        named: true,
        empty_name_separator: true,
        encode: 'encode'
      },
      '&': {
        prefix: '&',
        separator: '&',
        named: true,
        empty_name_separator: true,
        encode: 'encode'
      }
    };
    URITemplate._cache = {};
    URITemplate.EXPRESSION_PATTERN = /\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g;
    URITemplate.VARIABLE_PATTERN = /^([^*:]+)((\*)|:(\d+))?$/;
    URITemplate.VARIABLE_NAME_PATTERN = /[^a-zA-Z0-9%_]/;
    URITemplate.expand = function(expression, data) {
      var options = operators[expression.operator];
      var type = options.named ? 'Named' : 'Unnamed';
      var variables = expression.variables;
      var buffer = [];
      var d,
          variable,
          i;
      for (i = 0; (variable = variables[i]); i++) {
        d = data.get(variable.name);
        if (!d.val.length) {
          if (d.type) {
            buffer.push('');
          }
          continue;
        }
        buffer.push(URITemplate['expand' + type](d, options, variable.explode, variable.explode && options.separator || ',', variable.maxlength, variable.name));
      }
      if (buffer.length) {
        return options.prefix + buffer.join(options.separator);
      } else {
        return '';
      }
    };
    URITemplate.expandNamed = function(d, options, explode, separator, length, name) {
      var result = '';
      var encode = options.encode;
      var empty_name_separator = options.empty_name_separator;
      var _encode = !d[encode].length;
      var _name = d.type === 2 ? '' : URI[encode](name);
      var _value,
          i,
          l;
      for (i = 0, l = d.val.length; i < l; i++) {
        if (length) {
          _value = URI[encode](d.val[i][1].substring(0, length));
          if (d.type === 2) {
            _name = URI[encode](d.val[i][0].substring(0, length));
          }
        } else if (_encode) {
          _value = URI[encode](d.val[i][1]);
          if (d.type === 2) {
            _name = URI[encode](d.val[i][0]);
            d[encode].push([_name, _value]);
          } else {
            d[encode].push([undefined, _value]);
          }
        } else {
          _value = d[encode][i][1];
          if (d.type === 2) {
            _name = d[encode][i][0];
          }
        }
        if (result) {
          result += separator;
        }
        if (!explode) {
          if (!i) {
            result += URI[encode](name) + (empty_name_separator || _value ? '=' : '');
          }
          if (d.type === 2) {
            result += _name + ',';
          }
          result += _value;
        } else {
          result += _name + (empty_name_separator || _value ? '=' : '') + _value;
        }
      }
      return result;
    };
    URITemplate.expandUnnamed = function(d, options, explode, separator, length) {
      var result = '';
      var encode = options.encode;
      var empty_name_separator = options.empty_name_separator;
      var _encode = !d[encode].length;
      var _name,
          _value,
          i,
          l;
      for (i = 0, l = d.val.length; i < l; i++) {
        if (length) {
          _value = URI[encode](d.val[i][1].substring(0, length));
        } else if (_encode) {
          _value = URI[encode](d.val[i][1]);
          d[encode].push([d.type === 2 ? URI[encode](d.val[i][0]) : undefined, _value]);
        } else {
          _value = d[encode][i][1];
        }
        if (result) {
          result += separator;
        }
        if (d.type === 2) {
          if (length) {
            _name = URI[encode](d.val[i][0].substring(0, length));
          } else {
            _name = d[encode][i][0];
          }
          result += _name;
          if (explode) {
            result += (empty_name_separator || _value ? '=' : '');
          } else {
            result += ',';
          }
        }
        result += _value;
      }
      return result;
    };
    URITemplate.noConflict = function() {
      if (root.URITemplate === URITemplate) {
        root.URITemplate = _URITemplate;
      }
      return URITemplate;
    };
    p.expand = function(data) {
      var result = '';
      if (!this.parts || !this.parts.length) {
        this.parse();
      }
      if (!(data instanceof Data)) {
        data = new Data(data);
      }
      for (var i = 0,
          l = this.parts.length; i < l; i++) {
        result += typeof this.parts[i] === 'string' ? this.parts[i] : URITemplate.expand(this.parts[i], data);
      }
      return result;
    };
    p.parse = function() {
      var expression = this.expression;
      var ePattern = URITemplate.EXPRESSION_PATTERN;
      var vPattern = URITemplate.VARIABLE_PATTERN;
      var nPattern = URITemplate.VARIABLE_NAME_PATTERN;
      var parts = [];
      var pos = 0;
      var variables,
          eMatch,
          vMatch;
      ePattern.lastIndex = 0;
      while (true) {
        eMatch = ePattern.exec(expression);
        if (eMatch === null) {
          parts.push(expression.substring(pos));
          break;
        } else {
          parts.push(expression.substring(pos, eMatch.index));
          pos = eMatch.index + eMatch[0].length;
        }
        if (!operators[eMatch[1]]) {
          throw new Error('Unknown Operator "' + eMatch[1] + '" in "' + eMatch[0] + '"');
        } else if (!eMatch[3]) {
          throw new Error('Unclosed Expression "' + eMatch[0] + '"');
        }
        variables = eMatch[2].split(',');
        for (var i = 0,
            l = variables.length; i < l; i++) {
          vMatch = variables[i].match(vPattern);
          if (vMatch === null) {
            throw new Error('Invalid Variable "' + variables[i] + '" in "' + eMatch[0] + '"');
          } else if (vMatch[1].match(nPattern)) {
            throw new Error('Invalid Variable Name "' + vMatch[1] + '" in "' + eMatch[0] + '"');
          }
          variables[i] = {
            name: vMatch[1],
            explode: !!vMatch[3],
            maxlength: vMatch[4] && parseInt(vMatch[4], 10)
          };
        }
        if (!variables.length) {
          throw new Error('Expression Missing Variable(s) "' + eMatch[0] + '"');
        }
        parts.push({
          expression: eMatch[0],
          operator: eMatch[1],
          variables: variables
        });
      }
      if (!parts.length) {
        parts.push(expression);
      }
      this.parts = parts;
      return this;
    };
    Data.prototype.get = function(key) {
      var data = this.data;
      var d = {
        type: 0,
        val: [],
        encode: [],
        encodeReserved: []
      };
      var i,
          l,
          value;
      if (this.cache[key] !== undefined) {
        return this.cache[key];
      }
      this.cache[key] = d;
      if (String(Object.prototype.toString.call(data)) === '[object Function]') {
        value = data(key);
      } else if (String(Object.prototype.toString.call(data[key])) === '[object Function]') {
        value = data[key](key);
      } else {
        value = data[key];
      }
      if (value === undefined || value === null) {
        return d;
      } else if (String(Object.prototype.toString.call(value)) === '[object Array]') {
        for (i = 0, l = value.length; i < l; i++) {
          if (value[i] !== undefined && value[i] !== null) {
            d.val.push([undefined, String(value[i])]);
          }
        }
        if (d.val.length) {
          d.type = 3;
        }
      } else if (String(Object.prototype.toString.call(value)) === '[object Object]') {
        for (i in value) {
          if (hasOwn.call(value, i) && value[i] !== undefined && value[i] !== null) {
            d.val.push([i, String(value[i])]);
          }
        }
        if (d.val.length) {
          d.type = 2;
        }
      } else {
        d.type = 1;
        d.val.push([undefined, String(value)]);
      }
      return d;
    };
    URI.expand = function(expression, data) {
      var template = new URITemplate(expression);
      var expansion = template.expand(data);
      return new URI(expansion);
    };
    return URITemplate;
  }));
})(require("process"));
