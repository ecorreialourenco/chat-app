import { PubSub, withFilter } from "graphql-subscriptions";
import models from "../../models";
import { AuthUser, MessageProps, ReadMessageProps } from "../../interfaces";
import { Op } from "sequelize";

const { GroupUsers, Messages, MessageUsers, Users } = models;
const pubsub = new PubSub();

const resolvers = {
  Mutation: {
    async handleMessage(
      _: any,
      { message: { id, message, groupId } }: MessageProps,
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user && id) {
          await Messages.update(
            {
              message,
            },
            { where: id }
          );

          return await Messages.findById(id);
        } else if (user) {
          const newMessage = await Messages.create({
            message,
            groupId,
            userId: user.id,
          });

          const members = await GroupUsers.findAll({
            where: { id: groupId },
          });

          for (const member of members) {
            await MessageUsers.create({
              messageId: newMessage.id,
              userId: member.id,
              hasRead: member.userId === user.id,
            });
          }

          pubsub.publish("NEW_MESSAGE", {
            newMessage: {
              message: newMessage,
            },
          });

          return newMessage;
        }
        return "Message failed, try again later";
      } catch (err) {
        return err;
      }
    },
    async readMessage(
      _: any,
      { read: { messageIds } }: ReadMessageProps,
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user) {
          await MessageUsers.update(
            { status: 2 },
            { where: { id: { [Op.in]: messageIds } } }
          );

          return "Message status updated!";
        }

        return "Error on trying update message status";
      } catch (err) {
        return err;
      }
    },
    async removeMessage(
      _: any,
      { id }: { id: number },
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user) {
          const message = await Messages.findById(id);

          if (user.id === message.id) {
            await MessageUsers.destroy({ where: { messageId: id } });
            await Messages.destroy({ id });

            return "Message deleted!";
          }
        }

        return "Error on delete message, try again later";
      } catch (err) {
        return err;
      }
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
    /* TODO: Not in use yet */
    readMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["MESSAGE_READ"]),
        (payload: any, variables: { sentTo: string }) =>
          payload.readMessage.sentTo === variables.sentTo
      ),
    },
  },
  Message: {
    user: async (parent: any) =>
      await Users.findOne({ where: { id: parent.userId } }),
  },
};

export default resolvers;
