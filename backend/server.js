import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {GraphQLSchema, GraphQLObjectType} from  'graphql';
import {GetFieldConfigMap} from './route.js'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: GetFieldConfigMap(),
  }),
});

const server = () => {
  // Create an express server and a GraphQL endpoint
  var server = express();
  server.use('/graphql', graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true
  }));
  server.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
};

server();