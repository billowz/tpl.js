const _ = require('./util'),
  tmpDiv = document.createElement('div')
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE');

    head.appendChild(styleTag);
    doc.__qsaels = [];
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
    } else { // others
      let textnode = document.createTextNode(selector + "{x:expression(document.__qsaels.push(this))}");
      styleTag.appendChild(textnode);
    }
    window.scrollBy(0, 0);
    return doc.__qsaels;
  }
}
if (!document.querySelector) {
  document.querySelector = function querySelector(selectors) {
    let elements = document.querySelectorAll(selectors);
    return elements.length ? elements[0] : null;
  }
}
function insertAfter(parentEl, el, target) {
  if (parentEl.lastChild == target)
    parentEl.appendChild(el);
  else
    parentEl.insertBefore(el, target.nextSibling);
}

let propFix = {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },
  propHooks = {}

let dom = {
  prop: function(elem, name, value) {
    name = propFix[name] || name;
    hook = propHooks[name];
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
  query(selectors, all) {
    if (typeof selectors == 'string')
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
    return selectors;
  },
  inDoc(node) {
    let doc = document.documentElement,
      parent = node && node.parentNode;

    return doc === node || doc === parent ||
      !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
  },
  cloneNode(el, deep) {
    if (el instanceof Array) {
      let els = [];
      for (let i = 0, l = el.length; i < l; i++)
        els[i] = el.cloneNode(deep !== false);
      return els;
    } else
      return el.cloneNode(deep !== false);
  },
  remove(el) {
    if (el instanceof Array) {
      let _el;
      for (let i = 0, l = el.length; i < l; i++) {
        _el = el[i];
        _el.parentNode.removeChild(_el);
      }
    } else
      el.parentNode.removeChild(el);
  },
  before(el, target) {
    if (target instanceof Array)
      target = target[0];

    let parent = target.parentNode;

    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        parent.insertBefore(el[i], target);
      }
    } else
      parent.insertBefore(el, target);
  },
  after(el, target) {
    if (target instanceof Array)
      target = target[target.length - 1];

    let parent = target.parentNode;

    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        insertAfter(parent, el[i], target);
      }
    } else
      insertAfter(parent, el, target);

  },
  append(target, el) {
    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        target.appendChild(el[i]);
      }
    } else
      target.appendChild(el);
  },
  appendTo(el, target) {
    dom.append(target, el);
  },
  prepend(target, el) {
    if (target.firstChild) {
      dom.before(el, target.firstChild)
    } else {
      dom.append(target, el)
    }
  },
  prependTo(el, target) {
    dom.prepend(target, el)
  },
  on(el, event, cb) {
    $(el).on(event, cb)
  },
  off(el, event, cb) {
    $(el).off(event, cb)
  },
  html(el) {
    return el.innerHTML;
  },
  setHtml(el, html) {
    el.innerHTML = html;
  },
  text(el) {
    return el.data;
  },
  setText(el, text) {
    el.data = text;
  },
  attr(el, attr) {
    return el.getAttribute(attr)
  },
  setAttr(el, attr, val) {
    el.setAttribute(attr, val);
  },
  removeAttr(el, attr) {
    el.removeAttribute(attr)
  },
  style(el) {
    return dom.attr('style')
  },
  setStyle(el, style) {
    return dom.setAttr('style', style)
  },
  css(el, name) {
    return $(el).css(name);
  },
  setCss(el, name, val) {
    $(el).css(name, val);
  },
  val(el) {
    return $(el).val();
  },
  setVal(el, val) {
    $(el).val(val);
  },
  checked(el) {
    return $(el).prop('checked')
  },
  setChecked(el, val) {
    $(el).prop('checked', val)
  },
  class(el, cls) {
    return dom.prop(el, 'class')
  },
  setClass(el, cls) {
    dom.prop(el, 'class', cls)
  },
  addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls)
    } else {
      var cur = ' ' + (dom.prop(el, 'class') || '') + ' '
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        dom.setClass(el, _.trim(cur + cls))
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
      dom.setClass(el, _.trim(cur))
    }
  },
  focus(el) {
    el.focus();
  },
  outerHtml(el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div')
      container.appendChild(el.cloneNode(true))
      return container.innerHTML
    }
  }
}
module.exports = dom;

