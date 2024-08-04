import { mergeResolvers } from "@graphql-tools/merge";
import AuthResolvers from "./authResolvers";
import GroupResolvers from "./groupResolvers";
import MessageResolvers from "./messageResolvers";
import UserResolvers from "./userResolvers";

export default mergeResolvers([
  AuthResolvers,
  GroupResolvers,
  MessageResolvers,
  UserResolvers,
]) as any;
