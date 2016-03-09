const _ = require('lodash');

const allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
  'encodeURIComponent,parseInt,parseFloat';
const allowedKeywordsReg = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// keywords that don't make sense inside expressions
const improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' +
  'delete,do,else,export,extends,finally,for,function,if,' +
  'import,in,instanceof,let,return,super,switch,throw,try,' +
  'var,while,with,yield,enum,await,implements,package,' +
  'proctected,static,interface,private,public';
const improperKeywordsReg = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

const wsReg = /\s/g
const newlineReg = /\n/g
const translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g
const translationRestoreReg = /"(\d+)"/g
const pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
const identityReg = /[^\w$\.][A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*/g
const booleanLiteralReg = /^(?:true|false)$/


var translations = [];
function translationProcessor(str, isString) {
  var i = translations.length
  translations[i] = isString
    ? str.replace(newlineReg, '\\n')
    : str
  return '"' + i + '"'
}

function translationRestoreProcessor(str, i) {
  return translations[i]
}

var identities;
function identityProcessor(raw) {
  var c = raw.charAt(0);
  raw = raw.slice(1);
  console.log(raw, c)
  if (allowedKeywordsReg.test(raw) || c == '{') {
    return raw
  } else {
    if (raw.indexOf('"') > -1)
      raw = raw.replace(translationRestoreReg, translationRestoreProcessor);
    identities[raw] = 1;
    return `${c}_.get(scope, '${raw}')`;
  }
}

function compileGetter(exp) {
  if (improperKeywordsReg.test(exp)) {
    throw Error(`Invalid expression. Generated function body: ${exp}`);
  }
  var body = exp.replace(translationReg, translationProcessor)
    .replace(wsReg, '')
    .replace(identityReg, identityProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);
  translations.length = 0;
  return makeGetter(body);
}

function makeGetter(body) {
  console.log(`body: return ${body};`)
  try {
    return new Function('scope', `body: return ${body};`);
  } catch (e) {
    throw Error(`Invalid expression. Generated function body: ${body}`);
  }
}

export function isSimplePath(exp) {
  return pathTestReg.test(exp) &&
    !booleanLiteralReg.test(exp)
}

export function parse(exp) {
  exp = exp.trim();
  var res = {
    exp: exp
  }
  if (isSimplePath(exp)) {
    res.identities = [exp];
    res.get = function(scope) {
      return _.get(scope, exp);
    }
  } else {
    identities = {};
    res.get = compileGetter(exp);
    res.identities = Object.keys(identities);
    identities = undefined;
  }
  return res
}
