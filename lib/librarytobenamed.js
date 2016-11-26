console.log("imported");

const db = {};

const root = {};

function registerResolver(...rootFn){
  if(!rootFn){
    throw new Error("registerResolver :: registerResolver must take at least one resolver function.")
  }
  rootFn.forEach( (fn) => {
    if(fn.name.length <= 0){
      throw new Error("registerResolver :: registerResolver can not take anonymous functions as arguments");
    }
    root[fn.name] = wrapResolver(fn);
  } );
}

function getRoot(){
  return root;
}

function wrapResolver(fn){
  return function (...args){
    console.log(`wrapResolver for ${fn.name}  Before`);
    let ret = fn(...args);
    console.log(`wrapResolver for ${fn.name}  After`);
    return ret; 
  }
}

module.exports = {
  registerResolver,
  getRoot,
};