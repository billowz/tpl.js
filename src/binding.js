const _ = require('lodash');
class Binding {
  constructor(tpl) {
    this.tpl = tpl;
    this.scope = tpl.bind;
  }

  bind() {
    throw 'Abstract Method [' + this.constructor.name + '.bind]';
  }

  unbind() {
    throw 'Abstract Method [' + this.constructor.name + '.unbind]';
  }

  getScope() {
    return this.scope;
  }
}

Binding.genComment = true;

module.exports = Binding;
