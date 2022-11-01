"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class holdings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  holdings.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ticker: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tradeDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      costPerQuantity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      customCategory: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "holdings",
    }
  );
  return holdings;
};
