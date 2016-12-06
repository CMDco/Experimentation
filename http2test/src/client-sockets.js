var socket; 
var socketid;

function subscribe(uri, query, variables = null, callback) { 
  if (!socket) {
    socket = io('http://localhost:4000');
    socket.on('init', ({id}) => {
      socketid = id;
      console.log(id);
      socket.on(socketid, (data) => { callback(data) });
      socket.emit(socketid, { query });
    });
  }
  /*
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open("GET", uri, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(JSON.stringify({
    query: query,
    variables: variables
  }));
  return xhr.responseText;
  */
}

function unsubscribe() { 
  socket.emit('unsubscribe', { socketid });
}

subscribe(null, '{ getMessage(id: 0) { content} }', null, function (data) {
  console.log(data);
});