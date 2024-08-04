"use strict";
import { Model } from "sequelize";

const Users = (sequelize: any, DataTypes: any) => {
  class Users extends Model {
    static associate(models: any) {
      Users.hasMany(models.Friends, { foreignKey: "requestId" });
      Users.hasMany(models.Friends, { foreignKey: "targetId" });

      Users.hasMany(models.GroupUsers);
      Users.hasMany(models.Messages);
      Users.hasMany(models.MessageUsers);
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "username",
          msg: "Username already in use!",
        },
        validate: {
          notEmpty: {
            msg: "This field is required!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "This field is required!",
          },
        },
      },
      isVisible: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      paranoid: true,
      underscored: true,
      modelName: "Users",
    }
  );
  return Users;
};

export default Users;
