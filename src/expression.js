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
const translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g
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

function compileExecuter(exp, keywords) {

  let body = exp.replace(translationReg, translationProcessor).replace(wsReg, ''),
    identities;

  currentIdentities = {};
  currentKeywords = {};
  prevPropScope = undefined;
  if (keywords) {
    for (let i = 0, l = keywords.length; i < l; i++)
      currentKeywords[keywords[i]] = true;
  }

  body = (body + ' ').replace(identityReg, identityProcessor)

  body = body.replace(translationRestoreReg, translationRestoreProcessor);

  identities = _.keys(currentIdentities);

  translations.length = 0;
  currentKeywords = undefined;
  currentIdentities = undefined;

  return {
    fn: makeExecuter(body, keywords),
    identities: identities
  }
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

export function isSimplePath(exp) {
  return pathTestReg.test(exp) &&
    !booleanLiteralReg.test(exp)
}

let cache = {};

export function parse(exp, args) {
  exp = _.trim(exp);
  let res;
  if( (res = cache[exp]) ) {
    return res;
  }
  res = {
    exp: exp
  }
  if (isSimplePath(exp)) {
    res.execute = makeExecuter(`$scope.${exp}`, args);
    res.identities = [exp];
    res.simplePath = true;
    res.path = _.parseExpr(exp);
  } else {
    let exe = compileExecuter(exp, args);

    res.simplePath = false;
    res.execute = exe.fn;
    res.identities = exe.identities;
  }
  cache[exp] = res;
  return res
}
