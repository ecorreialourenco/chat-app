"use strict";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("friend_statuses", [
      {
        id: "1",
        status: "Request",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: "2",
        status: "Accepted",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: "3",
        status: "Bloqued",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("friend_statuses", null, {});
  },
};
