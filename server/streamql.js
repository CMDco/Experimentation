var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');
var bodyparser = require('body-parser');
var parseBody = require('./parseBody');
var url = require('url');

var {registerResolver, getRoot, registerType} = require('../lib/librarytobenamed');


class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

var fakeDatabase = {};

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }
  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
};
let fakeid = 0;

// ============================================================================= Types
registerType(Message, 'id', 'author');
registerType(RandomDie);
// ============================================================================= RESOLVERS
  function quoteOfTheDay(){
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  }
  function random(){
    return Math.random();
  }
  function rollThreeDice(){
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  }
  function rollDice(args){
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  }
  function getDie({numSides}) {
    return new RandomDie(numSides || 6);
  }
  function setMessage({message}){
    fakeDatabase.message = message;
    console.log(fakeDatabase);
    return message;
  }
  function getMessage(){
    console.log(fakeDatabase);
    return fakeDatabase.message;
  }
  function createMessage({input}){
    console.log("!!!!!!!!!!!!!!!!!!!!");
    console.log(input);
    fakeDatabase[fakeid] = new Message(fakeid, input);
    fakeid++;
    return fakeDatabase[fakeid-1];
  }
  function updateMessage(id, {input}){
    // console.log("~~~~~~~~~~~~~~~~~~~~~~");
    // console.log(fakeDatabase[id]);
    // console.log("~~~~~~~~");
    // console.log(input);
    fakeDatabase[id].content = input.content;
    fakeDatabase[id].author = input.author;
    return fakeDatabase[id];
  }
registerResolver(quoteOfTheDay, random, rollThreeDice, rollDice, getDie, setMessage, getMessage, createMessage, updateMessage);
let root = getRoot();

var schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }
  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);



{
  user(uid: 500){
    id,
    friends
  }
}

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');


/*function getGraphQLParams(request) {
  return parseBody(request).then(bodyData => {
    const urlData = request.url && url.parse(request.url, true).query || {};
    return parseGraphQLParams(urlData, bodyData);
  });
}


//Helper function to get the GraphQL params from the request.

function parseGraphQLParams(
  urlData,
  bodyData
){
  // GraphQL Query string.
  let query = urlData.query || bodyData.query;
  if (typeof query !== 'string') {
    query = null;
  }

  // Parse the variables if needed.
  let variables = urlData.variables || bodyData.variables;
  if (typeof variables === 'string') {
    try {
      variables = JSON.parse(variables);
    } catch (error) {
      throw httpError(400, 'Variables are invalid JSON.');
    }
  } else if (typeof variables !== 'object') {
    variables = null;
  }

  // Name of GraphQL operation to execute.
  let operationName = urlData.operationName || bodyData.operationName;
  if (typeof operationName !== 'string') {
    operationName = null;
  }

  const raw = urlData.raw !== undefined || bodyData.raw !== undefined;

  return { query, variables, operationName, raw };
}
*/