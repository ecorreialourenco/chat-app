"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class GroupUsers extends Model {
    static associate(models: any) {
      GroupUsers.belongsTo(models.Group, { foreignKey: "groupId" });
      GroupUsers.belongsTo(models.Users, { foreignKey: "userId" });
    }
  }
  GroupUsers.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      modelName: "GroupUsers",
    }
  );
  return GroupUsers;
};
