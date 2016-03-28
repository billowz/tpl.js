const _ = require('../util'),
  dom = require('./core')

_.assign(dom, {
  prop: function(elem, name, value) {
    name = propFix[name] || name;
    let hook = propHooks[name];
    if (arguments.length > 2) {
      if (hook && hook.set)
        return hook.set(elem, name, value);
      return (elem[name] = value);
    } else {
      if (hook && hook.get)
        return hook.get(elem, name);
      return elem[name];
    }
  },
  attr(el, attr, val) {
    if (arguments.length > 2)
      return el.setAttribute(attr, val);
    return el.getAttribute(attr)
  },
  removeAttr(el, attr) {
    el.removeAttribute(attr)
  },
  checked(el, check) {
    if (arguments.length > 1)
      return dom.prop(el, 'checked', check)
    return dom.prop(el, 'checked')
  },
  class(el, cls) {
    if (arguments.length > 1)
      return dom.prop(el, 'class', cls)
    return dom.prop(el, 'class')
  },
  addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls)
    } else {
      var cur = ' ' + (dom.prop(el, 'class') || '') + ' '
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        dom.class(el, _.trim(cur + cls))
      }
    }
  },
  removeClass(el, cls) {
    if (el.classList) {
      el.classList.remove(cls)
    } else {
      var cur = ' ' + (dom.prop(el, 'class') || '') + ' '
      var tar = ' ' + cls + ' '
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ')
      }
      dom.class(el, _.trim(cur))
    }
  },
  style(el, style) {
    if (arguments.length > 1)
      return dom.prop(el, 'style', style)
    return dom.prop(el, 'style')
  }
});

module.exports = dom;

let rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i,
  propFix = dom.propFix = {
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    'for': 'htmlFor',
    'class': 'className',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    cellpadding: 'cellPadding',
    rowspan: 'rowSpan',
    colspan: 'colSpan',
    usemap: 'useMap',
    frameborder: 'frameBorder',
    contenteditable: 'contentEditable'
  },
  propHooks = dom.propHooks = {
    tabIndex: {
      get: function(elem) {
        let attributeNode = elem.getAttributeNode('tabindex');

        return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) :
          rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
            0 : undefined;
      }
    }
  }
