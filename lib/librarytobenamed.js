const db = {};

const mroot = {};
const otypes = {};


function registerResolver(...rootFn){
  if(!rootFn){
    throw new Error("registerResolver :: registerResolver must take at least one resolver function.")
  }
  rootFn.forEach( (fn) => {
    if(fn.name.length <= 0){
      throw new Error("registerResolver :: registerResolver can not take anonymous functions as arguments");
    }
    mroot[fn.name] = wrapResolver(fn);
  } );
}

function getRoot(){
  return mroot;
}

function wrapResolver(fn){
  return function (...args){
    let ret = fn(...args);
    let uniqKeys = otypes[ret.constructor.name].keys;
    let uniqIdentifier = uniqKeys.reduce( (acc, curr) => {
      return acc + curr + ret[curr];
    }, "");
    // db[uniqIdentifier] = ret;
    return ret; 
  }
}

function registerType(classFn, ...uniqKeys){
  if(typeof classFn !== 'function'){
    throw new Error("registerType :: registerType must take in a constructor function as first argument");
  }
  if(!uniqKeys){
    throw new Error("registerType :: registerType did not recieve any keys as arguments");
  }
  otypes[classFn.name] = {
    name: classFn.name,
    classType: classFn,
    keys: uniqKeys,
  };
}

module.exports = {
  registerResolver,
  getRoot,
  registerType,
};