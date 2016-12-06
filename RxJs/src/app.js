import $ from 'jquery';
import Rx from 'rxjs/Rx';

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