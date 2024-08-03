const {ApolloServer} = require("apollo-server");
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');




const server = new ApolloServer({typeDefs, resolvers});
server.listen(3002, ()=>console.log(`Server listening on Port:${3002}`));