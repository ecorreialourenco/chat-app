import { Pagination } from "./pagination.model";

export interface ListGroupsProps {
  filters: Pagination;
}

export interface AddGroupProps {
  addGroup: {
    name: string;
    users: [number];
  };
}

export interface GroupUsersProps {
  id: number;
  userId: number;
}
