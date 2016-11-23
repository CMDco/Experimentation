var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');
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

/*app.use((request, response) => {
    // Higher scoped variables are referred to at various stages in the
    // asynchronous state machine below.
    let schema;
    let context;
    let rootValue;
    let pretty;
    let graphiql;
    let formatErrorFn;
    let extensionsFn;
    let showGraphiQL;
    let query;
    let documentAST;
    let variables;
    let operationName;
    let validationRules;

    // Promises are used as a mechanism for capturing any thrown errors during
    // the asynchronous process below.

    // Resolve the Options to get OptionsData.
    return new Promise(resolve => {
      resolve(
        typeof options === 'function' ?
          options(request, response) :
          options
      );
    }).then(optionsData => {
      // Assert that optionsData is in fact an Object.
      if (!optionsData || typeof optionsData !== 'object') {
        throw new Error(
          'GraphQL middleware option function must return an options object ' +
          'or a promise which will be resolved to an options object.'
        );
      }

      // Assert that schema is required.
      if (!optionsData.schema) {
        throw new Error(
          'GraphQL middleware options must contain a schema.'
        );
      }

      // Collect information from the options data object.
      schema = optionsData.schema;
      context = optionsData.context || request;
      rootValue = optionsData.rootValue;
      pretty = optionsData.pretty;
      graphiql = optionsData.graphiql;
      formatErrorFn = optionsData.formatError;
      extensionsFn = optionsData.extensions;

      validationRules = specifiedRules;
      if (optionsData.validationRules) {
        validationRules = validationRules.concat(optionsData.validationRules);
      }

      // GraphQL HTTP only supports GET and POST methods.
      if (request.method !== 'GET' && request.method !== 'POST') {
        response.setHeader('Allow', 'GET, POST');
        throw httpError(405, 'GraphQL only supports GET and POST requests.');
      }

      // Parse the Request to get GraphQL request parameters.
      return getGraphQLParams(request);
    }).then(params => {
      // Get GraphQL params from the request and POST body data.
      query = params.query;
      variables = params.variables;
      operationName = params.operationName;
      showGraphiQL = graphiql && canDisplayGraphiQL(request, params);

      // If there is no query, but GraphiQL will be displayed, do not produce
      // a result, otherwise return a 400: Bad Request.
      if (!query) {
        if (showGraphiQL) {
          return null;
        }
        throw httpError(400, 'Must provide query string.');
      }

      // GraphQL source.
      const source = new Source(query, 'GraphQL request');

      // Parse source to AST, reporting any syntax error.
      try {
        documentAST = parse(source);
      } catch (syntaxError) {
        // Return 400: Bad Request if any syntax errors errors exist.
        response.statusCode = 400;
        return { errors: [ syntaxError ] };
      }

      // Validate AST, reporting any errors.
      const validationErrors = validate(schema, documentAST, validationRules);
      if (validationErrors.length > 0) {
        // Return 400: Bad Request if any validation errors exist.
        response.statusCode = 400;
        return { errors: validationErrors };
      }

      // Only query operations are allowed on GET requests.
      if (request.method === 'GET') {
        // Determine if this GET request will perform a non-query.
        const operationAST = getOperationAST(documentAST, operationName);
        if (operationAST && operationAST.operation !== 'query') {
          // If GraphiQL can be shown, do not perform this query, but
          // provide it to GraphiQL so that the requester may perform it
          // themselves if desired.
          if (showGraphiQL) {
            return null;
          }

          // Otherwise, report a 405: Method Not Allowed error.
          response.setHeader('Allow', 'POST');
          throw httpError(
            405,
            `Can only perform a ${operationAST.operation} operation ` +
            'from a POST request.'
          );
        }
      }
      // Perform the execution, reporting any errors creating the context.
      try {
        return execute(
          schema,
          documentAST,
          rootValue,
          context,
          variables,
          operationName
        );
      } catch (contextError) {
        // Return 400: Bad Request if any execution context errors exist.
        response.statusCode = 400;
        return { errors: [ contextError ] };
      }
    }).then(result => {
      // Collect and apply any metadata extensions if a function was provided.
      // http://facebook.github.io/graphql/#sec-Response-Format
      if (result && extensionsFn) {
        return Promise.resolve(extensionsFn({
          document: documentAST,
          variables,
          operationName,
          result
        })).then(extensions => {
          if (extensions && typeof extensions === 'object') {
            (result).extensions = extensions;
          }
          return result;
        });
      }
      return result;
    }).catch(error => {
      // If an error was caught, report the httpError status, or 500.
      response.statusCode = error.status || 500;
      return { errors: [ error ] };
    }).then(result => {
      // If no data was included in the result, that indicates a runtime query
      // error, indicate as such with a generic status code.
      // Note: Information about the error itself will still be contained in
      // the resulting JSON payload.
      // http://facebook.github.io/graphql/#sec-Data
      if (result && result.data === null) {
        response.statusCode = 500;
      }
      // Format any encountered errors.
      if (result && result.errors) {
        (result).errors = result.errors.map(formatErrorFn || formatError);
      }
      // If allowed to show GraphiQL, present it instead of JSON.
      if (showGraphiQL) {
        const payload = renderGraphiQL({
          query, variables,
          operationName, result
        });
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        sendResponse(response, payload);
      } else {
        // Otherwise, present JSON directly.
        const payload = JSON.stringify(result, null, pretty ? 2 : 0);
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        sendResponse(response, payload);
      }
    });
  }
);*/













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