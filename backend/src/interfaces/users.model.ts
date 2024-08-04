import { Pagination } from "./pagination.model";

export interface ListUsersPaginated extends Pagination {
  statusId: number;
  notStatusId: number;
}

export interface ListUsersProps {
  filters: ListUsersPaginated;
}

export interface FriendStatusProps {
  newStatus: {
    id: number;
    statusId: number;
  };
}

export interface UserModel {
  id: number;
  username: string;
  password: string;
}
