"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class Group extends Model {
    static associate(models: any) {
      Group.hasMany(models.GroupUsers);
      Group.hasMany(models.Messages);
    }
  }
  Group.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
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
      modelName: "Group",
    }
  );
  return Group;
};
