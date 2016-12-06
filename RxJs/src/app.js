
import Rx from 'rxjs/Rx';


/** Job Queue Logic **/
let jobQueue = [];

function addJob(job){
  jobQueue.push(job);
}

function takeJob(){
  return jobQueue.splice(0,1)[0];
}

function getJobs(){
  return jobQueue;
}

/** Observable Logic **/
let watchdogs = {};
function setup(name, callback, errcallback, completecallback, interval){
  if(!watchdogs[name]){
    watchdogs[name] = new Rx.Observable.interval(interval);
    watchdogs[name].subscribe(callback, errcallback, completecallback);
  }
}

/** Application Logic **/
function handleJobs(intervalPeriod){
  if(jobQueue.length > 0){
    let currJob = takeJob();
    console.log(`intervalPeriod: ${intervalPeriod} ================`)
    console.log(`took Job(${jobQueue.length}: `);
    console.log(currJob.name);
  }
}

setup("test", handleJobs, (err) => console.log(err), () => console.log('complete'), 1000);

function Job(name, task){
  this.name = name;
  this.task = task;
}

let number = 0;
function fillQueue(){
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
  addJob(new Job(`${number} job`, `${number++} task`));
};

let intervalID = setInterval(() => {
  console.log(`SetInterval filling Queue`);
  fillQueue();
  console.log(`SetInterval ${jobQueue.length} ==  ${jobQueue}`);
  if(number > 5){
    console.log(`clearing Interval=====================`);
    clearInterval(intervalID);
  }
}, 100);

setTimeout(() => {
  console.log(`setTimeout filling Queue`);
  fillQueue();
}, 10000)
























//================================================================================
// const source$ = Rx.Observable.interval(100)
  // .take(5);

// source$.subscribe(x=>{console.log(x)},
// (err)=>console.log(err), () => console.log('complete'));

// const source$ = Rx.Observable.range(25, 100);

// source$.subscribe(x=>{console.log(x)},
// (err)=>console.log(err), () => console.log('complete'));


/*const source$ = Rx.Observable.interval(1000)
  .take(10)
  .map(value => value * value);

source$.subscribe(value => {
  console.log(value);
});*/

// const source$ = Rx.Observable.from(['John', 'Tom', 'Sean'])
//   .map(v => {
//     return v.toUpperCase();
//   })
//   .map(v => `I am ${v}`);

// source$.subscribe(v => {
//   console.log(v);
// });

// function getUser(username){
//   return $.ajax({
//     url: 'https://api.github.com/users/' + username,
//     dataType: 'jsonp'
//   }).promise()
// }

// let inputSource = $('#input');
// const inputSource$ = Rx.Observable.fromPromise(getUser('Martin-Ting'))
//   .map(user => user.data)
//   .subscribe(v => console.log(v));

//================================================================================

/*
// From Promise
const myPromise = new Promise((resolve, reject) => {
  console.log('Creating Promise');
  setTimeout(() => {
    resolve('Hello from promise');
  }, 3000);
});*/

/*myPromise.then(x => {
  console.log(x);
});

const source$ = Rx.Observable.fromPromise(myPromise);
source$.subscribe(x=>{console.log(x)});*/
/*
function getUser(username){
  return $.ajax({
    url: 'https://api.github.com/users/' + username,
    dataType: 'jsonp'
  }).promise()
}

let inputSource = $('#input');
const inputSource$ = Rx.Observable.fromEvent(inputSource, 'keyup')
  .subscribe((e) => {
    Rx.Observable.fromPromise(getUser(e.target.value))
      .subscribe((dat) => {
        console.log(dat);
        $('#name').text(dat.data.name);
        $('#blog').text(dat.data.location);
        $('#repos').text(dat.data.repos_url);
        
      }, (err) => {console.log(err)}, () => console.log('complete'));
  }, (err) => console.log(err), () => console.log('complete'));
*/

//================================================================================

// From scratch
const observableEvents = false;
const collectionEvents = false;
const scratch = true;


/*const source$ = new Rx.Observable(observer => {
  console.log('creating Observable');

  observer.next('Hello World');
  observer.next('Another Value');
  observer.error(new Error('something went wrong'));
  setTimeout(() => {
    observer.next('yet another');
    observer.complete();
  }, 5000);
});

source$
  .catch(err => Rx.Observable.of(err))
  .subscribe(x=>{
    console.log(x);
}, err => console.log(err), () => console.log('completed'));*/


































if(observableEvents){
  console.log('RxJS Boiler Running...');

  const btn = $('#btn');
  const input = $('#input');
  const output = $('#output');
  const btnStream$ = Rx.Observable.fromEvent(btn, 'click');


  let printVal = 0;
  btnStream$.subscribe(function(e){
    console.log(e.target.innerHTML + (printVal++));
  }, 
  function(err){
    console.log(err);
  }, 
  function(){
    console.log('complete');
  });

  const inputStream$ = Rx.Observable.fromEvent(input, 'keyup');

  inputStream$.subscribe(function(e){
    console.log(e.target.value + (printVal++));
    output.append(e.target.value);
  }, 
  function(err){
    console.log(err);
  }, 
  function(){
    console.log('complete');
  });

  const moveStream$ = Rx.Observable.fromEvent(document, 'mousemove');
  moveStream$.subscribe(function(e){
    console.log(`X: ${e.clientX} + Y: ${e.clientY}`);
    output.html(`<h1>X: ${e.clientX} + Y: ${e.clientY}</h1>`)
  }, (err) => console.log(err), ()=> console.log('completed'));

  let numbers = [];
  if(collectionEvents){
    numbers = [33,44,55,66,77];
    const numbers$ = Rx.Observable.from(numbers);

    numbers$.subscribe(v => {
      console.log(v);
    }, err => console.log(err), () => console.log('completed'));

  }
  document.posts = [
    {title: 'Post 1', body: 'This is a 1'},
    {title: 'Post 2', body: 'This is a 2'},
  {title: 'Post 3', body: 'This is a 3'},
  {title: 'Post 4', body: 'This is a 4'},
  {title: 'Post 5', body: 'This is a 5'}
  ];

  const posts$ = Rx.Observable.from(document.posts);
    posts$.subscribe(post => {
      console.log(post);
      $('#posts').append(`<li><h3>${post.title}</h3><p>${post.body}</p></li>`);
      
    }, err => console.log(err), () => console.log('completed'));


  let set = new Set(['Hello', 44, {title: 'MyTitle'}]);

    const set$ = Rx.Observable.from(set);
    set$.subscribe(e => {
      console.log(e);
      
    }, err => console.log(err), () => console.log('completed'));
}

