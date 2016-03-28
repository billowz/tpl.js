const _ = require('../util'),
  W3C = window.dispatchEvent;

let dom = {
  W3C: W3C,
  inDoc(el, root) {
    root = root || document.documentElement;
    if (root.contains)
      return root.contains(el);

    try {
      while ((el = el.parentNode)) {
        if (el === root)
          return true
        return false
      }
    } catch (e) {
      return false;
    }
  },
  query(selectors, all) {
    if (typeof selectors == 'string')
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
    return selectors;
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
  html(el, html) {
    if (arguments.length > 1)
      return (el.innerHTML = html);
    return el.innerHTML;
  },
  text(el, text) {
    if (el.nodeType == 3) {
      if (arguments.length > 1)
        return (el.data = text);
      return el.data;
    } else {
      return dom.html.apply(this, arguments)
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


//====================== Query =============================
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE');

    head.appendChild(styleTag);
    doc.__qsaels = [];
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
    } else { // others
      let textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
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
