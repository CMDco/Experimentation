var { buildSchema, Source, parse, validate, execute, GraphQLSchema, ExecutionResult } = require('graphql');
const schemaString = `
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
`;

const schema = buildSchema(schemaString);

let schemaSource = new Source(schemaString);
let parseOutput = parse(schemaSource);

// console.log(JSON.stringify(parseOutput, null, 2));
console.log(Object.keys(parseOutput));
console.log(Object.keys(parseOutput.definitions));
// console.log(JSON.stringify(parseOutput.definitions[3], null, 2));
Object.keys(parseOutput.definitions).forEach( (definition) => {
  console.log(Object.keys(parseOutput.definitions[definition]));
  if(parseOutput.definitions[definition].name.value === "Query"){
    console.log(`query ${definition}`);
  }else if(parseOutput.definitions[definition].name.value === "Mutation"){
    console.log(Object.keys(parseOutput.definitions[definition]));
    console.log(`mutation ${definition}`);
    console.log(`=============================================`);
    // console.log(parseOutput.definitions[definition].fields[0]);
    console.log(`======================================`);
    console.log(parseOutput.definitions[definition].fields[0].type.name.value);
    console.log(parseOutput.definitions[definition].fields[1].type.name.value);
  }
});