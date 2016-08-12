import _ from './util'
import log from './log'

const slice = Array.prototype.slice,
  filters = {}

function apply(name, data, args, apply) {
  let f = filters[name],
    type = f ? f.type : undefined,
    fn

  fn = f ? apply !== false ? f.apply : f.unapply : undefined
  if (!fn) {
    log.warn(`filter[${name}].${apply !== false ? 'apply' : 'unapply'} is undefined`)
  } else {
    if (_.isFunc(args)) args = args()
    data = fn.apply(f, [data].concat(args))
  }
  return {
    stop: type == 'event' && data === false,
    data: data,
    replaceData: type !== 'event'
  }
}
let filter = {
  register(name, filter) {
    if (filters[name])
      throw Error(`Filter[${name}] is existing`)
    if (typeof filter == 'function')
      filter = {
        apply: filter
      }
    filter.type = filter.type || 'normal'
    filters[name] = filter
    log.debug('register Filter[%s:%s]', filter.type, name)
  },

  get(name) {
    return filters[name]
  },

  apply: apply,

  unapply(name, data, args) {
    return apply(name, data, args, false)
  }
}

export default filter

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

let eventFilters = {
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

_.each(eventFilters, (fn, name) => {
  filter.register(name, {
    type: 'event',
    apply: fn
  })
})

let nomalFilters = {
  json: {
    apply: function(value, indent) {
      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2)
    },
    unapply: function(value) {
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
  },

  capitalize(value) {
    if (!value && value !== 0) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },

  uppercase(value) {
    return (value || value === 0) ? value.toString().toUpperCase() : ''
  },

  lowercase(value) {
    return (value || value === 0) ? value.toString().toLowerCase() : ''
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

  pluralize(value) {
    var args = slice.call(arguments, 1)
    return args.length > 1 ? (args[value % 10 - 1] || args[args.length - 1]) : (args[0] + (value === 1 ? '' : 's'))
  }
}
_.each(nomalFilters, (f, name) => {
  filter.register(name, f)
})
