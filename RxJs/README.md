Reactive PRogramming
  Programming paradigm that works with async data streams
  Streams can be created from many things

What are streams?
- sequence of ongoing events ordered over time.
- Emits a value, error, and complete signal
  -> some streams don't complete

Observable
- USed to watch these streams and emit functions when a  value, error, or complete signal is returned
- OBservables can be subscribed to by an observer
  -> No limit to how many subscriptions an observer can have
- Observables constantly watch streams and will update accordingly
- We can interact with data streams as any regular array.
  -> lots of array methods to work with obsersables

ReactiveX
- library for composing async programs using Observables

Overview
- Examining data streams from events
- creating observa les from array like objects
- "" from scratch
- filter transform Observables
- promises to Observables
- helpful operators
- Error handling

