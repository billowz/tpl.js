const _ = require('./util');
const defaultKeywords = {
  'Math': true,
  'Date': true,
  'this': true,
  'true': true,
  'false': true,
  'null': true,
  'undefined': true,
  'Infinity': true,
  'NaN': true,
  'isNaN': true,
  'isFinite': true,
  'decodeURI': true,
  'decodeURIComponent': true,
  'encodeURI': true,
  'encodeURIComponent': true,
  'parseInt': true,
  'parseFloat': true,
  '$scope': true
};

const wsReg = /\s/g
const newlineReg = /\n/g
const translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g
const translationRestoreReg = /"(\d+)"/g
const pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const booleanLiteralReg = /^(?:true|false)$/
const identityReg = /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*[^\w$\.]/g
const propReg = /^[A-Za-z_$][\w$]*/;

let translations = [];
function translationProcessor(str, isString) {
  let i = translations.length
  translations[i] = isString ? str.replace(newlineReg, '\\n') : str
  return `"${i}"`;
}

function translationRestoreProcessor(str, i) {
  return translations[i]
}

let currentIdentities;
let currentKeywords;
let prevPropScope;
function identityProcessor(raw, idx, str) {
  let l = raw.length,
    suffix = raw.charAt(l - 1),
    exp = raw.slice(0, l - 1),
    prop = exp.match(propReg)[0];

  if (defaultKeywords[prop] || currentKeywords[prop])
    return raw;
  if (prop === '$context')
    return raw.replace(propReg, prevPropScope);
  if (suffix == '(') {
    suffix = (idx + l == str.length || str.charAt(idx + l) == ')') ? '' : ',';
    prevPropScope = `this.propScope('${prop}')`;
    return `$scope.${exp}.call(${prevPropScope}${suffix}`;
  }
  currentIdentities[exp] = true;
  return `$scope.${exp}${suffix}`;
}

function complileExpr(body) {
  prevPropScope = undefined;
  return (body + ' ').replace(identityReg, identityProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);
}

function compileFilterArgs(argExprs, keywords) {
  let i, l;

  for (i = 0, l = argExprs.length; i < l; i++) {
    argExprs[i] = makeExecuter(complileExpr(argExprs[i]), keywords);
    console.log(argExprs[i].toString())
  }
  return argExprs;
}

function compileFilter(filterExprs, keywords) {
  if (!filterExprs || !filterExprs.length)
    return [];

  let filters = [], filterExpr, i, l, name, argExprs;

  for (i = 0, l = filterExprs.length; i < l; i++) {
    if ( (filterExpr = _.trim(filterExprs[i])) ) {
      argExprs = filterExpr.replace(/,?\s+/g, ',').split(',');
      filters.push({
        name: argExprs.shift().replace(translationRestoreReg, translationRestoreProcessor),
        args: compileFilterArgs(argExprs, keywords)
      });
    }
  }
  return filters;
}

function compileExecuter(exp, keywords) {
  let filterExprs, ret,
    isSimple = isSimplePath(exp);

  currentIdentities = {};
  currentKeywords = {};
  if (keywords) {
    for (let i = 0, l = keywords.length; i < l; i++)
      currentKeywords[keywords[i]] = true;
  }

  if (!isSimple) {
    filterExprs = exp.replace(translationReg, translationProcessor).split('|');
    exp = filterExprs.shift().replace(wsReg, '');
    isSimple = isSimplePath(exp);
  }
  if (isSimple) {
    exp = exp.replace(translationRestoreReg, translationRestoreProcessor);
    currentIdentities[exp] = true;
    ret = {
      execute: makeExecuter(`$scope.${exp}`, keywords),
      path: _.parseExpr(exp)
    }
  } else {
    ret = {
      execute: makeExecuter(complileExpr(exp), keywords)
    }
  }
  ret.filters = compileFilter(filterExprs, keywords);
  ret.simplePath = isSimple;
  ret.identities = _.keys(currentIdentities);

  currentKeywords = undefined;
  currentIdentities = undefined;
  translations.length = 0;
  return ret;
}

function makeExecuter(body, args) {
  let _args = ['$scope'];
  args = args ? _args.concat(args) : _args;
  args.push(`return ${body};`);
  try {
    return Function.apply(Function, args);
  } catch (e) {
    throw Error(`Invalid expression. Generated function body: ${body}`);
  }
}

function isSimplePath(exp) {
  return pathTestReg.test(exp) &&
    !booleanLiteralReg.test(exp)
}

let cache = {};

export function parse(exp, args) {
  exp = _.trim(exp);
  let res;
  if( (res = cache[exp]) )
    return res;
  cache[exp] = res = compileExecuter(exp, args);
  console.log(res)
  return res
}
