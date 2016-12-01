var express = require('express');
var graphqlHTTP = require('express-graphql');
var { GraphQLSchema, TypeInfo, buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');
var bodyparser = require('body-parser');
var parseBody = require('./parseBody');
var url = require('url');

// var {wrapResolver, getRoot} = require('../lib/librarytobenamed');


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
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  rollDice: function (args) {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
  },
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  },
  setMessage: function ({message}) {
    fakeDatabase.message = message;
    console.log(fakeDatabase);
    return message;
  },
  getMessage: function () {
    console.log(fakeDatabase);
    return fakeDatabase.message;
  },
  createMessage: function({input}){
    console.log(input);
    fakeDatabase[fakeid++] = input;
    return new Message(fakeid-1, input);
  }
};

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


// let tinfo = new TypeInfo(new GraphQLSchema('{\nrollThreeDice\n}'));
// console.log(tinfo);
// console.log('====');
// console.log(Object.keys(tinfo));
// console.log();
// console.log(tinfo.getDirective());





var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// function rawBody(req,res,next){
//   req.rawBody = '';
//   req.on('data', function(chunk){
//     req.rawBody += chunk;
//   });
//   req.on('end', function(){
//     console.log(req.rawBody);
//     next();
//   });
// }

// app.use(rawBody);

/*app.use((req,res,next) => {
  console.log(` ${req.ip} ==========================================`);
  console.log(req.url);
  getGraphQLParams(req).then(dat => {
    console.log(dat);
  });
//   const source = new Source(req.rawBody); // source creates a stupid object with body and name
//   const documentAST = parse(`{
//   getDie(numSides: 5) {
//     numSides
//     rollOnce
//   }
// }`);
//   console.log(documentAST);
  next();
});
*/













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