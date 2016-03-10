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
const functionReg = /__\$[\d]+__\.data\(./g


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
var currentVars;
var currentVarNR;
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

  let _var = `binding.get2('${raw}')`, varNR;
  if (!(varNR = currentVars[_var])) {
    varNR = currentVars[_var] = currentVarNR++;
  }
  return `${c}__$${varNR}__.data`;
}

function functionProcessor(raw) {
  let c = raw.charAt(raw.length - 1);
  c = c == ')' ? c : ',' + c;
  raw = raw.slice(0, raw.indexOf('.'));
  raw = `${raw}.data.call(${raw}.scope${c}`;
  return raw;
}

function compileExecuter(exp, args) {
  if (improperKeywordsReg.test(exp)) {
    throw Error(`Invalid expression. Generated function body: ${exp}`);
  }
  currentArgs = args;
  currentVars = {};
  currentVarNR = 0;

  let body = exp.replace(translationReg, translationProcessor).replace(wsReg, '');
  body = (' ' + body).replace(identityReg, identityProcessor)
    .replace(functionReg, functionProcessor)
    .replace(translationRestoreReg, translationRestoreProcessor);

  let vars = [];
  _.each(currentVars, (nr, exp) => {
    vars.push(`  var __$${nr}__ = ${exp};\n`);
  })

  translations.length = 0;
  currentArgs = undefined;
  currentVars = undefined;

  body = `${vars.join('')}  return ${body};`

  let _args = ['binding'];
  if (args)
    _args.push.apply(_args, args);
  _args.push(body);
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

export function parse(exp, args) {
  exp = exp.trim();
  let res = {
    exp: exp
  }
  if (isSimplePath(exp)) {
    res.simplePath = true;
    res.identities = [exp];
    res.execute = function(binding) {
      return binding.get(exp);
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
