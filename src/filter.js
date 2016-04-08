const filters = {
};
let filter = {
  register(name, filter) {
    if (filters[name])
      throw Error('Filter is existing');
    if (typeof filter == 'function')
      filter = {
        apply: filter
      };
    filter.type = filter.type || 'normal';
    filters[name] = filter;
  },

  unregister(name) {
    filters[name] = undefined;
  },

  get(name) {
    return filters[name];
  },

  applyFilter(name, data, args, reset) {
    let f = filters[name], fn;

    fn = f ? reset ? f.apply : f.unapply : undefined;
    if (fn) {
      if (typeof args == 'function')
        args = args();
      return fn.apply(f, args)
    } else
      console.warn(`filter[${name}] is undefined`);
    return data;
  },

  applyExpressionFilter(f, data, argScope, argApply, reset) {
    let argExecutors = f.args,
      i = 0,
      l = argExecutors.length,
      args = [];
    for (; i < l; i++) {
      args[i] = argExecutors[i].apply(argScope, argApply);
    }
    return filter.applyFilter(f.name, data, args, reset);
  },

  applyExpression(exp, data, argScope, argApply, type, reset) {
    let fs = exp.filters, f,
      ret = data;

    for (let i = 0, l = fs.length; i < l; i++) {
      f = fs[i];
      ret = filter.applyExpressionFilter(f, data, argScope, argApply, reset);
      if (type == 'event') {
        if (ret === false)
          return false;
      } else
        data = ret;
    }
    return type == 'event' ? ret !== false : ret;
  }
}
module.exports = filter;
