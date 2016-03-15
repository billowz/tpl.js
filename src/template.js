const dom = require('./dom'),
  {TemplateInstance} = require('./templateInstance');

const parseDelimiterReg = function(delimiter) {
    return new RegExp([delimiter[0], '([^', delimiter[0], delimiter[0], ']*)', delimiter[1]].join(''), 'g')
  },
  parseDirectiveReg = function(prefix) {
    return new RegExp('^' + prefix);
  },
  defaultCfg = {
    delimiter: ['{', '}'],
    directivePrefix: 'tpl-'
  };

export class Template {
  constructor(templ, cfg = {}) {
    this.els = $(templ);

    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
    this.directiveReg = parseDirectiveReg(this.directivePrefix);
    this.delimiterReg = parseDelimiterReg(this.delimiter);
  }

  complie(scope) {
    return new TemplateInstance(this.els, scope, this.delimiterReg, this.directiveReg);
  }
}
