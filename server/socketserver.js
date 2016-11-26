var graphqlHTTP = require('express-graphql');
var { buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');

var express = require('express');
var bodyparser = require('body-parser');
var parseBody = require('./parseBody');
var url = require('url');

var {registerResolver, getRoot, registerType} = require('../lib/librarytobenamed');


app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});