const _ = require('./util');

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


let translations = [];
function translationProcessor(str, isString) {
  let i = translations.length
  translations[i] = isString ? str.replace(newlineReg, '\\n') : str
  return `"${i}"`;
}

function translationRestoreProcessor(str, i) {
  return translations[i]
}

let identities;
let currentArgs;
function identityProcessor(raw) {
  let c = raw.charAt(0),
    exp = raw.slice(1);

  if (allowedKeywordsReg.test(exp)) {
    return raw;
  } else if (currentArgs) {
    let f = exp.match(varReg);
    if (f && f[0] && currentArgs.indexOf(f[0]) != -1) {
      return raw;
    }
  }
  exp = exp.replace(translationRestoreReg, translationRestoreProcessor);
  identities[exp] = 1
  return `${c}scope.${exp}`
}

function compileExecuter(exp, args) {
  if (improperKeywordsReg.test(exp)) {
    throw Error(`Invalid expression. Generated function body: ${exp}`);
  }
  currentArgs = args;

  let body = exp.replace(translationReg, translationProcessor).replace(wsReg, '');
  body = (' ' + body).replace(identityReg, identityProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);

  translations.length = 0;
  currentArgs = undefined;
  return makeExecuter(body, args);
}

function makeExecuter(body, args) {
  let _args = ['scope'];
  if (args)
    _args.push.apply(_args, args);
  _args.push(`return ${body};`);
  try {
    return Function.apply(Function, _args);
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
  exp = exp.trim();
  let res;
  if( (res = cache[exp]) ) {
    return res;
  }
  res = {
    exp: exp
  }
  if (isSimplePath(exp)) {
    res.simplePath = true;
    res.identities = [exp];
    res.execute = makeExecuter(`scope.${exp}`, args);
  } else {
    res.simplePath = false;
    identities = {};
    res.execute = compileExecuter(exp, args);
    res.identities = Object.keys(identities);
    identities = undefined;
  }
  cache[exp] = res;
  return res
}
