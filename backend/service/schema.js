import {GraphQLNonNull, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean} from  'graphql';

const Issue = new GraphQLObjectType({
    name: 'Issue',
    fields:  {
      id: {
        type: GraphQLInt
      },
      key: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      type: {
        type: GraphQLString
      },
      resolution: {
        type: GraphQLString
      },
      resolutionDate: {
        type: GraphQLString
      },
      status: {
        type: GraphQLString
      },
      closedSprints: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))
      }
  }
});

const Epic = new GraphQLObjectType({
    name: 'Epic',
    fields:  {
      id: {
        type: GraphQLInt
      },
      key: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      issues: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Issue)))
      }
  }
});

const Sprint = new GraphQLObjectType({
    name: 'Sprint',
    fields:  {
      id: {
        type: GraphQLInt
      },
      name: {
        type: GraphQLString
      },
      startDate: {
        type: GraphQLString
      },
      completeDate: {
        type: GraphQLString
      },
      state: {
        type: GraphQLString
      }
  }
});

const Chart = new GraphQLObjectType({
    name: 'Chart',
    fields:  {
      id: {
        type: GraphQLInt
      },
      epics: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Epic)))
      },
      sprints: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Sprint))),
      }
  }
});

export {Chart}