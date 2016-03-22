const _ = require('./util')

export function clone(el) {
  return $(el).clone();
}

export function remove(el, coll) {
  $(el).remove();
}

export function before(el, target) {
  $(el).insertBefore(target)
}

export function after(el, target) {
  $(el).insertAfter(target)
}

export function append(target, el) {
  $(target).append(el)
}

export function appendTo(el, target) {
  append(target, el);
}

export function prepend(target, el) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    append(target, el)
  }
}

export function prependTo(el, target) {
  prepend(target, el)
}

export function replace(target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

export function on(el, event, cb, useCapture) {
  $(el).on(event, cb)
}

export function off(el, event, cb) {
  $(el).off(event, cb)
}

export function setHtml(el, html) {
  $(el).html(html);
}

export function html(el) {
  return $(el).html();
}

export function setText(el, text) {
  el.data = text;
}

export function text(el) {
  return el.data;
}

export function setAttr(el, attr, val) {
  el.setAttribute(attr, val);
}

export function removeAttr(el, attr) {
  el.removeAttribute(attr)
}

export function attr(el, attr) {
  return el.getAttribute(attr)
}

export function style(el) {
  return $(el).attr('style');
}

export function setStyle(el, style) {
  $(el).attr('style', style);
}

export function css(el, name) {
  return $(el).css(name);
}

export function setCss(el, name, val) {
  return $(el).css(name, val);
}

export function val(el) {
  return $(el).val();
}

export function setVal(el, val) {
  return $(el).val(val);
}

export function checked(el) {
  return $(el).prop('checked')
}

export function setChecked(el, val) {
  return $(el).prop('checked', val)
}

export function setClass(el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}

export function addClass(el, cls) {
  $(el).addClass(cls)
}

export function removeClass(el, cls) {
  $(el).removeClass(cls)
}
