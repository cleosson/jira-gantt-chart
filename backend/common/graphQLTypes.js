import {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean} from  'graphql';

const Status = new GraphQLObjectType({
    name: 'Status',
    fields:  {
      status: {type: GraphQLBoolean},
      msg: {type: GraphQLString},
      id: {type: GraphQLInt}
  }
});

export {Status};