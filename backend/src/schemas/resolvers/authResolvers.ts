import bcrypt from "bcrypt";
import models from "../../models";
import { LoginProps, SignupProps } from "../../interfaces";
import { getToken } from "../../utils/getToken";

const { Users } = models;

const resolvers = {
  Query: {
    async login(_: any, { login: { username, password } }: LoginProps) {
      try {
        const user = await Users.findOne({ username });
        const userPassword = user.password || "";
        const valid = await bcrypt.compare(password, userPassword);
        if (valid) {
          return await getToken(user);
        }

        return null;
      } catch (err) {
        return err;
      }
    },
    async checkUsername(_: any, { username }: { username: string }) {
      try {
        return !!(await Users.findOne({ username }));
      } catch (err) {
        return false;
      }
    },
  },
  Mutation: {
    async signup(
      _: any,
      { signup: { username, password, password2 } }: SignupProps
    ) {
      try {
        if (password !== password2) {
          return "Passwords doesn't match";
        }

        const user = await Users.create({
          username,
          password: await bcrypt.hash(password, 10),
        });

        return getToken(user);
      } catch (err) {
        return err;
      }
    },
  },
};

export default resolvers;
