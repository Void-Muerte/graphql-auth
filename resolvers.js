const { PrismaClient } = require("@prisma/client");
const { AuthenticationError, ForbiddenError } = require("apollo-server");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

/**
 * @typedef newUserType
 * @property {any} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 */

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError("Unauthorized!");
      const users = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
          },
        },
      });
      return users;
    },
    user: (_, { id }) => {
      return null;
    },
    messageByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in!");
      if (userId == receiverId)
        throw new ForbiddenError("You can't chat with yourself!");
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: userId,
            },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    },
  },
  Mutation: {
    signupUser: async (_, { newUser }) => {
      // check if user exists
      const user = await prisma.user.findUnique({
        where: {
          email: newUser.email,
        },
      });
      if (user)
        throw new AuthenticationError(
          "user with same credentials already exist!"
        );
      // assuming that user doesn't exist
      // hash the password
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const createdUser = await prisma.user.create({
        data: {
          ...newUser,
          password: hashedPassword,
        },
      });
      return createdUser;
    },
    signinUser: async (_, { userLogIn }) => {
      // check if user exist
      const user = await prisma.user.findUnique({
        where: {
          email: userLogIn.email,
        },
      });
      if (!user) throw new AuthenticationError("Account not found!");
      // compare password
      const match = await bcrypt.compare(userLogIn.password, user.password);
      if (!match) throw new AuthenticationError("Email or password incorrect!");
      // create token using jsonwebtoken
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token };
    },
    // creating a message
    createMessage: async (_, { msgInp }, { userId }) => {
      if (!userId) throw new ForbiddenError("You must be logged in!");
      if (userId == msgInp.receiverId)
        throw new ForbiddenError("message can't be sent to oneself!");
      const message = await prisma.message.create({
        data: {
          ...msgInp,
          senderId: userId,
        },
      });
      return message;
    },
  },
};
module.exports = resolvers;
