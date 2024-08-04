"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class Messages extends Model {
    static associate(models: any) {
      Messages.belongsTo(models.Group, { foreignKey: "groupId" });
      Messages.belongsTo(models.Users, { foreignKey: "userId" });
      Messages.hasMany(models.MessageUsers);
    }
  }
  Messages.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      groupId: {
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
      message: {
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
      modelName: "Messages",
    }
  );
  return Messages;
};
