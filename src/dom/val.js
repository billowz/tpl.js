const _ = require('../util'),
  dom = require('./core');

_.assign(dom, {
  val(el, val) {
    let hook = valHooks[el.type || el.tagName.toLowerCase()];
    if (arguments.length > 1) {
      if (hook && hook.set) {
        hook.set(el, val);
      } else {
        if (val === undefined || val === null || val === NaN) {
          val = '';
        } else if (typeof val != 'string')
          val = val + '';
        el.value = val;
      }
    } else {
      if (hook && hook.get) {
        return hook.get(el);
      } else
        return el.value || '';
    }
  }
});

module.exports = dom;

let valHooks = dom.valHooks = {
  option: {
    get: function(elem) {
      var val = elem.attributes.value;
      return !val || val.specified ? elem.value : elem.text;
    }
  },

  select: {
    get: function(elem) {
      let signle = elem.type == 'select-one',
        index = elem.selectedIndex;
      if (index < 0)
        return signle ? undefined : [];

      let options = elem.options, option,
        values = signle ? undefined : [];

      for (let i = 0, l = options.length; i < l; i++) {
        option = options[i];
        if (option.selected || i == index) {
          if (signle)
            return dom.val(option);
          values.push(dom.val(option));
        }
      }
      return values;
    },

    set: function(elem, value) {
      let signle = elem.type == 'select-one',
        options = elem.options, option,
        i, l;

      elem.selectedIndex = -1;
      if( (value instanceof Array) ) {
        if (signle) {
          value = value[0];
        } else {
          if (!value.length)
            return;
          let vals = {};
          for (i = 0, l = value.length; i < l; i++)
            vals[value[i]] = true;

          for (i = 0, l = options.length; i < l; i++) {
            option = options[i];
            if (vals[dom.val(option)] === true)
              option.selected = true;
          }
          return;
        }
      }
      if (value !== undefined && value !== null) {
        if (typeof value != 'string')
          value = value + '';
        for (i = 0, l = options.length; i < l; i++) {
          option = options[i];
          if (dom.val(option) == value) {
            option.selected = true;
            return;
          }
        }
      }
    }
  }
}
