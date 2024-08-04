"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class MessageUsers extends Model {
    static associate(models: any) {
      MessageUsers.belongsTo(models.Messages, { foreignKey: "messageId" });
      MessageUsers.belongsTo(models.Users, { foreignKey: "userId" });
    }
  }
  MessageUsers.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "This field is required!",
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "This field is required!",
          },
        },
      },
      hasRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      modelName: "MessageUsers",
    }
  );
  return MessageUsers;
};
