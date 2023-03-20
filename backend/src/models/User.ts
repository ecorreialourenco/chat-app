import moongose from "mongoose";
import { MessagesDocs } from "./Messages";

interface UserAttrs {
  username: string;
  password: string;
  messages: Array<MessagesDocs>;
}

export interface UserDocs extends moongose.Document {
  username: string;
  password: string;
  messages: Array<MessagesDocs>;
}

interface UserModel extends moongose.Model<UserDocs> {
  build(attrs: UserAttrs): UserDocs;
}

const userSchema = new moongose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    messages: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = moongose.model<UserDocs, UserModel>("User", userSchema);

export { User };
