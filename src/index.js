const _ = require('lodash'),
  $ = require('jquery'),
  PRIMITIVE = 0,
  KEYPATH = 1,
  TEXT = 0,
  BINDING = 1,
  templateContentReg = /^[\s\t\r\n]*</,
  defaultCfg = {
    delimiters: ['{', '}']
  };

class Template {
  constructor(templ, cfg) {
    this.template = $(templ);
    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});
    this.parse = this.parse.bind(this);
  }

  complie(bind) {
    let el = this.template.clone();
    _.each(el, this.parse);
    return el;
  }

  parseText($el) {
    let tokens = parseTemplate($el.text(), this.cfg.delimiters),
      parent = $el.parent();
    _.each(tokens, (token) => {
      let text = document.createTextNode(token.value);
      $(text).insertBefore($el);
      if (token.type === BINDING) {

      }
    });
    $el.remove();
  }
  parse(node) {
    let block = false,
      $el = $(node);
    switch (node.nodeType) {
      case 1: // Element

        break;
      case 3: // Text
        this.parseText($el);
        break;
      case 8: // Comments
    }
    _.each($el.contents(), this.parse);
  }

  buildBinding(binding, node, type, declaration) {
    let pipes = declaration.split('|').map(pipe => {
      return pipe.trim()
    })

    let context = pipes.shift().split('<').map(ctx => {
      return ctx.trim()
    })

    let keypath = context.shift()
    let dependencies = context.shift()
    let options = {
      formatters: pipes
    }

    if (dependencies) {
      options.dependencies = dependencies.split(/\s+/)
    }

    this.bindings.push(new binding(this, node, type, keypath, options))
  }
}

function parseType(string) {
  let type = PRIMITIVE
  let value = string

  if (/^'.*'$|^".*"$/.test(string)) {
    value = string.slice(1, -1)
  } else if (string === 'true') {
    value = true
  } else if (string === 'false') {
    value = false
  } else if (string === 'null') {
    value = null
  } else if (string === 'undefined') {
    value = undefined
  } else if (isNaN(Number(string)) === false) {
    value = Number(string)
  } else {
    type = KEYPATH
  }

  return {
    type: type,
    value: value
  }
}

function parseTemplate(template, delimiters) {
  let tokens = []
  let length = template.length
  let index = 0
  let lastIndex = 0

  while (lastIndex < length) {
    index = template.indexOf(delimiters[0], lastIndex)

    if (index < 0) {
      tokens.push({
        type: TEXT,
        value: template.slice(lastIndex)
      })

      break
    } else {
      if (index > 0 && lastIndex < index) {
        tokens.push({
          type: TEXT,
          value: template.slice(lastIndex, index)
        })
      }

      lastIndex = index + delimiters[0].length
      index = template.indexOf(delimiters[1], lastIndex)

      if (index < 0) {
        let substring = template.slice(lastIndex - delimiters[1].length)
        lastToken = tokens[tokens.length - 1]

        if (lastToken && lastToken.type === TEXT) {
          lastToken.value += substring
        } else {
          tokens.push({
            type: TEXT,
            value: substring
          })
        }

        break
      }

      let value = template.slice(lastIndex, index).trim()

      tokens.push({
        type: BINDING,
        value: value
      })

      lastIndex = index + delimiters[1].length
    }
  }

  return tokens
}
module.exports = Template;
