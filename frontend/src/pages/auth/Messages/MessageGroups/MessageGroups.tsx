import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { LIST_USER_GROUPS } from "../../../../queries/messages";
import { useLazyQuery } from "@apollo/client";
import { TABLE_LIMIT } from "src/variables";
import { useEffect, useState } from "react";
import { Group, ListGroups } from "src/models";
import { Link } from "react-router-dom";

export const MessageGroups = () => {
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<Group[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [listUserGroups] = useLazyQuery(LIST_USER_GROUPS);

  const handleListUsers = () => {
    const offset = TABLE_LIMIT * (page - 1);
    listUserGroups({
      variables: {
        limit: TABLE_LIMIT,
        offset,
      },
    }).then(({ data }: { data: { listGroups: ListGroups } }) => {
      if (data) {
        setList(data.listGroups.group);
        setTotalPages(Math.ceil(data.listGroups.total / TABLE_LIMIT));
      }
    });
  };

  useEffect(() => {
    handleListUsers();
  }, [listUserGroups, page]);

  return (
    <div>
      <h1>Messages List</h1>
      <Table size="small" sx={{ width: "100%" }} aria-label="list">
        <TableHead>
          <TableRow style={{ backgroundColor: "lightGray" }}>
            <TableCell>Group</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((listGroup: Group) => (
            <TableRow key={listGroup.id}>
              <TableCell component="th" scope="row">
                {listGroup.name}
              </TableCell>
              <TableCell>{listGroup.users.length}</TableCell>
              <TableCell align="right">
                <Link to={`/messages/${listGroup.id}`}>
                  <Button color="inherit">Chat</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination
          page={page}
          count={totalPages}
          onChange={(event: React.ChangeEvent<unknown>, newPage: number) =>
            setPage(newPage)
          }
        />
      )}
    </div>
  );
};
