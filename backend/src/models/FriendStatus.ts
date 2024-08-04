"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class FriendStatus extends Model {
    static associate(models: any) {
      FriendStatus.hasMany(models.Friends, { foreignKey: "friendStatusId" });
    }
  }
  FriendStatus.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "This field is required!",
          },
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      modelName: "FriendStatus",
    }
  );
  return FriendStatus;
};
