import 'dotenv/config';
import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {GraphQLSchema, GraphQLObjectType} from  'graphql';
import {GetFieldConfigMap} from './route.js'
import cors from 'cors';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: GetFieldConfigMap(),
  }),
});

const server = () => {
  // Create an express server and a GraphQL endpoint
  var server = express();
  server.use(cors());
  server.options('*', cors());
  server.use('/graphql', graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true
  }));
  server.listen(process.env.PORT, () => console.log(`Express GraphQL Server Now Running On localhost:${process.env.PORT}/graphql`));
};

server();