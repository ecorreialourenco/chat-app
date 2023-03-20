import { IUser } from "./user";

export interface IMessage {
  message: string;
  date: string;
  sentBy: IUser | null;
  sentTo: IUser | null;
}
