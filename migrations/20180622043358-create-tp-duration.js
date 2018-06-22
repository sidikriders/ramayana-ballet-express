'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tpDurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      day: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      night: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tpId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          model: 'tourPackages',
          key: 'id'
        }
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
    return queryInterface.dropTable('tpDurations');
  }
};