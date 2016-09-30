import _ from 'utility'
import log from './log'

const slice = Array.prototype.slice,
  translations = {}

const translate = {
  register(name, desc) {
    if (translations[name])
      throw Error(`Translate[${name}] is existing`)
    if (_.isFunc(desc))
      desc = {
        transform: desc
      }
    desc.type = desc.type || 'normal'
    translations[name] = desc
    log.debug(`register Translate[${desc.type}:${name}]`)
  },

  get(name) {
    return translations[name]
  },

  transform(name, scope, data, args, restore) {
    let f = translations[name],
      type = f && f.type,
      fn = f && (restore ? f.restore : f.transform)

    if (!fn) {
      log.warn(`Translate[${name}].${restore ? 'Restore' : 'Transform'} is undefined`)
    } else {
      data = fn.apply(scope, [data].concat(args))
    }
    return {
      stop: type == 'event' && data === false,
      data: data,
      replace: type !== 'event'
    }
  },

  restore(name, data, args) {
    return this.apply(name, data, args, false)
  }
}

export default translate

export const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  'delete': [8, 46],
  up: 38,
  left: 37,
  right: 39,
  down: 40
}

let eventTranslates = {
  key(e) {
    let which = e.which,
      k

    for (let i = 1, l = arguments.length; i < l; i++) {
      k = arguments[i]
      if (which == (keyCodes[k] || k))
        return true
    }
    return false
  },
  stop(e) {
    e.stopPropagation()
  },
  prevent(e) {
    e.preventDefault()
  },
  self(e) {
    return e.target === e.currentTarget
  }
}

_.each(eventTranslates, (fn, name) => {
  translate.register(name, {
    type: 'event',
    transform: fn
  })
})

let nomalTranslates = {
  json: {
    transform(value, indent) {
      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2)
    },
    restore(value) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
  },
  trim: {
    transform: _.trim,
    restore: _.trim
  },

  capitalize(value) {
    if (_.isString(value))
      return value.charAt(0).toUpperCase() + value.slice(1)
    return value
  },

  uppercase(value) {
    return _.isString(value) ? value.toUpperCase() : value
  },

  lowercase(value) {
    return _.isString(value) ? value.toLowerCase() : value
  },

  currency(value, currency) {
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '$'
    var stringified = Math.abs(value).toFixed(2)
    var _int = stringified.slice(0, -3)
    var i = _int.length % 3
    var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : ''
    var _float = stringified.slice(-3)
    var sign = value < 0 ? '-' : ''
    return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
  },
  plural: {
    transform(value) {
      return _.isString(value) ? _.plural(value) : value
    },
    restore(value) {
      return _.isString(value) ? _.singular(value) : value
    }
  },
  singular: {
    transform(value, plural) {
      return _.isString(value) ? _.singular(value) : value
    },
    restore(value) {
      return _.isString(value) ? _.plural(value) : value
    }
  },
  unit: {
    transform(value, unit, format, plural) {
      if (plural !== false && value != 1 && value != 0)
        unit = _.plural(unit)
      return format ? _.format(format, value, unit) : value + unit
    }
  },
  format: {
    transform(value, format) {
      let args = [format, value].concat(Array.prototype.slice.call(arguments, 2))
      return _.format.apply(_, args)
    }
  }
}
_.each(nomalTranslates, (f, name) => {
  translate.register(name, f)
})
