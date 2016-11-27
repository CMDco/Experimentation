var graphqlHTTP = require('express-graphql');
var { buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyparser = require('body-parser');
var parseBody = require('./parseBody');
var url = require('url');
var {setup} = require('../lib/serversockets.js');
var {registerResolver, getRoot, registerType} = require('../lib/librarytobenamed');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
setup(server);
app.get('/', (req, res) => { 
  res.sendFile(__dirname + '/index.html')
})
app.get('/clientlibrary.js', (req, res) => { 
  res.sendFile(__dirname + '/clientlibrary.js')
})
server.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});