import { PubSub, withFilter } from "graphql-subscriptions";
import models from "../../models";
import {
  AddGroupProps,
  AuthUser,
  GroupUsersProps,
  ListGroupsProps,
} from "../../interfaces";
import { Op } from "sequelize";
import { DEFAULT_OFFSET, MAX_LIMIT } from "../../contants";

const { Group, GroupUsers, Messages, Users } = models;
const pubsub = new PubSub();

const resolvers = {
  Query: {
    async getGroup(
      _: any,
      { id }: { id: number },
      context: { authUser: AuthUser }
    ) {
      try {
        const {
          authUser: { user },
        } = context;
        if (user) {
          return await Group.findOne({ where: { id } });
        }

        return null;
      } catch (err) {
        return err;
      }
    },
    async listGroups(
      _: any,
      { filters }: ListGroupsProps,
      context: { authUser: AuthUser }
    ) {
      try {
        const {
          authUser: { user },
        } = context;

        if (user) {
          const offset = filters.offset ?? DEFAULT_OFFSET;
          const limit = filters.limit ?? MAX_LIMIT;

          const userGrups = await GroupUsers.findAll({
            where: { userId: user.id },
          });
          const userGrupsIds = userGrups.map(
            (userGroup: any) => userGroup.groupId
          );

          const list = await Group.findAll({
            where: { id: { [Op.in]: userGrupsIds } },
            offset: limit * offset,
            limit,
          });

          const total = await Group.count({
            where: { id: { [Op.in]: userGrupsIds } },
          });

          return {
            group: list,
            total,
          };
        }

        return {
          group: [],
          total: 0,
        };
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    async addGroup(
      _: any,
      { addGroup }: AddGroupProps,
      context: { authUser: AuthUser }
    ) {
      const { name, users } = addGroup;
      const {
        authUser: { user },
      } = context;

      try {
        if (users.length && users.includes(user.id)) {
          const newGroup = await Group.create({ name });

          if (newGroup) {
            for (const userId of users) {
              await GroupUsers.create({
                groupId: newGroup.id,
                userId,
              });
            }
          }

          pubsub.publish("NEW_GROUP", { newGroup });

          return newGroup;
        }
        return null;
      } catch (err) {
        return err;
      }
    },
  },
  Subscription: {
    newGroup: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_GROUP"]),
        async (payload: any, variables: { sentTo: number }) => {
          const groupUsers = await GroupUsers.findAll({
            where: { groupId: payload.newGroup.id },
          });
          return !!groupUsers.find(
            (userGroup: GroupUsersProps) =>
              userGroup.userId === variables.sentTo
          );
        }
      ),
    },
  },
  Group: {
    users: async (parent: any) => {
      const list = await GroupUsers.findAll({ where: { groupId: parent.id } });
      const idList = list.map((item: any) => item.userId);

      return await Users.findAll({
        where: {
          id: { [Op.in]: idList },
        },
      });
    },
    messageList: async (parent: any, { filters }: any) => {
      const offset = filters.offset ?? DEFAULT_OFFSET;
      const limit = filters.limit ?? MAX_LIMIT;

      const list = await Messages.findAll({
        where: { groupId: parent.id },
        offset: limit * offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      const total = await Messages.count({ where: { groupId: parent.id } });

      return {
        messages: list,
        total,
      };
    },
  },
};

export default resolvers;
