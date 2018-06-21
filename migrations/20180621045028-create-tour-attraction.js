'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tour_attraction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tourPackageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          model: 'tourPackage',
          key: 'id'
        }
      },
      attractionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        reference: {
          model: 'attraction',
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
    return queryInterface.dropTable('tour_attraction');
  }
};