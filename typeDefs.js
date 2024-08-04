const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    lastName: String!
    firstName: String!
    password: String!
    email: String!
  }
  input UserInput {
    lastName: String!
    firstName: String!
    password: String!
    email: String!
  }
  input LogInType {
    email: String!
    password: String!
  }
  scalar Date
  type Token {
    token: String!
  }
  type Message {
    id: ID!
    text: String!
    receiverId: Int!
    senderId: Int!
    createdAt: Date!
  }
  input InputMsg {
    receiverId: Int!
    text: String!
  }
  type Query {
    users: [User]
    user(userId: ID): User
    messageByUser(receiverId: Int!): [Message]
  }
  type Mutation {
    signupUser(newUser: UserInput!): User
    signinUser(userLogIn: LogInType!): Token
    createMessage(msgInp: InputMsg): Message
  }
`;
module.exports = typeDefs;
