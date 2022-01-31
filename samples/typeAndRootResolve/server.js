import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {graphql, buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean} from  'graphql';

var students = {
  'student1': {
    id: 'student1',
    name: 'karthik',
    courses: ['math101', 'geography201']
  },
  'student2': {
    id: 'student2',
    name: 'john',
    courses: ['physics201', 'chemistry103']
  },
};

var courses = {
  'math101': {
    id: 'math101',
    title: 'Intro to algebra',
  },
  'geography201': {
    id: 'geography201',
    title: 'Intro to maps',
  },
  'physics201': {
    id: 'physics201',
    title: 'Intro to physics',
  },
  'chemistry103': {
    id: 'chemistry103',
    title: 'Intro to organic chemistry',
  },
};

const Course = new GraphQLObjectType({
    name: 'Course',
    fields:  {
      id: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      }
  }
});

const Student = new GraphQLObjectType({
  name: 'Student',
  fields:  {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    courses: {
      type: new GraphQLList(Course),
      args: {first: {type: GraphQLInt}},
      resolve: (root, args, context, info) => {
        console.log("type resolve - BEGIN");
        console.log(JSON.stringify(root))
        console.log(JSON.stringify(args))
        let temp = root.courses.slice(0, args.first);
        let retVal = [];
        for (let idx in temp) {
          retVal.push(courses[temp[idx]]);
        }
        console.log("type resolve - END");
        return retVal;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      student: {
        type: Student,
        args: {id: {type: GraphQLString}},
        resolve: (root, args, context, info) => { 
          console.log("root resolve - BEGIN");
          console.log("root: " + JSON.stringify(root));
          console.log("args: " + JSON.stringify(args));
          // console.log("context: " + JSON.stringify(context));
          // console.log("info: " + JSON.stringify(info));
          console.log("root resolve - END");
          return students[args.id]
        }
      },
      students: {
        type: new GraphQLList(Student),
        resolve: (root, args, context, info) => { 
          console.log("root resolve - BEGIN");
          console.log("root: " + JSON.stringify(root));
          console.log("args: " + JSON.stringify(args));
          // console.log("context: " + JSON.stringify(context));
          // console.log("info: " + JSON.stringify(info));
          console.log("root resolve - END");
          return [students.student1, students.student2]
        }
      }
    }
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