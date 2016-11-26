console.log('Using librarytobenamed version 0.0.0.0.0.0.0.1');
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
    console.log(`[${fn.name}] :: wrapResolver for ${fn.name}  Before`);
    let ret = fn(...args);
    console.log(`[${fn.name}] :: wrapResolver for ${fn.name}  After`);
    console.log(`[${fn.name}] :: return value is type of ${typeof ret}`);
    console.log(`[${fn.name}] :: return value has constructor ${ret.constructor.name}`);
    console.log(otypes[ret.constructor.name]);
    let uniqKeys = otypes[ret.constructor.name].keys;
    let uniqIdentifier = uniqKeys.reduce( (acc, curr) => {
      console.log("building identifier " + acc);
      return acc + curr + ret[curr];
    }, "");
    console.log(`[${fn.name}] :: keys ${uniqKeys}`)
    console.log(`[${fn.name}] :: identifier ${uniqIdentifier}`);
    if(db.hasOwnProperty(uniqIdentifier)){
      console.log("WE MUTATED SOMETHING WE SEEN BEFORE BOIS!!!!!");
    }
    db[uniqIdentifier] = ret;
    console.log(`DB:    ${db}`);
    console.log(db);
    console.log('======================================================');
    return ret; 
  }
}

function registerType(classFn, ...uniqKeys){
  if(typeof classFn !== 'function'){
    // is there a better way of determining if this is a class? check for constructor function somehow?
    throw new Error("registerType :: registerType must take in a class as first argument");
  }
  if(!uniqKeys){
    //should it be required for uniqKeys to be passed in?
    console.log("registerType :: registerType did not recieve any keys as arguments");
    //what should we do if no keys were passed?
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