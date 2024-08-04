import { PubSub, withFilter } from "graphql-subscriptions";
import {
  AuthUser,
  Friend,
  FriendStatusProps,
  ListUsersProps,
} from "../../interfaces";
import models from "../../models";
import { DEFAULT_OFFSET, MAX_LIMIT } from "../../contants";
import { Op } from "sequelize";

const { Friends, FriendStatus, Users } = models;
const pubsub = new PubSub();

const resolvers = {
  Query: {
    async getUser(
      _: any,
      { id }: { id: number },
      context: { authUser: AuthUser }
    ) {
      try {
        const {
          authUser: { user },
        } = context;

        if (user) {
          return await Users.findById(id);
        }
        return null;
      } catch (err) {
        return err;
      }
    },
    async listUsers(
      _: any,
      { filters }: ListUsersProps,
      context: { authUser: AuthUser }
    ) {
      try {
        const {
          authUser: { user },
        } = context;

        if (user) {
          const offset = filters.offset ?? DEFAULT_OFFSET;
          const limit = filters.limit ?? MAX_LIMIT;

          let userIds: number[] = [];
          if (filters.statusId || filters.notStatusId) {
            let friends: Friend[] = [];

            if (filters.statusId) {
              const conditions: [
                | { friendStatusId: number; requestId: number }
                | { friendStatusId: number; targetId: number }
              ] = [
                {
                  friendStatusId: filters.statusId,
                  targetId: user.id,
                },
              ];
              if (filters.statusId !== 3) {
                conditions.push({
                  friendStatusId: filters.statusId,
                  requestId: user.id,
                });
              }

              friends = await Friends.findAll({
                where: {
                  [Op.or]: conditions,
                },
              });
            } else if (filters.notStatusId) {
              friends = await Friends.findAll({
                where: {
                  friendStatusId: { [Op.not]: filters.notStatusId },
                  [Op.or]: {
                    targetId: user.id,
                    requestId: user.id,
                  },
                },
              });
            }

            userIds = friends.map((friend: Friend) =>
              friend.requestId === user.id ? friend.targetId : friend.requestId
            );
          }

          const userFilters =
            filters.statusId || filters.notStatusId
              ? { id: { [Op.in]: userIds } }
              : { id: { [Op.ne]: user.id } };

          const list = await Users.findAll({
            where: userFilters,
            offset: limit * offset,
            limit,
          });

          const total = await Users.count({ where: userFilters });

          return {
            users: list,
            total,
          };
        }

        return {
          users: [],
          total: 0,
        };
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    async addFriend(
      _: any,
      { id }: { id: number },
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user) {
          const isFriend = await Friends.findOne({
            where: {
              [Op.or]: [
                { requestId: id, targetId: user.id },
                { targetId: id, requestId: user.id },
              ],
            },
          });
          if (!isFriend) {
            const newFriend = await Friends.create({
              requestId: user.id,
              targetId: id,
              friendStatusId: 1, // request
            });

            pubsub.publish("NEW_REQUEST", { sendRequest: newFriend });

            return "Request sent!";
          }
          return "Request failed!";
        }
        return "Request failed!";
      } catch (err) {
        return err;
      }
    },
    async removeFriend(
      _: any,
      { id }: { id: number },
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user) {
          await Friends.destroy({ where: { id } });
          return "Friend/request removed!";
        }
        return "Request failed!";
      } catch (err) {
        return err;
      }
    },
    async changeFriendStatus(
      _: any,
      { newStatus: { id, statusId } }: FriendStatusProps,
      context: { authUser: AuthUser }
    ) {
      const {
        authUser: { user },
      } = context;

      try {
        if (user && id) {
          const friendRequest = await Friends.findOne({
            id,
            targetId: user.id,
          });
          if (friendRequest) {
            await Friends.update(
              { friendStatusId: statusId },
              { where: { id } }
            );

            if (statusId === 2) {
              // accepted
              pubsub.publish("NEW_FRIEND", {
                updateRequest: await Friends.findOne({
                  id,
                }),
              });
            }
          }
          return "Status changed";
        }
        return "Request failed!";
      } catch (err) {
        return err;
      }
    },
  },
  Subscription: {
    sendRequest: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_REQUEST"]),
        async (payload: any, variables: { sentTo: string }) => {
          return payload.sendRequest.targetId === variables.sentTo;
        }
      ),
    },
    updateRequest: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_FRIEND"]),
        (payload: any, variables: { sentFrom: string }) =>
          payload.updateRequest.requestId === variables.sentFrom
      ),
    },
  },
  Friend: {
    request: async (parent: any) =>
      await Users.findOne({ where: { id: parent.requestId } }),
    target: async (parent: any) =>
      await Users.findOne({ where: { id: parent.targetId } }),
    status: async (parent: any) =>
      await FriendStatus.findOne({ where: { id: parent.friendStatusId } }),
  },
  User: {
    friends: async (
      parent: any,
      _: any,
      { authUser }: { authUser: AuthUser }
    ) =>
      await Friends.findAll({
        where: {
          [Op.or]: [
            {
              targetId: parent.id,
              requestId: authUser.user.id,
            },
            {
              targetId: authUser.user.id,
              requestId: parent.id,
            },
          ],
        },
      }),
  },
};

export default resolvers;
