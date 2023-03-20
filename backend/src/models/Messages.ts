import moongose from "mongoose";

interface MessagesAttrs {
  message: string;
  date: string;
  sentBy: string;
  sentTo: string;
  status: string;
}

export interface MessagesDocs extends moongose.Document {
  message: string;
  date: string;
  sentBy: string;
  sentTo: string;
  status: string;
}

interface MessagesModel extends moongose.Model<MessagesDocs> {
  build(attrs: MessagesAttrs): MessagesDocs;
}

const messages = new moongose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    sentBy: {
      type: String,
      required: true,
    },
    sentTo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
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

messages.statics.build = (attrs: MessagesAttrs) => {
  return new Messages(attrs);
};

const Messages = moongose.model<MessagesDocs, MessagesModel>(
  "Messages",
  messages
);

export { Messages };
