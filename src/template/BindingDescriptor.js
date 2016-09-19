import _ from '../util'

const TEXT = 1,
  DIRECTIVE = 2,
  DIRECTIVE_GROUP = 3

let Descriptor = _.dynamicClass({
  constructor(type) {
    this.type = type
  },
  isText() {
    return this.type === TEXT
  },
  isDirective() {
    return this.type === DIRECTIVE
  },
  isGroup() {
    return this.type === DIRECTIVE_GROUP
  }
})

export default {
  createText() {

    },
    createDirective() {

    },
    createGroup() {

    }
}
