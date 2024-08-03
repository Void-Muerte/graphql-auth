const {gql} = require('apollo-server');

const typeDefs = gql`
    type User{
        id:ID!
        lastName:String!
        firstName:String!
        password:String!
        email:String!
    }
    input UserInput{
        lastName:String!
        firstName:String!
        password:String!
        email:String!
    }
    type Query{
        users:[User],
        user(userId:ID):User
    }
    type Mutation{
        createUser(newUser:UserInput!):User
    }
`
module.exports = typeDefs;