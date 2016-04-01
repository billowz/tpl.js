const _ = require('./util')

export function query(selectors, all) {
  return all ? $(selectors)[0] : $(selectors).toArray();
}

export function cloneNode(el, deep) {
  if (el instanceof Array) {
    let els = [];
    for (let i = 0, l = el.length; i < l; i++)
      els[i] = el.cloneNode(deep !== false);
    return els;
  } else
    return el.cloneNode(deep !== false);
}

export function remove(el) {
  if (el instanceof Array) {
    for (let i = 0, l = el.length; i < l; i++) {
      $(el[i]).remove();
    }
  } else
    $(el).remove();
}

export function before(el, target) {
  $(el).insertBefore(target)
}

export function after(el, target) {
  $(el).insertAfter(target)
}

export function append(el, target) {
  $(el).append(target)
}

export function prepend(target, el) {
  $(el).prepend(target)
}

export function on(el, event, cb) {
  $(el).on(event, cb)
}

export function off(el, event, cb) {
  $(el).off(event, cb)
}

export function html(el, val) {
  if (arguments.length > 1)
    return $(el).html(val);
  return $(el).html();
}

export function text(el, text) {
  if (el.nodeType == 3) {
    if (arguments.length > 1)
      return (el.data = text);
    return el.data;
  } else {
    if (arguments.length > 1)
      return $(el).text(text);
    return $(el).text()
  }
}

export function attr(el, attr, val) {
  if (arguments.length > 2)
    return $(el).attr(attr, val);
  return $(el).attr(attr);
}

export function removeAttr(el, attr) {
  return $(el).removeAttr(attr)
}

export function style(el, style) {
  if (arguments.length > 1)
    return $(el).attr('style', style);
  return $(el).attr('style');
}

export function css(el, name, val) {
  if (arguments.length > 1)
    return $(el).css(name, val);
  return $(el).css(name);
}


export function val(el, val) {
  if (arguments.length > 1)
    return $(el).val();
  return $(el).val(val);
}

export function checked(el) {
  return $(el).prop('checked')
}

export function checked(el, val) {
  if (arguments.length > 1)
    return $(el).prop('checked', val)
  return $(el).prop('checked')
}

export function className(el, cls) {
  if (arguments.length > 1)
    return $(el).attr('class', cls);
  return $(el).attr('class');
}

export function addClass(el, cls) {
  $(el).addClass(cls)
}

export function removeClass(el, cls) {
  $(el).removeClass(cls)
}

export function focus(el) {
  $(el).focus();
}
