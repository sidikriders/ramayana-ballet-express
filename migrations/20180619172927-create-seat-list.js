'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('seatLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      showTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'showTypes',
          key: 'id'
        }
      },
      row: {
        type: Sequelize.STRING,
        allowNull: false
      },
      column: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seatLists');
  }
};