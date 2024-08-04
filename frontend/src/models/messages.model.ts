import { User, UserFriend } from "./user.model";

export interface ListGroups {
  group: Group[];
  total: number;
}

export interface Group {
  id: number;
  name: string;
  users: UserFriend[];
}

export interface Message {
  id: number;
  message: string;
  userId: number;
  user: User;
  createdAt: Date;
  updateddAt: Date;
}
