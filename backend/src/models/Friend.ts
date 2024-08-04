"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class Friends extends Model {
    static associate(models: any) {
      Friends.belongsTo(models.Users, { foreignKey: "requestId" });
      Friends.belongsTo(models.Users, { foreignKey: "targetId" });
      Friends.belongsTo(models.FriendStatus, { foreignKey: "friendStatusId" });
    }
  }
  Friends.init(
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
      modelName: "Friends",
    }
  );
  return Friends;
};
