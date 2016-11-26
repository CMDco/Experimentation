function aggregate(...args){
  let root = {};
  args.forEach( fn => {
    root[fn.name] = function (...args){
      console.log("arguments");
      console.log(args);
      console.log("before");
      let ret = fn(...args);
      console.log(`after ${ret}`);
      return ret;
    }
  });
  return root;
}

function func1(){
  console.log("this is in func1");
  return null;
}
function func2(){
  console.log("func2");
  return "something";
}

let root = aggregate(func1, func2, () => {"haha"});

root.func1("func1 arg1" , "something else htats  coaosfinasof");
console.log();
root.func2();
