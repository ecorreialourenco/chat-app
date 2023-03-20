import { StatusEnum } from "../enum/status.enum";
import { User } from "./user.model";

export interface Message {
  id: string;
  message: string;
  sentBy?: User;
  sentTo?: User;
  status: StatusEnum;
  date: string;
}

export interface Chat {
  id: string;
  username: string;
  messages: Message[];
  haveNewMessages?: boolean;
}
