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
const identityReg = /[^\w$\.:][A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*/g
const booleanLiteralReg = /^(?:true|false)$/
const varReg = /^[A-Za-z_$][\w$]*/

var translations = [];
function translationProcessor(str, isString) {
  var i = translations.length
  translations[i] = isString ? str.replace(newlineReg, '\\n') : str
  return `"${i}"`;
}

function translationRestoreProcessor(str, i) {
  return translations[i]
}

var identities;
var currentArgs;

function identityProcessor(raw) {
  var c = raw.charAt(0);
  raw = raw.slice(1);

  if (allowedKeywordsReg.test(raw)) {
    return raw;
  } else if (currentArgs) {
    let f = raw.match(varReg);
    if (f && currentArgs.indexOf(f) != -1) {
      return raw;
    }
  }
  raw = raw.replace(translationRestoreReg, translationRestoreProcessor);
  identities[raw] = 1;
  return `${c}_.get(this, '${raw}')`;
}

function compileExecuter(exp, args) {
  if (improperKeywordsReg.test(exp)) {
    throw Error(`Invalid expression. Generated function body: ${exp}`);
  }
  currentArgs = args;
  var body = exp.replace(translationReg, translationProcessor).replace(wsReg, '');
  body = (' ' + body).replace(identityReg, identityProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);
  translations.length = 0;
  currentArgs = undefined;
  return makeExecuter(body, args);
}

function makeExecuter(body, args) {
  body = `body: return ${body};`;
  if (!args)
    args = [body];
  else
    args = args.concat(body);
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

export function parse(exp, args) {
  exp = exp.trim();
  let res = {
    exp: exp
  }
  if (isSimplePath(exp)) {
    res.simplePath = true;
    res.identities = [exp];
    res.execute = function() {
      return _.get(this, exp);
    }
  } else {
    res.simplePath = false;
    identities = {};
    res.execute = compileExecuter(exp, args);
    res.identities = Object.keys(identities);
    identities = undefined;
  }
  return res
}
