const Binding = require('./binding'),
  {ArrayIterator, YieId} = require('./util');

class DirectiveGroup extends Binding {
  constructor(el, tpl, directives) {
    super(tpl);
    this.el = el;
    this.directives = directives;
    this.directives.sort((a, b) => {
      return (b.priority - a.priority) || 0;
    });
  }

  bind() {
    let iter = new ArrayIterator(this.directives),
      _self = this;
    function parse() {
      let directive, ret;
      while (iter.hasNext()) {
        directive = iter.next();
        ret = directive.bind();
        _self.scope = directive.getScope();
        if (iter.hasNext() && ret && ret instanceof YieId) {
          ret.then(parse);
          break;
        }
      }
    }
    parse();
  }

  unbind() {
    this.directives.forEach(directive => {
      directive.unbind();
      this.scope = directive.getScope();
    });
  }
}
module.exports = DirectiveGroup;
