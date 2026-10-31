const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allownull: false,
      references: { model: "users", key: "id" },
    },
    token: {
      type: DataTypes.STRING,
      allownull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "Session",
  },
);

module.exports = Session;
