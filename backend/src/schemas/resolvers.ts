import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { PubSub, withFilter } from "graphql-subscriptions";
import dotenv from "dotenv";
import { Messages, MessagesDocs, User, UserDocs } from "../models";
import { StatusEnum } from "../enum/status.enum";
import { Pagination } from "../interface";

dotenv.config({
  path: !!process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});
// loading .env file

const pubsub = new PubSub();
const JWT_SECRET: string = process.env.JWT_SECRET || "";

interface UserProps {
  username: string;
  password: string;
}

const resolvers = {
  Query: {
    async login(_: any, args: UserProps) {
      const { username, password } = args;

      try {
        const user = await User.findOne({ username });
        const valid = !!user && (await bcrypt.compare(password, user.password));
        if (valid) {
          return jsonwebtoken.sign(
            { user: { id: user.id, username: user.username } },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
        }

        return null;
      } catch (err) {
        return err;
      }
    },
    async getUser(_: any, args: any) {
      try {
        return await User.findById(args.id);
      } catch (err) {
        return err;
      }
    },
    async listUsers() {
      try {
        return await User.find();
      } catch (err) {
        return err;
      }
    },
    async getMessages(_: any, args: any) {
      const { sentBy, sentTo } = args;

      try {
        return await Messages.find({
          $or: [
            { sentBy, sentTo },
            { sentBy: sentTo, sentTo: sentBy },
          ],
        });
      } catch (err) {
        return err;
      }
    },
    async listMessages(_: any, args: any) {
      const { id } = args;

      try {
        return await Messages.find({ $or: [{ sentBy: id }, { sentTo: id }] });
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    async signup(_: any, args: UserProps) {
      const { username, password } = args;

      try {
        const user = await User.create({
          username,
          password: await bcrypt.hash(password, 10),
        });

        return jsonwebtoken.sign(
          { user: { id: user.id, username: user.username } },
          JWT_SECRET,
          { expiresIn: "1d" }
        );
      } catch (err) {
        return err;
      }
    },
    async sendMessage(_: any, args: any) {
      const { message, sentBy, sentTo } = args;

      try {
        const newMessage = await Messages.create({
          message,
          sentBy,
          sentTo,
          date: new Date(),
          status: StatusEnum.SEND,
        });

        const users = await User.find({ _id: { $in: [sentBy, sentTo] } });

        users.forEach((user) => {
          user.messages.push(newMessage);
        });

        pubsub.publish("NEW_MESSAGE", {
          newMessage: {
            message: newMessage,
          },
        });

        return newMessage;
      } catch (err) {
        return err;
      }
    },
    async readMessage(_: any, args: any) {
      const { sentBy, sentTo } = args;

      try {
        const updateMessages = await Messages.find({ sentBy, sentTo });

        if (updateMessages.length) {
          updateMessages.forEach((message) => {
            message.set({ status: StatusEnum.READ });
            message.save();
          });
          pubsub.publish("MESSAGE_READ", {
            redMessage: { messages: updateMessages, sentBy, sentTo },
          });

          return updateMessages;
        }

        return updateMessages;
      } catch (err) {
        return err;
      }
    },
    async cleanData() {
      await Messages.deleteMany();
      await User.deleteMany();

      return "Database clean";
    },
    async insertUsersMock() {
      const usersList = require("../mockData/USER_MOCK_DATA.json");
      await usersList.map(async (user: any) => {
        return await User.create({
          username: user.username,
          password: await bcrypt.hash(user.password, 10),
        });
      });

      return (await User.find()).length > 0 ? "Users added" : "Error";
    },
    async insertMessagesMock() {
      const messagesList = require("../mockData/MESSAGES_MOCK_DATA.json");

      await messagesList.map(async (message: any) => {
        const users = await User.find();

        let randSend = Math.random() * users.length;
        randSend = Math.floor(randSend);
        const sendUserId = users[randSend].id;

        let randReceive = Math.random() * users.length;
        randReceive = Math.floor(randReceive);
        const receiveUserId = users[randSend].id;

        const newMessage = await Messages.create({
          message: message.message,
          sentBy: sendUserId,
          sentTo: receiveUserId,
          date: new Date(),
          status: StatusEnum.SEND,
        });

        const usersMessage = await User.find({
          _id: { $in: [sendUserId, receiveUserId] },
        });

        usersMessage.forEach((user) => {
          user.messages.push(newMessage);
        });
      });

      return (await Messages.find()).length > 0 ? "Users added" : "Error";
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_MESSAGE"]),
        (payload: any, variables: { sentTo: string }) =>
          payload.newMessage.message.sentTo === variables.sentTo
      ),
    },
    readMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_READ"]),
        (payload: any, variables: { sentTo: string }) =>
          payload.readMessage.sentTo === variables.sentTo
      ),
    },
  },
  User: {
    chat: async (parent: UserDocs, args: Pagination) => {
      const userIds: string[] = [];
      const messages = await Messages.find({
        $or: [{ sentBy: parent.id }, { sentTo: parent.id }],
      }).sort({ date: -1 });

      messages.forEach((message: MessagesDocs, idx: number) => {
        !userIds.includes(message.sentBy) &&
          message.sentBy !== parent.id &&
          userIds.push(message.sentBy);
        !userIds.includes(message.sentTo) &&
          message.sentTo !== parent.id &&
          userIds.push(message.sentTo);
      });

      const usersList = await User.find({ _id: { $in: userIds } })
        .limit(args.limit)
        .skip(args.limit * args.offset);
      console.log(
        "🚀 ~ file: resolvers.ts:239 ~ chat: ~ usersList:",
        usersList
      );

      const total = (await User.find({ _id: { $in: userIds } })).length;

      return { chat: usersList, total };
    },
  },
  Chat: {
    messages: async (parent: UserDocs, args: Pagination) =>
      await Messages.find({
        $or: [{ sentBy: parent.id }, { sentTo: parent.id }],
      }),
    // .limit(args.limit)
    // .skip(args.limit * args.offset),
  },
  Message: {
    sentBy: async (parent: MessagesDocs) => await User.findById(parent.sentBy),
    sentTo: async (parent: MessagesDocs) => await User.findById(parent.sentTo),
  },
};

export default resolvers;
