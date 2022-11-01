"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("holdings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ticker: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tradeDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      costPerQuantity: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      customCategory: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("holdings");
  },
};
