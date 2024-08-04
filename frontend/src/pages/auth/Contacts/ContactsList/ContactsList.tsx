import React, { ReactNode } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { UserFriend } from "../../../../models";
import { TABLE_LIMIT } from "src/variables";

interface ContactsListProps {
  list: any[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  ActionsChildren: (id: number) => ReactNode;
}

export const ContactsList = ({
  list,
  total,
  page,
  onPageChange,
  ActionsChildren,
}: ContactsListProps) => {
  const totalPages = Math.ceil(total / TABLE_LIMIT);

  return (
    <div>
      <Table size="small" sx={{ width: "100%" }} aria-label="list">
        <TableHead>
          <TableRow style={{ backgroundColor: "lightGray" }}>
            <TableCell>Username</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((contact: UserFriend) => (
            <TableRow key={contact.id}>
              <TableCell component="th" scope="row">
                {contact.username}
              </TableCell>
              <TableCell align="right">{ActionsChildren(contact.id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination
          page={page}
          count={totalPages}
          onChange={(event: React.ChangeEvent<unknown>, page: number) =>
            onPageChange(page)
          }
        />
      )}
    </div>
  );
};
