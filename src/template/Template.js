let templateId = 0
const templateCache = {}
export default _.dynamicClass({
  statics: {
    get(id) {
      return templateCache[id]
    }
  },
  constructor(templ, cfg = {}) {
    this.id = cfg.id || (templateId++)
    if (_.hasOwnProp(templateCache, this.id)) {
      throw new Error('Existing Template[' + this.id + ']')
    }
    let DomParser = config.get('domParser')
    this.parser = new DomParser(templ)
    templateCache[this.id] = this
  },
  complie(scope) {
    return new Instance(this.parser.complie(scope))
  }
})
